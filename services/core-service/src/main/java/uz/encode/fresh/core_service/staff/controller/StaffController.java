package uz.encode.fresh.core_service.staff.controller;

import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;

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
    public StaffResponse create(HttpServletRequest request,
                                @Valid @RequestBody CreateStaffRequest req) {
        return service.create((Long) request.getAttribute("userId"), req);
    }

    @GetMapping("/business/{businessId}")
    public List<StaffResponse> getByBusiness(@PathVariable Long businessId,
                                             HttpServletRequest request) {
        return service.getByBusiness(businessId, (Long) request.getAttribute("userId"));
    }

    @PutMapping("/{id}")
    public StaffResponse update(@PathVariable Long id,
                                HttpServletRequest request,
                                @RequestBody UpdateStaffRequest req) {
        return service.update(id, (Long) request.getAttribute("userId"), req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id,
                       HttpServletRequest request) {
        service.delete(id, (Long) request.getAttribute("userId"));
    }
}
