package uz.encode.fresh.core_service.business.service.impl;

import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import uz.encode.fresh.core_service.business.dto.CreateBusinessRequest;
import uz.encode.fresh.core_service.business.entity.Business;
import uz.encode.fresh.core_service.business.repository.BusinessRepository;
import uz.encode.fresh.core_service.business.service.BusinessService;

@Service
public class BusinessServiceImpl implements BusinessService {

    @Autowired
    private BusinessRepository repo;

    @Override
    public Business create(Long ownerId, CreateBusinessRequest req) {

        Business b = new Business();
        b.setOwnerId(ownerId);
        b.setName(req.name);
        b.setDescription(req.description);
        b.setAddress(req.address);
        b.setPhone(req.phone);
        b.setCategory(req.category);
        b.setWorkingHours(req.workingHours);

        return repo.save(b);
    }

    @Override
    public List<Business> getByOwner(Long ownerId) {
        return repo.findByOwnerId(ownerId);
    }

    @Override
    public Business getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Business not found"));
    }

    @Override
    public void delete(Long id, Long ownerId) {
        Business b = getById(id);

        if (!b.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Not allowed");
        }

        repo.delete(b);
    }

    @Override
    public List<Business> getAllBusinesses() {
        return repo.findAll();
    }

    @Override
    public Business getBusinessById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Business not found"));
    }
}