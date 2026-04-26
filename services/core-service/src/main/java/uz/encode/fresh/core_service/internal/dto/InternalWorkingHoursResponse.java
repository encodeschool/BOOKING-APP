package uz.encode.fresh.core_service.internal.dto;

import java.time.DayOfWeek;
import java.time.LocalTime;

public record InternalWorkingHoursResponse(
        Long businessId,
        DayOfWeek dayOfWeek,
        LocalTime startTime,
        LocalTime endTime,
        boolean closed
) {
}
