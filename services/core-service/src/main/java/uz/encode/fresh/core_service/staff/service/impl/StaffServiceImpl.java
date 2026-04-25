package uz.encode.fresh.core_service.staff.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import uz.encode.fresh.core_service.staff.dto.CreateStaffRequest;
import uz.encode.fresh.core_service.staff.dto.StaffResponse;
import uz.encode.fresh.core_service.staff.dto.UpdateStaffRequest;
import uz.encode.fresh.core_service.staff.entity.Staff;
import uz.encode.fresh.core_service.staff.repository.StaffRepository;
import uz.encode.fresh.core_service.staff.service.StaffService;

@Service
public class StaffServiceImpl implements StaffService {

    @Autowired
    private StaffRepository repo;

    @Override
    public StaffResponse create(CreateStaffRequest req) {

        Staff s = new Staff();
        s.setBusinessId(req.businessId);
        s.setName(req.name);
        s.setRole(req.role);
        s.setPhone(req.phone);

        Staff saved = repo.save(s);
        return map(saved);
    }

    @Override
    public List<StaffResponse> getByBusiness(Long businessId) {
        return repo.findByBusinessId(businessId)
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public StaffResponse update(Long id, UpdateStaffRequest req) {

        Staff s = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        if (req.name != null) s.setName(req.name);
        if (req.role != null) s.setRole(req.role);
        if (req.phone != null) s.setPhone(req.phone);
        if (req.active != null) s.setActive(req.active);

        return map(repo.save(s));
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }

    private StaffResponse map(Staff s) {
        StaffResponse r = new StaffResponse();
        r.id = s.getId();
        r.name = s.getName();
        r.role = s.getRole();
        r.phone = s.getPhone();
        r.active = s.getActive();
        return r;
    }
}