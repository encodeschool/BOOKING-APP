package uz.encode.fresh.core_service.business.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import org.springframework.stereotype.Repository;

import uz.encode.fresh.core_service.business.entity.Business;

@Repository
public interface BusinessRepository extends JpaRepository<Business, Long> {

    List<Business> findByOwnerId(Long ownerId);
}