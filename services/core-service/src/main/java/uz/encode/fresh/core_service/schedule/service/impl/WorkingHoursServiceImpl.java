package uz.encode.fresh.core_service.schedule.service.impl;

import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import uz.encode.fresh.core_service.schedule.dto.WorkingHoursRequest;
import uz.encode.fresh.core_service.schedule.entity.WorkingHours;
import uz.encode.fresh.core_service.schedule.repository.WorkingHoursRepository;
import uz.encode.fresh.core_service.schedule.service.WorkingHoursService;

@Service
public class WorkingHoursServiceImpl implements WorkingHoursService {

    @Autowired
    private WorkingHoursRepository repo;

    // CREATE OR UPDATE (UPSERT)
    @Override
    public WorkingHours save(WorkingHoursRequest req) {

        validate(req);

        WorkingHours wh = repo
                .findByBusinessIdAndDayOfWeek(req.businessId, req.dayOfWeek)
                .orElse(new WorkingHours());

        wh.setBusinessId(req.businessId);
        wh.setDayOfWeek(req.dayOfWeek);
        wh.setIsClosed(req.isClosed);

        if (!req.isClosed) {
            wh.setStartTime(req.startTime);
            wh.setEndTime(req.endTime);
        }

        return repo.save(wh);
    }

    @Override
    public List<WorkingHours> getByBusiness(Long businessId) {
        return repo.findAll()
                .stream()
                .filter(w -> w.getBusinessId().equals(businessId))
                .toList();
    }

    // VALIDATION LOGIC (VERY IMPORTANT)
    private void validate(WorkingHoursRequest req) {

        if (!req.isClosed) {
            if (req.startTime == null || req.endTime == null) {
                throw new RuntimeException("Start and end time required");
            }

            if (req.startTime.isAfter(req.endTime)) {
                throw new RuntimeException("Start time must be before end time");
            }
        }
    }
}