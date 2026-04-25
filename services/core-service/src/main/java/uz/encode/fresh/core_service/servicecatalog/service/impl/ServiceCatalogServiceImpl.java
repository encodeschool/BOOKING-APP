package uz.encode.fresh.core_service.servicecatalog.service.impl;


import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import uz.encode.fresh.core_service.servicecatalog.dto.CreateServiceRequest;
import uz.encode.fresh.core_service.servicecatalog.dto.ServiceResponse;
import uz.encode.fresh.core_service.servicecatalog.dto.UpdateServiceRequest;
import uz.encode.fresh.core_service.servicecatalog.entity.ServiceEntity;
import uz.encode.fresh.core_service.servicecatalog.repository.ServiceRepository;
import uz.encode.fresh.core_service.servicecatalog.service.ServiceCatalogService;

@Service
public class ServiceCatalogServiceImpl implements ServiceCatalogService {

    @Autowired
    private ServiceRepository repo;

    @Override
    public ServiceResponse create(CreateServiceRequest req) {

        ServiceEntity s = new ServiceEntity();
        s.setBusinessId(req.businessId);
        s.setName(req.name);
        s.setPrice(req.price);
        s.setDurationMinutes(req.durationMinutes);
        s.setDescription(req.description);

        repo.save(s);

        return mapToResponse(s);
    }

    @Override
    public List<ServiceResponse> getByBusiness(Long businessId) {
        return repo.findByBusinessId(businessId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ServiceResponse update(Long id, UpdateServiceRequest req) {

        ServiceEntity s = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        if (req.name != null) s.setName(req.name);
        if (req.price != null) s.setPrice(req.price);
        if (req.durationMinutes != null) s.setDurationMinutes(req.durationMinutes);
        if (req.active != null) s.setActive(req.active);
        if (req.description != null) s.setDescription(req.description);

        repo.save(s);

        return mapToResponse(s);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }

    private ServiceResponse mapToResponse(ServiceEntity s) {
        ServiceResponse r = new ServiceResponse();
        r.id = s.getId();
        r.name = s.getName();
        r.price = s.getPrice();
        r.durationMinutes = s.getDurationMinutes();
        r.active = s.getActive();
        return r;
    }
}