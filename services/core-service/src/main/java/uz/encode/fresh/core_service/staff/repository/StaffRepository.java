package uz.encode.fresh.core_service.staff.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import uz.encode.fresh.core_service.staff.entity.Staff;

public interface StaffRepository extends JpaRepository<Staff, Long> {

    List<Staff> findByBusinessId(Long businessId);

    List<Staff> findByBusinessIdAndActiveTrue(Long businessId);

    List<Staff> findByUserId(Long userId);
}
