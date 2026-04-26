package uz.encode.fresh.booking_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
}