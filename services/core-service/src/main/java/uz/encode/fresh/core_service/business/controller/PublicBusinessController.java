package uz.encode.fresh.core_service.business.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import uz.encode.fresh.core_service.business.dto.BusinessResponse;
import uz.encode.fresh.core_service.business.service.BusinessService;

@RestController
@RequestMapping("/api/businesses/public")
public class PublicBusinessController {

    @Autowired
    private BusinessService service;

    @GetMapping
    public List<BusinessResponse> getAllBusinesses() {
        return service.getAllBusinesses()
                .stream()
                .map(b -> new BusinessResponse(
                        b.getId(),
                        b.getName(),
                        b.getDescription(),
                        b.getAddress(),
                        b.getPhone(),
                        b.getCategory(),
                        b.getWorkingHours(),
                        b.getLatitude(),
                        b.getLongitude()
                ))
                .toList();
    }

    @GetMapping("/{id}")
    public BusinessResponse getBusinessById(@PathVariable Long id) {
        var business = service.getBusinessById(id);
        return new BusinessResponse(
                business.getId(),
                business.getName(),
                business.getDescription(),
                business.getAddress(),
                business.getPhone(),
                business.getCategory(),
                business.getWorkingHours(),
                business.getLatitude(),
                business.getLongitude()
        );
    }
}