package uz.encode.fresh.booking_service.service.impl;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import feign.FeignException;
import lombok.RequiredArgsConstructor;
import uz.encode.fresh.booking_service.dto.BookedSlotResponse;
import uz.encode.fresh.booking_service.dto.BookingResponse;
import uz.encode.fresh.booking_service.dto.CreateBookingRequest;
import uz.encode.fresh.booking_service.dto.CreatePublicBookingRequest;
import uz.encode.fresh.booking_service.dto.DashboardMetricsResponse;
import uz.encode.fresh.booking_service.dto.UpdateBookingStatusRequest;
import uz.encode.fresh.booking_service.entity.Booking;
import uz.encode.fresh.booking_service.integration.CoreServiceClient;
import uz.encode.fresh.booking_service.integration.NotificationClient;
import uz.encode.fresh.booking_service.integration.dto.BusinessDetailsResponse;
import uz.encode.fresh.booking_service.integration.dto.ServiceDetailsResponse;
import uz.encode.fresh.booking_service.integration.dto.StaffDetailsResponse;
import uz.encode.fresh.booking_service.integration.dto.WorkingHoursResponse;
import uz.encode.fresh.booking_service.model.BookingStatus;
import uz.encode.fresh.booking_service.repository.BookingRepository;
import uz.encode.fresh.booking_service.service.BookingService;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private static final List<BookingStatus> ACTIVE_BOOKING_STATUSES = List.of(
            BookingStatus.PENDING,
            BookingStatus.CONFIRMED
    );

    private final BookingRepository bookingRepository;
    private final CoreServiceClient coreServiceClient;
    private final NotificationClient notificationClient;

    @Override
    @Transactional
    public BookingResponse create(Long clientId, CreateBookingRequest request) {
        if (clientId == null) {
            throw new IllegalArgumentException("Unauthorized booking request");
        }

        BusinessDetailsResponse business = getBusiness(request.businessId);
        ServiceDetailsResponse service = getService(request.serviceId);
        StaffDetailsResponse staff = getStaff(request.staffId);

        validateBusinessRelations(request, service, staff);
        validateAvailability(request, service, staff);

        LocalTime startTime = LocalTime.parse(request.bookingTime);
        LocalTime endTime = startTime.plusMinutes(service.durationMinutes());

        Booking booking = new Booking();
        booking.setClientId(clientId);
        booking.setBusinessId(business.id());
        booking.setServiceId(service.id());
        booking.setStaffId(staff.id());
        booking.setBookingDate(request.bookingDate);
        booking.setStartTime(startTime);
        booking.setEndTime(endTime);
        booking.setStatus(BookingStatus.PENDING);
        booking.setNotes(request.notes);
        booking.setCustomerEmail(request.customerEmail);
        booking.setCustomerName(request.customerName);
        booking.setCustomerPhone(request.customerPhone);

        Booking savedBooking = bookingRepository.save(booking);

        // Send notification to admin about new booking request
        sendAdminNewBookingNotification(savedBooking);

        return toResponse(savedBooking);
    }

    @Override
    public List<BookingResponse> getClientBookings(Long clientId) {
        return bookingRepository.findByClientIdOrderByBookingDateDescStartTimeDesc(clientId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<BookingResponse> getBusinessBookings(Long ownerId, Long businessId) {
        assertBusinessOwner(ownerId, businessId);
        return bookingRepository.findByBusinessIdOrderByBookingDateDescStartTimeDesc(businessId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public BookingResponse getBooking(Long requesterId, Long bookingId) {
        Booking booking = getBookingEntity(bookingId);
        BusinessDetailsResponse business = getBusiness(booking.getBusinessId());

        if (!booking.getClientId().equals(requesterId) && !business.ownerId().equals(requesterId)) {
            throw new IllegalArgumentException("Booking not accessible");
        }

        return toResponse(booking);
    }

    @Override
    @Transactional
    public BookingResponse updateBusinessStatus(Long ownerId, Long bookingId, UpdateBookingStatusRequest request) {
        Booking booking = getBookingEntity(bookingId);
        assertBusinessOwner(ownerId, booking.getBusinessId());

        BookingStatus nextStatus = request.status;
        if (nextStatus == BookingStatus.PENDING) {
            throw new IllegalArgumentException("Cannot revert booking to pending");
        }

        validateBusinessTransition(booking.getStatus(), nextStatus);
        booking.setStatus(nextStatus);
        booking.setStatusReason(request.reason);

        BookingResponse response = toResponse(bookingRepository.save(booking));
        
        // Send notification to customer about booking status change
        sendBookingStatusNotification(booking, nextStatus, request.reason);

        // If booking is confirmed, send confirmation email
        if (nextStatus == BookingStatus.CONFIRMED) {
            sendBookingConfirmation(booking);
        }

        return response;
    }

    @Override
    @Transactional
    public BookingResponse cancelByClient(Long clientId, Long bookingId, String reason) {
        Booking booking = getBookingEntity(bookingId);
        if (!booking.getClientId().equals(clientId)) {
            throw new IllegalArgumentException("Booking not accessible");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED
                || booking.getStatus() == BookingStatus.COMPLETED
                || booking.getStatus() == BookingStatus.REJECTED) {
            throw new IllegalArgumentException("Booking cannot be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setStatusReason(reason);
        return toResponse(bookingRepository.save(booking));
    }

    @Override
    @Transactional
    public BookingResponse createPublicBooking(CreatePublicBookingRequest request) {
        Objects.requireNonNull(request, "CreatePublicBookingRequest is required");
        Objects.requireNonNull(request.businessId, "Business id is required");
        Objects.requireNonNull(request.serviceId, "Service id is required");

        // Skip detailed validation for public bookings - we'll validate during actual booking creation
        CreateBookingRequest internalRequest = new CreateBookingRequest();
        internalRequest.businessId = request.businessId;
        internalRequest.serviceId = request.serviceId;
        internalRequest.staffId = request.staffId != null ? request.staffId : getAvailableStaff(request.businessId);
        internalRequest.bookingDate = request.bookingDate;
        internalRequest.bookingTime = request.startTime;
        internalRequest.customerName = request.customerName;
        internalRequest.customerEmail = request.customerEmail;
        internalRequest.customerPhone = request.customerPhone;
        internalRequest.notes = request.notes;

        return create(-1L, internalRequest); // Use default public client ID
    }

    private Long getAvailableStaff(Long businessId) {
        // Get all staff for the business and return the first available one
        List<StaffDetailsResponse> staffList = coreServiceClient.getStaffByBusiness(businessId);
        return staffList.stream()
                .filter(staff -> Boolean.TRUE.equals(staff.active()))
                .findFirst()
                .map(StaffDetailsResponse::id)
                .orElseThrow(() -> new IllegalArgumentException("No available staff found"));
    }

    @Override
    public List<String> getAvailableSlots(Long businessId, Long serviceId, String date) {
        LocalDate bookingDate = LocalDate.parse(date);
        ServiceDetailsResponse service = getService(serviceId);
        WorkingHoursResponse workingHours = getWorkingHours(businessId, bookingDate.getDayOfWeek());

        if (workingHours.closed() || workingHours.startTime() == null || workingHours.endTime() == null) {
            return List.of();
        }

        List<String> availableSlots = new java.util.ArrayList<>();
        LocalTime currentTime = workingHours.startTime();

        // Get all active staff for this business
        List<StaffDetailsResponse> staffList = coreServiceClient.getStaffByBusiness(businessId);

        while (currentTime.isBefore(workingHours.endTime())) {
            LocalTime endTime = currentTime.plusMinutes(service.durationMinutes());

            if (endTime.isAfter(workingHours.endTime())) {
                break;
            }

            // Check if slot is available for at least one staff member
            boolean isAvailable = false;
            for (StaffDetailsResponse staff : staffList) {
                if (Boolean.TRUE.equals(staff.active())) {
                    boolean hasOverlappingBooking = bookingRepository.existsOverlappingBooking(
                            staff.id(),
                            bookingDate,
                            currentTime,
                            endTime,
                            ACTIVE_BOOKING_STATUSES
                    );

                    if (!hasOverlappingBooking) {
                        // Check if staff hasn't exceeded daily limit
                        long bookingCount = bookingRepository.countByStaffIdAndBookingDateAndStatusIn(
                                staff.id(),
                                bookingDate,
                                ACTIVE_BOOKING_STATUSES
                        );

                        Integer maxBookingsValue = staff.maxBookingsPerDay();
                        int maxBookings = maxBookingsValue != null ? maxBookingsValue : 20;
                        if (bookingCount < maxBookings) {
                            isAvailable = true;
                            break;
                        }
                    }
                }
            }

            if (isAvailable) {
                availableSlots.add(currentTime.toString());
            }

            currentTime = currentTime.plusMinutes(30); // 30-minute intervals
        }

        return availableSlots;
    }

    @Override
    public List<String> getAvailableDates(Long businessId, Long serviceId, Long staffId) {
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(30); // Check next 30 days
        List<String> availableDates = new java.util.ArrayList<>();

        ServiceDetailsResponse service = getService(serviceId);
        StaffDetailsResponse staff = staffId != null ? getStaff(staffId) : null;

        for (LocalDate date = today; !date.isAfter(endDate); date = date.plusDays(1)) {
            WorkingHoursResponse workingHours = getWorkingHours(businessId, date.getDayOfWeek());

            if (!workingHours.closed() && workingHours.startTime() != null && workingHours.endTime() != null) {
                // Check if there's at least one available slot for this date
                LocalTime currentTime = workingHours.startTime();
                boolean hasSlot = false;

                while (currentTime.isBefore(workingHours.endTime())) {
                    LocalTime endTime = currentTime.plusMinutes(service.durationMinutes());

                    if (endTime.isAfter(workingHours.endTime())) {
                        break;
                    }

                    // If no specific staff selected, check any staff; otherwise check specific staff
                    if (staff == null) {
                        List<StaffDetailsResponse> staffList = coreServiceClient.getStaffByBusiness(businessId);
                        for (StaffDetailsResponse s : staffList) {
                            if (Boolean.TRUE.equals(s.active())) {
                                boolean hasOverlappingBooking = bookingRepository.existsOverlappingBooking(
                                        s.id(), date, currentTime, endTime, ACTIVE_BOOKING_STATUSES
                                );
                                long bookingCount = bookingRepository.countByStaffIdAndBookingDateAndStatusIn(
                                        s.id(), date, ACTIVE_BOOKING_STATUSES
                                );
                                Integer maxBookingsValue = s.maxBookingsPerDay();
                                int maxBookings = maxBookingsValue != null ? maxBookingsValue : 20;

                                if (!hasOverlappingBooking && bookingCount < maxBookings) {
                                    hasSlot = true;
                                    break;
                                }
                            }
                        }
                    } else {
                        boolean hasOverlappingBooking = bookingRepository.existsOverlappingBooking(
                                staff.id(), date, currentTime, endTime, ACTIVE_BOOKING_STATUSES
                        );
                        long bookingCount = bookingRepository.countByStaffIdAndBookingDateAndStatusIn(
                                staff.id(), date, ACTIVE_BOOKING_STATUSES
                        );
                        Integer maxBookingsValue = staff.maxBookingsPerDay();
                        int maxBookings = maxBookingsValue != null ? maxBookingsValue : 20;

                        if (!hasOverlappingBooking && bookingCount < maxBookings) {
                            hasSlot = true;
                            break;
                        }
                    }

                    currentTime = currentTime.plusMinutes(30);
                }

                if (hasSlot) {
                    availableDates.add(date.toString());
                }
            }
        }

        return availableDates;
    }

    @Override
    public BookingResponse getStaffBooking(Long staffId, Long bookingId) {
        Booking booking = getBookingEntity(bookingId);
        if (!booking.getStaffId().equals(staffId)) {
            throw new IllegalArgumentException("Booking not accessible");
        }
        return toResponse(booking);
    }

    @Override
    public List<BookingResponse> getStaffBookings(Long staffId) {
        return bookingRepository.findByStaffIdOrderByBookingDateDescStartTimeDesc(staffId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private void sendBookingStatusNotification(Booking booking, BookingStatus status, String reason) {
        try {
            Map<String, Object> notificationData = new HashMap<>();
            notificationData.put("customerEmail", booking.getCustomerEmail());
            notificationData.put("customerName", booking.getCustomerName());
            notificationData.put("bookingId", "BK-" + booking.getId());
            notificationData.put("serviceName", getService(booking.getServiceId()).name());
            notificationData.put("staffName", getStaff(booking.getStaffId()).name());
            notificationData.put("businessName", getBusiness(booking.getBusinessId()).name());
            notificationData.put("bookingDate", booking.getBookingDate().toString());
            notificationData.put("bookingTime", booking.getStartTime().toString());
            notificationData.put("duration", getService(booking.getServiceId()).durationMinutes() + " minutes");
            notificationData.put("status", status.name().toLowerCase());
            notificationData.put("reason", reason != null ? reason : "");

            notificationClient.sendBookingStatusUpdate(notificationData);
        } catch (Exception e) {
            // Log but don't fail the booking update if notification fails
            System.err.println("Failed to send status notification: " + e.getMessage());
        }
    }

    private void sendBookingConfirmation(Booking booking) {
        try {
            BusinessDetailsResponse business = getBusiness(booking.getBusinessId());
            ServiceDetailsResponse service = getService(booking.getServiceId());
            StaffDetailsResponse staff = getStaff(booking.getStaffId());

            Map<String, Object> notificationData = new HashMap<>();
            notificationData.put("customerEmail", booking.getCustomerEmail());
            notificationData.put("customerName", booking.getCustomerName());
            notificationData.put("bookingId", "BK-" + booking.getId());
            notificationData.put("serviceName", service.name());
            notificationData.put("staffName", staff.name());
            notificationData.put("businessName", business.name());
            notificationData.put("businessAddress", "Business Address"); // TODO: Add address field to BusinessDetailsResponse
            notificationData.put("bookingDate", booking.getBookingDate().toString());
            notificationData.put("bookingTime", booking.getStartTime().toString());
            notificationData.put("duration", service.durationMinutes() + " minutes");

            notificationClient.sendBookingConfirmation(notificationData);
        } catch (Exception e) {
            // Log but don't fail the booking confirmation if notification fails
            System.err.println("Failed to send booking confirmation: " + e.getMessage());
        }
    }

    private void sendAdminNewBookingNotification(Booking booking) {
        try {
            BusinessDetailsResponse business = getBusiness(booking.getBusinessId());
            ServiceDetailsResponse service = getService(booking.getServiceId());
            StaffDetailsResponse staff = getStaff(booking.getStaffId());

            // For now, send to a placeholder admin email - this should be configurable per business
            String adminEmail = "nergashev.evolution@gmail.com"; // TODO: Get from business settings

            Map<String, Object> notificationData = new HashMap<>();
            notificationData.put("adminEmail", adminEmail);
            notificationData.put("adminName", "Business Admin"); // TODO: Get actual admin name
            notificationData.put("bookingId", "BK-" + booking.getId());
            notificationData.put("customerName", booking.getCustomerName());
            notificationData.put("customerEmail", booking.getCustomerEmail());
            notificationData.put("customerPhone", booking.getCustomerPhone() != null ? booking.getCustomerPhone() : "");
            notificationData.put("serviceName", service.name());
            notificationData.put("staffName", staff.name());
            notificationData.put("businessName", business.name());
            notificationData.put("bookingDate", booking.getBookingDate().toString());
            notificationData.put("bookingTime", booking.getStartTime().toString());
            notificationData.put("duration", service.durationMinutes() + " minutes");
            notificationData.put("notes", booking.getNotes() != null ? booking.getNotes() : "");
            notificationData.put("todayBookings", "5"); // TODO: Get actual count
            notificationData.put("pendingBookings", "3"); // TODO: Get actual count
            notificationData.put("nextAvailable", "Tomorrow 10:00 AM"); // TODO: Calculate next available

            notificationClient.sendAdminNewBookingNotification(notificationData);
        } catch (Exception e) {
            // Log but don't fail the booking creation if notification fails
            System.err.println("Failed to send admin notification: " + e.getMessage());
        }
    }



    private void validateBusinessRelations(CreateBookingRequest request,
                                           ServiceDetailsResponse service,
                                           StaffDetailsResponse staff) {
        if (!Boolean.TRUE.equals(service.active())) {
            throw new IllegalArgumentException("Selected service is inactive");
        }

        if (!Boolean.TRUE.equals(staff.active())) {
            throw new IllegalArgumentException("Selected staff member is inactive");
        }

        if (!request.businessId.equals(service.businessId())) {
            throw new IllegalArgumentException("Service does not belong to the selected business");
        }

        if (!request.businessId.equals(staff.businessId())) {
            throw new IllegalArgumentException("Staff member does not belong to the selected business");
        }
    }

    private void validateAvailability(CreateBookingRequest request,
                                      ServiceDetailsResponse service,
                                      StaffDetailsResponse staff) {
        if (request.bookingDate.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Booking date cannot be in the past");
        }

        LocalTime startTime = LocalTime.parse(request.bookingTime);
        if (request.bookingDate.isEqual(LocalDate.now()) && startTime.isBefore(LocalTime.now())) {
            throw new IllegalArgumentException("Booking time cannot be in the past");
        }

        if (service.durationMinutes() == null || service.durationMinutes() <= 0) {
            throw new IllegalArgumentException("Service duration is invalid");
        }

        LocalTime endTime = startTime.plusMinutes(service.durationMinutes());
        if (!endTime.isAfter(startTime)) {
            throw new IllegalArgumentException("Booking end time is invalid");
        }

        WorkingHoursResponse workingHours = getWorkingHours(request.businessId, request.bookingDate.getDayOfWeek());

        if (workingHours.closed()) {
            throw new IllegalArgumentException("Business is closed on the selected day");
        }

        if (workingHours.startTime() == null || workingHours.endTime() == null) {
            throw new IllegalArgumentException("Working hours are not configured for the selected day");
        }

        if (startTime.isBefore(workingHours.startTime()) || endTime.isAfter(workingHours.endTime())) {
            throw new IllegalArgumentException("Booking time is outside working hours");
        }

        long bookingCount = bookingRepository.countByStaffIdAndBookingDateAndStatusIn(
                staff.id(),
                request.bookingDate,
                ACTIVE_BOOKING_STATUSES
        );

        if (staff.maxBookingsPerDay() != null && bookingCount >= staff.maxBookingsPerDay()) {
            throw new IllegalArgumentException("Staff daily booking limit reached");
        }

        boolean overlaps = bookingRepository.existsOverlappingBooking(
                staff.id(),
                request.bookingDate,
                startTime,
                endTime,
                ACTIVE_BOOKING_STATUSES
        );

        if (overlaps) {
            throw new IllegalArgumentException("Selected time slot is already booked");
        }
    }

    private void validateBusinessTransition(BookingStatus current, BookingStatus next) {
        if (current == BookingStatus.CANCELLED
                || current == BookingStatus.REJECTED
                || current == BookingStatus.COMPLETED) {
            throw new IllegalArgumentException("Booking status can no longer be changed");
        }

        boolean valid = switch (next) {
            case CONFIRMED -> current == BookingStatus.PENDING;
            case REJECTED -> current == BookingStatus.PENDING;
            case COMPLETED -> current == BookingStatus.CONFIRMED;
            case CANCELLED -> current == BookingStatus.PENDING || current == BookingStatus.CONFIRMED;
            default -> false;
        };

        if (!valid) {
            throw new IllegalArgumentException("Invalid booking status transition");
        }
    }

    private Booking getBookingEntity(Long bookingId) {
        Objects.requireNonNull(bookingId, "Booking id is required");
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
    }

    private void assertBusinessOwner(Long ownerId, Long businessId) {
        BusinessDetailsResponse business = getBusiness(businessId);
        if (!business.ownerId().equals(ownerId)) {
            throw new IllegalArgumentException("Business not accessible");
        }
    }

    private BusinessDetailsResponse getBusiness(Long businessId) {
        try {
            return coreServiceClient.getBusiness(businessId);
        } catch (FeignException.NotFound ex) {
            throw new IllegalArgumentException("Business not found");
        }
    }

    private ServiceDetailsResponse getService(Long serviceId) {
        try {
            return coreServiceClient.getService(serviceId);
        } catch (FeignException.NotFound ex) {
            throw new IllegalArgumentException("Service not found");
        }
    }

    private StaffDetailsResponse getStaff(Long staffId) {
        try {
            return coreServiceClient.getStaff(staffId);
        } catch (FeignException.NotFound ex) {
            throw new IllegalArgumentException("Staff not found");
        }
    }

    private WorkingHoursResponse getWorkingHours(Long businessId, java.time.DayOfWeek dayOfWeek) {
        try {
            return coreServiceClient.getWorkingHours(businessId, dayOfWeek);
        } catch (FeignException.NotFound ex) {
            throw new IllegalArgumentException("Working hours not found for the selected day");
        }
    }

    private BookingResponse toResponse(Booking booking) {

        ServiceDetailsResponse service = null;
        StaffDetailsResponse staff = null;

        try {
            service = coreServiceClient.getService(booking.getServiceId());
        } catch (Exception ignored) {
        }

        try {
            staff = coreServiceClient.getStaff(booking.getStaffId());
        } catch (Exception ignored) {
        }
        
        return BookingResponse.builder()
                .id(booking.getId())
                .clientId(booking.getClientId())
                .businessId(booking.getBusinessId())
                .serviceId(booking.getServiceId())
                .staffId(booking.getStaffId())
                .bookingDate(booking.getBookingDate())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .status(booking.getStatus())
                .notes(booking.getNotes())
                .statusReason(booking.getStatusReason())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .customerName(booking.getCustomerName())
                .customerPhone(booking.getCustomerPhone())
                .customerEmail(booking.getCustomerEmail())

                // ADD THESE
                .service(service)
                .staff(staff)

                .build();
    }

    @Override
    public List<BookingResponse> getCalendar(Long businessId, String from, String to) {

        LocalDate start = LocalDate.parse(from);
        LocalDate end = LocalDate.parse(to);

        return bookingRepository.findByBusinessIdAndBookingDateBetween(
                businessId, start, end
        ).stream().map(this::toResponse).toList();
    }

    @Override
    public DashboardMetricsResponse getDashboardMetrics(Long businessId) {

        long totalBookings =
                bookingRepository.countByBusinessId(businessId);

        long pendingBookings =
                bookingRepository.countByBusinessIdAndStatus(
                        businessId,
                        BookingStatus.PENDING
                );

        long completedBookings =
                bookingRepository.countByBusinessIdAndStatus(
                        businessId,
                        BookingStatus.COMPLETED
                );

        // TODO: replace with real payment/revenue logic
        double revenue = completedBookings * 50.0;

        return DashboardMetricsResponse.builder()
                .revenue(revenue)
                .bookings(totalBookings)
                .pending(pendingBookings)
                .completed(completedBookings)

                // temporary static growth
                .revenueGrowth(18)
                .bookingGrowth(12)
                .pendingGrowth(4)
                .completedGrowth(22)

                .build();
    }

    @Override
    public List<BookedSlotResponse> getBookedSlots(Long staffId, LocalDate date) {

        return bookingRepository.findByStaffIdAndBookingDate(staffId, date)
                .stream()
                .map(b -> {
                    BookedSlotResponse r = new BookedSlotResponse();
                    r.date = b.getBookingDate().toString();
                    r.time = b.getStartTime().toString(); // "14:30"
                    return r;
                })
                .toList();
    }
}
