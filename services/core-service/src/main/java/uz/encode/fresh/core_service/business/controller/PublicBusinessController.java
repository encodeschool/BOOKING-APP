package uz.encode.fresh.core_service.business.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import uz.encode.fresh.core_service.business.dto.BusinessResponse;
import uz.encode.fresh.core_service.business.entity.Business;
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
                .map(this::map)
                .toList();
    }

    @GetMapping("/{id}")
    public BusinessResponse getBusinessById(@PathVariable Long id) {
        var business = service.getBusinessById(id);
        return map(business);
    }

    private BusinessResponse map(Business b) {

        return new BusinessResponse(
                b.getId(),
                b.getName(),
                b.getDescription(),
                b.getAddress(),
                b.getPhone(),
                b.getCategory(),
                b.getWorkingHours(),
                b.getLatitude(),
                b.getLongitude(),
                b.getImages()
                        .stream()
                        .map(i -> i.getImageUrl())
                        .toList()
        );
    }
}