package uz.encode.fresh.core_service.staff.service;

import java.util.List;

import uz.encode.fresh.core_service.staff.dto.StaffWorkingHoursRequest;
import uz.encode.fresh.core_service.staff.dto.StaffWorkingHoursResponse;

public interface StaffWorkingHoursService {

    StaffWorkingHoursResponse save(Long ownerId, StaffWorkingHoursRequest request);

    List<StaffWorkingHoursResponse> getByStaff(Long staffId);

    List<StaffWorkingHoursResponse> getByStaffForOwner(Long staffId, Long ownerId);
}