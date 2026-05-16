package uz.encode.fresh.core_service.business.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import uz.encode.fresh.core_service.business.dto.CreateBusinessRequest;
import uz.encode.fresh.core_service.business.entity.Business;
import uz.encode.fresh.core_service.business.entity.BusinessImage;
import uz.encode.fresh.core_service.business.repository.BusinessImageRepository;
import uz.encode.fresh.core_service.business.repository.BusinessRepository;
import uz.encode.fresh.core_service.business.service.BusinessService;
import uz.encode.fresh.core_service.business.service.FileStorageService;
import uz.encode.fresh.core_service.business.service.GeocodingService;
import uz.encode.fresh.core_service.staff.entity.Staff;
import uz.encode.fresh.core_service.staff.repository.StaffRepository;

@Service
public class BusinessServiceImpl implements BusinessService {

    @Autowired
    private BusinessRepository repo;

    @Autowired
    private StaffRepository staffRepo;

    @Autowired
    private GeocodingService geocodingService;

    @Autowired
    private BusinessImageRepository imageRepo;

    @Autowired
    private FileStorageService fileStorageService;

    @Override
    public Business create(Long ownerId,
                           CreateBusinessRequest req,
                           List<MultipartFile> images) {

        Business b = new Business();

        b.setOwnerId(ownerId);
        b.setName(req.name);
        b.setDescription(req.description);
        b.setAddress(req.address);
        b.setPhone(req.phone);
        b.setCategory(req.category);
        b.setWorkingHours(req.workingHours);
        b.setLatitude(req.latitude);
        b.setLongitude(req.longitude);

        Business saved = repo.save(b);

        if (images != null) {

            for (MultipartFile file : images) {

                String url = fileStorageService.save(file);

                BusinessImage image = new BusinessImage();

                image.setBusiness(saved);
                image.setImageUrl(url);

                imageRepo.save(image);

                saved.getImages().add(image);
            }
        }

        return repo.save(saved);
    }

    @Override
    public Business update(Long id,
                           Long ownerId,
                           CreateBusinessRequest req) {

        Business b = getById(id);

        if (!b.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Not allowed");
        }

        b.setName(req.name);
        b.setDescription(req.description);
        b.setAddress(req.address);
        b.setPhone(req.phone);
        b.setCategory(req.category);
        b.setWorkingHours(req.workingHours);
        b.setLatitude(req.latitude);
        b.setLongitude(req.longitude);

        return repo.save(b);
    }

    @Override
    public void addImages(Long businessId,
                          Long ownerId,
                          List<MultipartFile> images) {

        Business business = getById(businessId);

        if (!business.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Not allowed");
        }

        for (MultipartFile file : images) {

            String url = fileStorageService.save(file);

            BusinessImage image = new BusinessImage();

            image.setBusiness(business);
            image.setImageUrl(url);

            imageRepo.save(image);
        }
    }

    @Override
    public void deleteImage(Long imageId,
                            Long ownerId) {

        BusinessImage image = imageRepo.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        if (!image.getBusiness().getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Not allowed");
        }

        fileStorageService.delete(image.getImageUrl());

        imageRepo.delete(image);
    }

    @Override
    public Business getById(Long id) {

        return repo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Business not found"));
    }

    @Override
    public List<Business> getByOwner(Long ownerId) {
        return repo.findByOwnerId(ownerId);
    }

    @Override
    public List<Business> getAccessibleBusinesses(Long userId) {
        if (userId == null) {
            return List.of();
        }

        List<Business> owned = getByOwner(userId);
        if (owned == null) {
            owned = new java.util.ArrayList<>();
        }

        List<Staff> staffRecords = staffRepo.findByUserId(userId);
        if (staffRecords != null) {
            for (Staff staff : staffRecords) {
                if (staff != null && staff.getBusinessId() != null) {
                    Business business = repo.findById(staff.getBusinessId())
                            .orElse(null);
                    if (business != null && owned.stream().noneMatch(b -> b.getId().equals(business.getId()))) {
                        owned.add(business);
                    }
                }
            }
        }

        return owned;
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