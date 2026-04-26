package uz.encode.fresh.core_service.servicecatalog.controller;


import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import uz.encode.fresh.core_service.servicecatalog.dto.CreateServiceRequest;
import uz.encode.fresh.core_service.servicecatalog.dto.ServiceResponse;
import uz.encode.fresh.core_service.servicecatalog.dto.UpdateServiceRequest;
import uz.encode.fresh.core_service.servicecatalog.service.ServiceCatalogService;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    @Autowired
    private ServiceCatalogService service;

    @PostMapping
    public ServiceResponse create(HttpServletRequest request,
                                  @Valid @RequestBody CreateServiceRequest req) {
        return service.create((Long) request.getAttribute("userId"), req);
    }

    @GetMapping("/business/{businessId}")
    public List<ServiceResponse> getByBusiness(@PathVariable Long businessId,
                                               HttpServletRequest request) {
        return service.getByBusiness(businessId, (Long) request.getAttribute("userId"));
    }

    @PutMapping("/{id}")
    public ServiceResponse update(@PathVariable Long id,
                                 HttpServletRequest request,
                                 @RequestBody UpdateServiceRequest req) {
        return service.update(id, (Long) request.getAttribute("userId"), req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id,
                       HttpServletRequest request) {
        service.delete(id, (Long) request.getAttribute("userId"));
    }
}
