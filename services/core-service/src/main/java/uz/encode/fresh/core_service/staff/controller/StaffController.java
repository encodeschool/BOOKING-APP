package uz.encode.fresh.core_service.staff.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
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
    @PreAuthorize("hasAnyAuthority('STAFF', 'ADMIN')")
    public StaffResponse create(HttpServletRequest request,
                                @Valid @RequestBody CreateStaffRequest req) {
        return service.create((Long) request.getAttribute("userId"), req);
    }

    @GetMapping("/business/{businessId}")
    @PreAuthorize("hasAnyAuthority('STAFF', 'ADMIN')")
    public List<StaffResponse> getByBusiness(@PathVariable("businessId") Long businessId,
                                             HttpServletRequest request) {
        return service.getByBusiness(businessId, (Long) request.getAttribute("userId"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('STAFF')")
    public StaffResponse update(@PathVariable Long id,
                                HttpServletRequest request,
                                @RequestBody UpdateStaffRequest req) {
        return service.update(id, (Long) request.getAttribute("userId"), req);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('STAFF')")
    public void delete(@PathVariable Long id,
                       HttpServletRequest request) {
        service.delete(id, (Long) request.getAttribute("userId"));
    }
}
