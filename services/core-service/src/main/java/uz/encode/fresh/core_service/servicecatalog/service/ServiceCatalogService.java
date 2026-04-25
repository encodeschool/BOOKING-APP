package uz.encode.fresh.core_service.servicecatalog.service;

import java.util.List;

import uz.encode.fresh.core_service.servicecatalog.dto.CreateServiceRequest;
import uz.encode.fresh.core_service.servicecatalog.dto.ServiceResponse;
import uz.encode.fresh.core_service.servicecatalog.dto.UpdateServiceRequest;
import uz.encode.fresh.core_service.servicecatalog.entity.ServiceEntity;

public interface ServiceCatalogService {
    
    ServiceResponse create(CreateServiceRequest req);

    List<ServiceResponse> getByBusiness(Long businessId);

    ServiceResponse update(Long id, UpdateServiceRequest req);

    void delete(Long id);
    
}
