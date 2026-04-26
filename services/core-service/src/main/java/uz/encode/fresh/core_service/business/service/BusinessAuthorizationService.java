package uz.encode.fresh.core_service.business.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import uz.encode.fresh.core_service.business.entity.Business;
import uz.encode.fresh.core_service.business.repository.BusinessRepository;

@Service
@RequiredArgsConstructor
public class BusinessAuthorizationService {

    private final BusinessRepository businessRepository;

    public Business assertOwner(Long businessId, Long ownerId) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found"));

        if (!business.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Not allowed");
        }

        return business;
    }
}
