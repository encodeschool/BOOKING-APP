package uz.encode.fresh.booking_service.integration.dto;

import java.time.DayOfWeek;
import java.time.LocalTime;

public record WorkingHoursResponse(
        Long businessId,
        DayOfWeek dayOfWeek,
        LocalTime startTime,
        LocalTime endTime,
        boolean closed
) {
}
