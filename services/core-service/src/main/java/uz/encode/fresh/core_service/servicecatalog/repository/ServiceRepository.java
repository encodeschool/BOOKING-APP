package uz.encode.fresh.core_service.servicecatalog.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import uz.encode.fresh.core_service.servicecatalog.entity.ServiceEntity;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {

    List<ServiceEntity> findByBusinessId(Long businessId);

    List<ServiceEntity> findByBusinessIdAndActive(Long businessId, Boolean active);
}