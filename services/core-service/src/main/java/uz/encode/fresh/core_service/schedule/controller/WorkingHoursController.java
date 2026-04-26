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
@RequestMapping("/api/working-hours")
public class WorkingHoursController {

    @Autowired
    private WorkingHoursService service;

    @PostMapping
    public WorkingHours save(HttpServletRequest request,
                             @Valid @RequestBody WorkingHoursRequest req) {
        return service.save((Long) request.getAttribute("userId"), req);
    }

    @GetMapping("/{businessId}")
    public List<WorkingHours> get(@PathVariable Long businessId,
                                  HttpServletRequest request) {
        return service.getByBusiness(businessId, (Long) request.getAttribute("userId"));
    }
}
