package uz.encode.fresh.core_service.staff.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import uz.encode.fresh.core_service.staff.dto.CreateStaffRequest;
import uz.encode.fresh.core_service.staff.dto.StaffResponse;
import uz.encode.fresh.core_service.staff.dto.UpdateStaffRequest;
import uz.encode.fresh.core_service.staff.entity.Staff;

public interface StaffService {
    
    StaffResponse create(Long ownerId, CreateStaffRequest req);
    
    List<StaffResponse> getByBusiness(Long businessId, Long ownerId);

    List<StaffResponse> getByUser(Long userId);

    StaffResponse update(Long id, Long ownerId, UpdateStaffRequest req);

    void delete(Long id, Long ownerId);

    StaffResponse addImage(Long staffId, Long ownerId, MultipartFile file);

    List<Staff> getByBusinessPublic(Long businessId);

    Staff getById(Long id);
}
