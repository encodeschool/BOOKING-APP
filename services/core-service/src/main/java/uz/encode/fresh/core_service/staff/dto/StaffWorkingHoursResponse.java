package uz.encode.fresh.core_service.staff.dto;

import java.time.DayOfWeek;
import java.time.LocalTime;

public class StaffWorkingHoursResponse {

    public Long id;
    public Long staffId;
    public DayOfWeek dayOfWeek;
    public LocalTime startTime;
    public LocalTime endTime;
    public Boolean isOff;
}