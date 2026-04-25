package uz.encode.fresh.core_service.schedule.dto;

import java.time.DayOfWeek;
import java.time.LocalTime;

public class WorkingHoursResponse {

    public Long id;
    public DayOfWeek dayOfWeek;
    public LocalTime startTime;
    public LocalTime endTime;
    public boolean isClosed;
}