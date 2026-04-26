package uz.encode.fresh.core_service.business.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import uz.encode.fresh.core_service.business.entity.Business;
import uz.encode.fresh.core_service.business.service.BusinessService;
import uz.encode.fresh.core_service.servicecatalog.entity.ServiceEntity;
import uz.encode.fresh.core_service.servicecatalog.service.ServiceCatalogService;
import uz.encode.fresh.core_service.staff.entity.Staff;
import uz.encode.fresh.core_service.staff.service.StaffService;

@RestController
@RequestMapping("/api/internal")
public class InternalController {

    @Autowired
    private BusinessService businessService;

    @Autowired
    private ServiceCatalogService serviceCatalogService;

    @Autowired
    private StaffService staffService;

    @GetMapping("/businesses/{id}")
    public BusinessDetailsResponse getBusiness(@PathVariable Long id) {
        Business business = businessService.getBusinessById(id);
        return new BusinessDetailsResponse(
                business.getId(),
                business.getOwnerId(),
                business.getName(),
                business.getAddress(),
                business.getPhone()
        );
    }

    @GetMapping("/services/{id}")
    public ServiceDetailsResponse getService(@PathVariable Long id) {
        ServiceEntity service = serviceCatalogService.getById(id);
        return new ServiceDetailsResponse(
                service.getId(),
                service.getBusinessId(),
                service.getName(),
                service.getPrice(),
                service.getDurationMinutes(),
                service.getActive()
        );
    }

    @GetMapping("/staff/{id}")
    public StaffDetailsResponse getStaff(@PathVariable Long id) {
        Staff staff = staffService.getById(id);
        return new StaffDetailsResponse(
                staff.getId(),
                staff.getBusinessId(),
                staff.getName(),
                staff.getMaxBookingsPerDay(),
                staff.getActive()
        );
    }

    @GetMapping("/staff/business/{businessId}")
    public List<StaffDetailsResponse> getStaffByBusiness(@PathVariable Long businessId) {
        return staffService.getByBusinessPublic(businessId)
                .stream()
                .map(staff -> new StaffDetailsResponse(
                        staff.getId(),
                        staff.getBusinessId(),
                        staff.getName(),
                        staff.getMaxBookingsPerDay(),
                        staff.getActive()
                ))
                .toList();
    }

    @GetMapping("/working-hours/{businessId}/{dayOfWeek}")
    public WorkingHoursResponse getWorkingHours(@PathVariable Long businessId,
                                                @PathVariable String dayOfWeek) {
        // For now, return default working hours
        // In a real implementation, you'd have a working hours entity
        return new WorkingHoursResponse(
                java.time.DayOfWeek.valueOf(dayOfWeek.toUpperCase()),
                java.time.LocalTime.of(9, 0),
                java.time.LocalTime.of(18, 0),
                false // not closed
        );
    }

    // DTOs for internal communication
    public record BusinessDetailsResponse(Long id, Long ownerId, String name, String address, String phone) {}
    public record ServiceDetailsResponse(Long id, Long businessId, String name, Double price, Integer durationMinutes, Boolean active) {}
    public record StaffDetailsResponse(Long id, Long businessId, String name, Integer maxBookingsPerDay, Boolean active) {}
    public record WorkingHoursResponse(java.time.DayOfWeek dayOfWeek, java.time.LocalTime startTime, java.time.LocalTime endTime, Boolean closed) {}
}