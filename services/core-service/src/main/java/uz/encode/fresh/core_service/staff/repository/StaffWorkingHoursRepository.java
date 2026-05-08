package uz.encode.fresh.core_service.staff.repository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import uz.encode.fresh.core_service.staff.entity.StaffWorkingHours;

public interface StaffWorkingHoursRepository extends JpaRepository<StaffWorkingHours, Long> {

    List<StaffWorkingHours> findByStaffId(Long staffId);

    Optional<StaffWorkingHours> findByStaffIdAndDayOfWeek(Long staffId, DayOfWeek dayOfWeek);
}