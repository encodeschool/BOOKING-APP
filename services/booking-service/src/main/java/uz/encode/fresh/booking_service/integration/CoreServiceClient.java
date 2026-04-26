package uz.encode.fresh.booking_service.integration;

import java.time.DayOfWeek;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import uz.encode.fresh.booking_service.integration.dto.BusinessDetailsResponse;
import uz.encode.fresh.booking_service.integration.dto.ServiceDetailsResponse;
import uz.encode.fresh.booking_service.integration.dto.StaffDetailsResponse;
import uz.encode.fresh.booking_service.integration.dto.WorkingHoursResponse;

@FeignClient(name = "core-service")
public interface CoreServiceClient {

    @GetMapping("/api/internal/businesses/{id}")
    BusinessDetailsResponse getBusiness(@PathVariable("id") Long id);

    @GetMapping("/api/internal/services/{id}")
    ServiceDetailsResponse getService(@PathVariable("id") Long id);

    @GetMapping("/api/internal/staff/{id}")
    StaffDetailsResponse getStaff(@PathVariable("id") Long id);

    @GetMapping("/api/internal/working-hours/{businessId}/{dayOfWeek}")
    WorkingHoursResponse getWorkingHours(@PathVariable("businessId") Long businessId,
                                         @PathVariable("dayOfWeek") DayOfWeek dayOfWeek);
}
