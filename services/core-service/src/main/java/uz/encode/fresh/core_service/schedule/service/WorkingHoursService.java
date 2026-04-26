package uz.encode.fresh.core_service.schedule.service;

import java.util.List;

import uz.encode.fresh.core_service.schedule.dto.WorkingHoursRequest;
import uz.encode.fresh.core_service.schedule.entity.WorkingHours;

public interface WorkingHoursService {
    WorkingHours save(Long ownerId, WorkingHoursRequest req);

    List<WorkingHours> getByBusiness(Long businessId, Long ownerId);
}
