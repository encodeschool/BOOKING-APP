package uz.encode.fresh.core_service.schedule.service.impl;

import org.springframework.stereotype.Service;

import java.util.List;

import lombok.RequiredArgsConstructor;
import uz.encode.fresh.core_service.business.service.BusinessAuthorizationService;
import uz.encode.fresh.core_service.schedule.dto.WorkingHoursRequest;
import uz.encode.fresh.core_service.schedule.entity.WorkingHours;
import uz.encode.fresh.core_service.schedule.repository.WorkingHoursRepository;
import uz.encode.fresh.core_service.schedule.service.WorkingHoursService;

@Service
@RequiredArgsConstructor
public class WorkingHoursServiceImpl implements WorkingHoursService {

    private final WorkingHoursRepository repo;
    private final BusinessAuthorizationService businessAuthorizationService;

    // CREATE OR UPDATE (UPSERT)
    @Override
    public WorkingHours save(Long ownerId, WorkingHoursRequest req) {
        businessAuthorizationService.assertOwner(req.businessId, ownerId);

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
    public List<WorkingHours> getByBusiness(Long businessId, Long ownerId) {
        businessAuthorizationService.assertOwner(businessId, ownerId);
        return repo.findAllByBusinessId(businessId);
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
