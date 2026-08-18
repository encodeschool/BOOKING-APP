package uz.encode.fresh.booking_service.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RescheduleBookingRequest {

    @NotNull
    private LocalDate bookingDate;

    @NotBlank
    private String bookingTime;

    private String reason;
}
