package uz.encode.fresh.core_service.staff.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import uz.encode.fresh.core_service.staff.dto.StaffResponse;
import uz.encode.fresh.core_service.staff.service.StaffService;

@RestController
@RequestMapping("/api/staff")
public class PublicStaffController {

    @Autowired
    private StaffService service;

    @GetMapping("/business/{businessId}/public")
    public List<StaffResponse> getStaffByBusiness(@PathVariable Long businessId) {
        return service.getByBusinessPublic(businessId)
                .stream()
                .map(s -> {
                    StaffResponse response = new StaffResponse();
                    response.id = s.getId();
                    response.name = s.getName();
                    response.specialization = s.getSpecialization();
                    response.role = s.getRole();
                    response.phone = s.getPhone();
                    response.active = s.getActive();
                    return response;
                })
                .toList();
    }
}