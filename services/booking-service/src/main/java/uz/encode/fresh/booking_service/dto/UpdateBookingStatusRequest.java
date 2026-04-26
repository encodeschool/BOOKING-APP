package uz.encode.fresh.booking_service.dto;

import jakarta.validation.constraints.NotNull;
import uz.encode.fresh.booking_service.model.BookingStatus;

public class UpdateBookingStatusRequest {

    @NotNull
    public BookingStatus status;

    public String reason;
}
