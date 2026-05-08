package uz.encode.fresh.core_service.staff.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import uz.encode.fresh.core_service.staff.dto.StaffWorkingHoursRequest;
import uz.encode.fresh.core_service.staff.dto.StaffWorkingHoursResponse;
import uz.encode.fresh.core_service.staff.service.StaffWorkingHoursService;

@RestController
@RequestMapping("/api/staff/working-hours")
@RequiredArgsConstructor
public class StaffWorkingHoursController {

    private final StaffWorkingHoursService service;

    @PostMapping
    public StaffWorkingHoursResponse save(
            HttpServletRequest request,
            @Valid @RequestBody StaffWorkingHoursRequest req
    ) {
        Long ownerId = (Long) request.getAttribute("userId");
        return service.save(ownerId, req);
    }

    @GetMapping("/staff/{staffId}")
    public List<StaffWorkingHoursResponse> getByStaff(
            @PathVariable("staffId") Long staffId
    ) {
        return service.getByStaff(staffId);
    }

    @GetMapping("/staff/{staffId}/owner")
    public List<StaffWorkingHoursResponse> getByStaffOwner(
            HttpServletRequest request,
            @PathVariable("staffId") Long staffId
    ) {
        Long ownerId = (Long) request.getAttribute("userId");
        return service.getByStaffForOwner(staffId, ownerId);
    }
}