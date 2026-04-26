package uz.encode.fresh.booking_service.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

public class CreateBookingRequest {

    @NotNull
    public Long businessId;

    @NotNull
    public Long serviceId;

    @NotNull
    public Long staffId;

    @NotNull
    @FutureOrPresent
    public LocalDate bookingDate;

    @NotNull
    public LocalTime startTime;

    public String notes;
}
