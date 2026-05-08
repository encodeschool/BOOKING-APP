package uz.encode.fresh.core_service.staff.dto;

import java.time.DayOfWeek;
import java.time.LocalTime;

import jakarta.validation.constraints.NotNull;

public class StaffWorkingHoursRequest {

    @NotNull
    public Long staffId;

    @NotNull
    public DayOfWeek dayOfWeek;

    public LocalTime startTime;
    public LocalTime endTime;

    public Boolean isOff;
}