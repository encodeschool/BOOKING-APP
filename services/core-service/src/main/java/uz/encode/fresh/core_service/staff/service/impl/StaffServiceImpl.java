package uz.encode.fresh.core_service.staff.service.impl;

import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import uz.encode.fresh.core_service.business.service.BusinessAuthorizationService;
import uz.encode.fresh.core_service.staff.dto.CreateStaffRequest;
import uz.encode.fresh.core_service.staff.dto.StaffResponse;
import uz.encode.fresh.core_service.staff.dto.UpdateStaffRequest;
import uz.encode.fresh.core_service.staff.entity.Staff;
import uz.encode.fresh.core_service.staff.repository.StaffRepository;
import uz.encode.fresh.core_service.staff.service.StaffService;

@Service
@RequiredArgsConstructor
public class StaffServiceImpl implements StaffService {

    private final StaffRepository repo;
    private final BusinessAuthorizationService businessAuthorizationService;

    @Override
    public StaffResponse create(Long ownerId, CreateStaffRequest req) {
        businessAuthorizationService.assertOwner(req.businessId, ownerId);

        Staff s = new Staff();
        s.setBusinessId(req.businessId);
        s.setName(req.name);
        s.setSpecialization(req.specialization);
        s.setRole(req.role);
        s.setPhone(req.phone);
        if (req.userId != null) {
            s.setUserId(req.userId);
        }

        Staff saved = repo.save(s);
        return map(saved);
    }

    @Override
    public List<StaffResponse> getByBusiness(Long businessId, Long ownerId) {
        businessAuthorizationService.assertOwner(businessId, ownerId);
        return repo.findByBusinessId(businessId)
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public StaffResponse update(Long id, Long ownerId, UpdateStaffRequest req) {
        Objects.requireNonNull(id, "Staff id is required");

        Staff s = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        businessAuthorizationService.assertOwner(s.getBusinessId(), ownerId);

        if (req.name != null) s.setName(req.name);
        if (req.role != null) s.setRole(req.role);
        if (req.phone != null) s.setPhone(req.phone);
        if (req.active != null) s.setActive(req.active);

        return map(repo.save(s));
    }

    @Override
    public void delete(Long id, Long ownerId) {
        Objects.requireNonNull(id, "Staff id is required");
        Staff s = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        businessAuthorizationService.assertOwner(s.getBusinessId(), ownerId);
        repo.delete(s);
    }

    @Override
    public List<Staff> getByBusinessPublic(Long businessId) {
        return repo.findByBusinessIdAndActiveTrue(businessId);
    }

    @Override
    public Staff getById(Long id) {
        Objects.requireNonNull(id, "Staff id is required");
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
    }

    private StaffResponse map(Staff s) {
        StaffResponse r = new StaffResponse();
        r.id = s.getId();
        r.name = s.getName();
        r.specialization = s.getSpecialization();
        r.role = s.getRole();
        r.phone = s.getPhone();
        r.active = s.getActive();
        r.userId = s.getUserId();
        return r;
    }
}
