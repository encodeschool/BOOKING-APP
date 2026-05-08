package uz.encode.fresh.booking_service.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import lombok.Builder;
import lombok.Value;
import uz.encode.fresh.booking_service.model.BookingStatus;

@Value
@Builder
public class BookingResponse {
    Long id;
    Long clientId;
    Long businessId;
    Long serviceId;
    Long staffId;
    LocalDate bookingDate;
    LocalTime startTime;
    LocalTime endTime;
    BookingStatus status;
    String notes;
    String statusReason;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

    public String customerName;
    public String customerPhone;
}
