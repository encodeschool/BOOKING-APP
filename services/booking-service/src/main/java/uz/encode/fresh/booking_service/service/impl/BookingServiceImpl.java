package uz.encode.fresh.booking_service.service.impl;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import feign.FeignException;
import lombok.RequiredArgsConstructor;
import uz.encode.fresh.booking_service.dto.BookingResponse;
import uz.encode.fresh.booking_service.dto.CreateBookingRequest;
import uz.encode.fresh.booking_service.dto.UpdateBookingStatusRequest;
import uz.encode.fresh.booking_service.entity.Booking;
import uz.encode.fresh.booking_service.integration.CoreServiceClient;
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

        LocalTime endTime = request.startTime.plusMinutes(service.durationMinutes());

        Booking booking = new Booking();
        booking.setClientId(clientId);
        booking.setBusinessId(business.id());
        booking.setServiceId(service.id());
        booking.setStaffId(staff.id());
        booking.setBookingDate(request.bookingDate);
        booking.setStartTime(request.startTime);
        booking.setEndTime(endTime);
        booking.setStatus(BookingStatus.PENDING);
        booking.setNotes(request.notes);

        return toResponse(bookingRepository.save(booking));
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

        return toResponse(bookingRepository.save(booking));
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

        if (request.bookingDate.isEqual(LocalDate.now()) && request.startTime.isBefore(LocalTime.now())) {
            throw new IllegalArgumentException("Booking time cannot be in the past");
        }

        if (service.durationMinutes() == null || service.durationMinutes() <= 0) {
            throw new IllegalArgumentException("Service duration is invalid");
        }

        LocalTime endTime = request.startTime.plusMinutes(service.durationMinutes());
        if (!endTime.isAfter(request.startTime)) {
            throw new IllegalArgumentException("Booking end time is invalid");
        }

        WorkingHoursResponse workingHours = getWorkingHours(request.businessId, request.bookingDate.getDayOfWeek());

        if (workingHours.closed()) {
            throw new IllegalArgumentException("Business is closed on the selected day");
        }

        if (workingHours.startTime() == null || workingHours.endTime() == null) {
            throw new IllegalArgumentException("Working hours are not configured for the selected day");
        }

        if (request.startTime.isBefore(workingHours.startTime()) || endTime.isAfter(workingHours.endTime())) {
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
                request.startTime,
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
                .build();
    }
}
