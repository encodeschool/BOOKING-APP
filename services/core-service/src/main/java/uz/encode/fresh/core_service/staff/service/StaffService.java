package uz.encode.fresh.core_service.staff.service;

import java.util.List;

import uz.encode.fresh.core_service.staff.dto.CreateStaffRequest;
import uz.encode.fresh.core_service.staff.dto.StaffResponse;
import uz.encode.fresh.core_service.staff.dto.UpdateStaffRequest;
import uz.encode.fresh.core_service.staff.entity.Staff;

public interface StaffService {
    
    StaffResponse create(CreateStaffRequest req);
    
    List<StaffResponse> getByBusiness(Long businessId);

    StaffResponse update(Long id, UpdateStaffRequest req);

    void delete(Long id);

}
