package uz.encode.fresh.core_service.servicecatalog.service;

import java.util.List;

import uz.encode.fresh.core_service.servicecatalog.dto.CreateServiceRequest;
import uz.encode.fresh.core_service.servicecatalog.dto.ServiceResponse;
import uz.encode.fresh.core_service.servicecatalog.dto.UpdateServiceRequest;
import uz.encode.fresh.core_service.servicecatalog.entity.ServiceEntity;

public interface ServiceCatalogService {
    
    ServiceResponse create(Long ownerId, CreateServiceRequest req);

    List<ServiceResponse> getByBusiness(Long businessId, Long ownerId);

    ServiceResponse update(Long id, Long ownerId, UpdateServiceRequest req);

    void delete(Long id, Long ownerId);
    
}
