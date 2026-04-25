package uz.encode.fresh.core_service.schedule.dto;

import jakarta.validation.constraints.NotNull;
import java.time.DayOfWeek;
import java.time.LocalTime;

public class WorkingHoursRequest {

    @NotNull
    public Long businessId;

    @NotNull
    public DayOfWeek dayOfWeek;

    public LocalTime startTime;
    public LocalTime endTime;

    public boolean isClosed;
}