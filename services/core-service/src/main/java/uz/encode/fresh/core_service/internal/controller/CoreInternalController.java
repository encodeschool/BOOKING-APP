package uz.encode.fresh.core_service.internal.controller;

import java.time.DayOfWeek;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;
import uz.encode.fresh.core_service.business.repository.BusinessRepository;
import uz.encode.fresh.core_service.internal.dto.InternalBusinessResponse;
import uz.encode.fresh.core_service.internal.dto.InternalServiceResponse;
import uz.encode.fresh.core_service.internal.dto.InternalStaffResponse;
import uz.encode.fresh.core_service.internal.dto.InternalWorkingHoursResponse;
import uz.encode.fresh.core_service.schedule.repository.WorkingHoursRepository;
import uz.encode.fresh.core_service.servicecatalog.repository.ServiceRepository;
import uz.encode.fresh.core_service.staff.repository.StaffRepository;

@RestController
@RequestMapping("/api/internal")
@RequiredArgsConstructor
public class CoreInternalController {

    private final BusinessRepository businessRepository;
    private final ServiceRepository serviceRepository;
    private final StaffRepository staffRepository;
    private final WorkingHoursRepository workingHoursRepository;

    @GetMapping("/businesses/{id}")
    public InternalBusinessResponse getBusiness(@PathVariable Long id) {
        var business = businessRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Business not found"));

        return new InternalBusinessResponse(business.getId(), business.getOwnerId(), business.getName());
    }

    @GetMapping("/services/{id}")
    public InternalServiceResponse getService(@PathVariable Long id) {
        var service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));

        return new InternalServiceResponse(
                service.getId(),
                service.getBusinessId(),
                service.getName(),
                service.getDurationMinutes(),
                service.getActive()
        );
    }

    @GetMapping("/staff/{id}")
    public InternalStaffResponse getStaff(@PathVariable Long id) {
        var staff = staffRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Staff not found"));

        return new InternalStaffResponse(
                staff.getId(),
                staff.getBusinessId(),
                staff.getName(),
                staff.getActive(),
                staff.getMaxBookingsPerDay()
        );
    }

    @GetMapping("/working-hours/{businessId}/{dayOfWeek}")
    public InternalWorkingHoursResponse getWorkingHours(@PathVariable Long businessId,
                                                        @PathVariable DayOfWeek dayOfWeek) {
        var workingHours = workingHoursRepository.findByBusinessIdAndDayOfWeek(businessId, dayOfWeek)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Working hours not found"));

        return new InternalWorkingHoursResponse(
                workingHours.getBusinessId(),
                workingHours.getDayOfWeek(),
                workingHours.getStartTime(),
                workingHours.getEndTime(),
                workingHours.isClosed()
        );
    }
}
