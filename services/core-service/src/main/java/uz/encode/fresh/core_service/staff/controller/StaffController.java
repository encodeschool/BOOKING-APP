package uz.encode.fresh.core_service.staff.controller;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import uz.encode.fresh.core_service.staff.dto.CreateStaffRequest;
import uz.encode.fresh.core_service.staff.dto.StaffResponse;
import uz.encode.fresh.core_service.staff.dto.UpdateStaffRequest;
import uz.encode.fresh.core_service.staff.service.StaffService;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    @Autowired
    private StaffService service;

    @PostMapping
    public StaffResponse create(@Valid @RequestBody CreateStaffRequest req) {
        return service.create(req);
    }

    @GetMapping("/business/{businessId}")
    public List<StaffResponse> getByBusiness(@PathVariable Long businessId) {
        return service.getByBusiness(businessId);
    }

    @PutMapping("/{id}")
    public StaffResponse update(@PathVariable Long id,
                                @RequestBody UpdateStaffRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}