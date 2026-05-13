package uz.encode.fresh.core_service.business.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import uz.encode.fresh.core_service.business.entity.BusinessImage;

public interface BusinessImageRepository
        extends JpaRepository<BusinessImage, Long> {
}