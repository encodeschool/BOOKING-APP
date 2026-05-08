package uz.encode.fresh.core_service.servicecatalog.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import uz.encode.fresh.core_service.servicecatalog.dto.ServiceResponse;
import uz.encode.fresh.core_service.servicecatalog.service.ServiceCatalogService;

@RestController
@RequestMapping("/api/services/public")
public class PublicServiceController {

    @Autowired
    private ServiceCatalogService service;

    @GetMapping("/business/{businessId}")
    public List<ServiceResponse> getServicesByBusiness(@PathVariable("businessId") Long businessId) {
        return service.getByBusinessPublic(businessId)
                .stream()
                .map(s -> {
                    ServiceResponse response = new ServiceResponse();
                    response.id = s.getId();
                    response.name = s.getName();
                    response.description = s.getDescription();
                    response.price = s.getPrice();
                    response.duration = s.getDurationMinutes();
                    response.active = s.getActive();
                    return response;
                })
                .toList();
    }
}