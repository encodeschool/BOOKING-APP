package uz.encode.fresh.core_service.schedule.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import uz.encode.fresh.core_service.schedule.dto.WorkingHoursRequest;
import uz.encode.fresh.core_service.schedule.entity.WorkingHours;
import uz.encode.fresh.core_service.schedule.service.WorkingHoursService;

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
    public List<WorkingHours> get(@PathVariable("businessId") Long businessId,
                                  HttpServletRequest request) {
        return service.getByBusiness(businessId, (Long) request.getAttribute("userId"));
    }
}
