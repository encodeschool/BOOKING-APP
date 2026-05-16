package uz.encode.fresh.core_service.business.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import uz.encode.fresh.core_service.business.dto.CreateBusinessRequest;
import uz.encode.fresh.core_service.business.entity.Business;

public interface BusinessService {

    List<Business> getByOwner(Long ownerId);

    List<Business> getAccessibleBusinesses(Long userId);

    Business getById(Long id);

    void delete(Long id, Long ownerId);

    List<Business> getAllBusinesses();

    Business getBusinessById(Long id);

    Business create(Long ownerId,
                CreateBusinessRequest req,
                List<MultipartFile> images);

    Business update(Long id,
                    Long ownerId,
                    CreateBusinessRequest req);

    void addImages(Long businessId,
                Long ownerId,
                List<MultipartFile> images);

    void deleteImage(Long imageId,
                    Long ownerId);
}
