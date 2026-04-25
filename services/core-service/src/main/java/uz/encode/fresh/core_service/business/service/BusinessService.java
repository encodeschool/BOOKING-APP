package uz.encode.fresh.core_service.business.service;

import java.util.List;

import uz.encode.fresh.core_service.business.dto.CreateBusinessRequest;
import uz.encode.fresh.core_service.business.entity.Business;

public interface BusinessService {
    Business create(Long ownerId, CreateBusinessRequest req);

    List<Business> getByOwner(Long ownerId);

    Business getById(Long id);

    void delete(Long id, Long ownerId);

    
}
