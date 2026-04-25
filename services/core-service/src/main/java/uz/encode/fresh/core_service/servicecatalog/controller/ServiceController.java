package uz.encode.fresh.core_service.servicecatalog.controller;


import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import uz.encode.fresh.core_service.servicecatalog.dto.CreateServiceRequest;
import uz.encode.fresh.core_service.servicecatalog.dto.ServiceResponse;
import uz.encode.fresh.core_service.servicecatalog.dto.UpdateServiceRequest;
import uz.encode.fresh.core_service.servicecatalog.service.ServiceCatalogService;

@RestController
@RequestMapping("/services")
public class ServiceController {

    @Autowired
    private ServiceCatalogService service;

    @PostMapping
    public ServiceResponse create(@Valid @RequestBody CreateServiceRequest req) {
        return service.create(req);
    }

    @GetMapping("/business/{businessId}")
    public List<ServiceResponse> getByBusiness(@PathVariable Long businessId) {
        return service.getByBusiness(businessId);
    }

    @PutMapping("/{id}")
    public ServiceResponse update(@PathVariable Long id,
                                 @RequestBody UpdateServiceRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}