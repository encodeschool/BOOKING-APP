package uz.encode.fresh.booking_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import uz.encode.fresh.booking_service.dto.BookingResponse;
import uz.encode.fresh.booking_service.dto.CreateBookingRequest;
import uz.encode.fresh.booking_service.dto.UpdateBookingStatusRequest;
import uz.encode.fresh.booking_service.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public BookingResponse create(HttpServletRequest request,
                                  @Valid @RequestBody CreateBookingRequest body) {
        return bookingService.create((Long) request.getAttribute("userId"), body);
    }

    @GetMapping("/me")
    public List<BookingResponse> myBookings(HttpServletRequest request) {
        return bookingService.getClientBookings((Long) request.getAttribute("userId"));
    }

    @GetMapping("/{bookingId}")
    public BookingResponse getById(HttpServletRequest request, @PathVariable Long bookingId) {
        return bookingService.getBooking((Long) request.getAttribute("userId"), bookingId);
    }

    @GetMapping("/business/{businessId}")
    public List<BookingResponse> businessBookings(HttpServletRequest request,
                                                  @PathVariable Long businessId) {
        return bookingService.getBusinessBookings((Long) request.getAttribute("userId"), businessId);
    }

    @PatchMapping("/{bookingId}/status")
    public BookingResponse updateStatus(HttpServletRequest request,
                                        @PathVariable Long bookingId,
                                        @Valid @RequestBody UpdateBookingStatusRequest body) {
        return bookingService.updateBusinessStatus((Long) request.getAttribute("userId"), bookingId, body);
    }

    @DeleteMapping("/{bookingId}")
    public BookingResponse cancel(HttpServletRequest request,
                                  @PathVariable Long bookingId,
                                  @RequestParam(required = false) String reason) {
        return bookingService.cancelByClient((Long) request.getAttribute("userId"), bookingId, reason);
    }

    @GetMapping("/staff/me")
    public List<BookingResponse> staffBookings(HttpServletRequest request) {
        return bookingService.getStaffBookings((Long) request.getAttribute("userId"));
    }

    @GetMapping("/staff/{bookingId}")
    public BookingResponse getStaffBooking(HttpServletRequest request, @PathVariable Long bookingId) {
        return bookingService.getStaffBooking((Long) request.getAttribute("userId"), bookingId);
    }
}
