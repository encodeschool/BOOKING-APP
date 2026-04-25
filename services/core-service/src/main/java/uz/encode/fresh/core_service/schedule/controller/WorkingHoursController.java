package uz.encode.fresh.core_service.schedule.controller;


import uz.encode.fresh.core_service.schedule.dto.WorkingHoursRequest;
import uz.encode.fresh.core_service.schedule.entity.WorkingHours;
import uz.encode.fresh.core_service.schedule.service.WorkingHoursService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/working-hours")
public class WorkingHoursController {

    @Autowired
    private WorkingHoursService service;

    @PostMapping
    public WorkingHours save(@Valid @RequestBody WorkingHoursRequest req) {
        return service.save(req);
    }

    @GetMapping("/{businessId}")
    public List<WorkingHours> get(@PathVariable Long businessId) {
        return service.getByBusiness(businessId);
    }
}