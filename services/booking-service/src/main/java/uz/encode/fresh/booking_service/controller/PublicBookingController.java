package uz.encode.fresh.booking_service.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import uz.encode.fresh.booking_service.dto.BookedSlotResponse;
import uz.encode.fresh.booking_service.dto.BookingResponse;
import uz.encode.fresh.booking_service.dto.CreatePublicBookingRequest;
import uz.encode.fresh.booking_service.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class PublicBookingController {

    private final BookingService bookingService;

    @PostMapping("/public")
    public BookingResponse createBooking(@Valid @RequestBody CreatePublicBookingRequest body) {
        return bookingService.createPublicBooking(body);
    }

    @GetMapping("/available-slots")
    public List<String> getAvailableSlots(
            @RequestParam Long businessId,
            @RequestParam Long serviceId,
            @RequestParam String date) {
        return bookingService.getAvailableSlots(businessId, serviceId, date);
    }

    @GetMapping("/available-dates")
    public List<String> getAvailableDates(
            @RequestParam Long businessId,
            @RequestParam Long serviceId,
            @RequestParam(required = false) Long staffId) {
        return bookingService.getAvailableDates(businessId, serviceId, staffId);
    }

    @GetMapping("/booked/{staffId}/{date}")
    public List<BookedSlotResponse> getBookedSlots(
            @PathVariable("staffId") Long staffId,
            @PathVariable("date") String date
    ) {
        return bookingService.getBookedSlots(staffId, LocalDate.parse(date));
    }
}