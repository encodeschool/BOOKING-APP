package uz.encode.fresh.core_service.staff.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import uz.encode.fresh.core_service.business.service.BusinessAuthorizationService;
import uz.encode.fresh.core_service.staff.dto.StaffWorkingHoursRequest;
import uz.encode.fresh.core_service.staff.dto.StaffWorkingHoursResponse;
import uz.encode.fresh.core_service.staff.entity.Staff;
import uz.encode.fresh.core_service.staff.entity.StaffWorkingHours;
import uz.encode.fresh.core_service.staff.exception.StaffWorkingHoursException;
import uz.encode.fresh.core_service.staff.repository.StaffRepository;
import uz.encode.fresh.core_service.staff.repository.StaffWorkingHoursRepository;
import uz.encode.fresh.core_service.staff.service.StaffWorkingHoursService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StaffWorkingHoursServiceImpl implements StaffWorkingHoursService {

    private final StaffWorkingHoursRepository repo;
    private final StaffRepository staffRepo;
    private final BusinessAuthorizationService authService;

    @Override
    public StaffWorkingHoursResponse save(Long ownerId, StaffWorkingHoursRequest req) {

        Staff staff = staffRepo.findById(req.staffId)
                .orElseThrow(() -> new StaffWorkingHoursException("Staff not found"));

        authService.assertOwner(staff.getBusinessId(), ownerId);

        validate(req);

        StaffWorkingHours wh = repo
                .findByStaffIdAndDayOfWeek(req.staffId, req.dayOfWeek)
                .orElse(new StaffWorkingHours());

        wh.setStaffId(req.staffId);
        wh.setDayOfWeek(req.dayOfWeek);
        wh.setIsOff(req.isOff != null ? req.isOff : false);

        if (Boolean.FALSE.equals(req.isOff)) {
            wh.setStartTime(req.startTime);
            wh.setEndTime(req.endTime);
        }

        return map(repo.save(wh));
    }

    @Override
    public List<StaffWorkingHoursResponse> getByStaff(Long staffId) {
        return repo.findByStaffId(staffId)
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public List<StaffWorkingHoursResponse> getByStaffForOwner(Long staffId, Long ownerId) {

        Staff staff = staffRepo.findById(staffId)
                .orElseThrow(() -> new StaffWorkingHoursException("Staff not found"));

        authService.assertOwner(staff.getBusinessId(), ownerId);

        return getByStaff(staffId);
    }

    private void validate(StaffWorkingHoursRequest req) {

        if (Boolean.TRUE.equals(req.isOff)) {
            return;
        }

        if (req.startTime == null || req.endTime == null) {
            throw new StaffWorkingHoursException("Start and end time required");
        }

        if (req.startTime.isAfter(req.endTime)) {
            throw new StaffWorkingHoursException("Start time must be before end time");
        }
    }

    private StaffWorkingHoursResponse map(StaffWorkingHours wh) {
        StaffWorkingHoursResponse r = new StaffWorkingHoursResponse();
        r.id = wh.getId();
        r.staffId = wh.getStaffId();
        r.dayOfWeek = wh.getDayOfWeek();
        r.startTime = wh.getStartTime();
        r.endTime = wh.getEndTime();
        r.isOff = wh.getIsOff();
        return r;
    }
}