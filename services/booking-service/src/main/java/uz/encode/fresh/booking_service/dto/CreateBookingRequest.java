package uz.encode.fresh.booking_service.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateBookingRequest {

    @NotNull
    public Long businessId;

    @NotNull
    public Long serviceId;

    public Long staffId;

    @NotNull
    @FutureOrPresent
    public LocalDate bookingDate;

    @NotBlank
    public String bookingTime;

    @NotBlank
    public String customerName;

    @NotBlank
    public String customerEmail;

    @NotBlank
    public String customerPhone;

    public String notes;
}
