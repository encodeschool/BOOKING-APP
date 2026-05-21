package uz.encode.fresh.booking_service.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreatePublicBookingRequest {

    @NotNull
    public Long businessId;

    @NotNull
    public Long serviceId;

    public Long staffId;

    @NotNull
    @FutureOrPresent
    public LocalDate bookingDate;

    public String bookingTime;

    public String startTime;

    @NotBlank
    public String customerName;

    @NotBlank
    public String customerEmail;

    @NotBlank
    public String customerPhone;

    public String notes;

    @AssertTrue(message = "Either startTime or bookingTime must be provided")
    public boolean isStartTimeProvided() {
        return (startTime != null && !startTime.isBlank()) || (bookingTime != null && !bookingTime.isBlank());
    }
}