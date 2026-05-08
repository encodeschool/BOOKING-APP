package uz.encode.fresh.booking_service.service;

import java.util.List;

import uz.encode.fresh.booking_service.dto.BookingResponse;
import uz.encode.fresh.booking_service.dto.CreateBookingRequest;
import uz.encode.fresh.booking_service.dto.CreatePublicBookingRequest;
import uz.encode.fresh.booking_service.dto.DashboardMetricsResponse;
import uz.encode.fresh.booking_service.dto.UpdateBookingStatusRequest;

public interface BookingService {

    BookingResponse create(Long clientId, CreateBookingRequest request);

    List<BookingResponse> getClientBookings(Long clientId);

    List<BookingResponse> getBusinessBookings(Long ownerId, Long businessId);

    BookingResponse getBooking(Long requesterId, Long bookingId);

    BookingResponse updateBusinessStatus(Long ownerId, Long bookingId, UpdateBookingStatusRequest request);

    BookingResponse cancelByClient(Long clientId, Long bookingId, String reason);

    BookingResponse createPublicBooking(CreatePublicBookingRequest request);

    List<String> getAvailableSlots(Long businessId, Long serviceId, String date);

    List<String> getAvailableDates(Long businessId, Long serviceId, Long staffId);

    BookingResponse getStaffBooking(Long staffId, Long bookingId);

    List<BookingResponse> getStaffBookings(Long staffId);

    List<BookingResponse> getCalendar(Long businessId, String from, String to);

    DashboardMetricsResponse getDashboardMetrics(Long businessId);
}
