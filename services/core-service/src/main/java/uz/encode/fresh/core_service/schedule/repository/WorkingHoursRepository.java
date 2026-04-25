package uz.encode.fresh.core_service.schedule.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.Optional;

import uz.encode.fresh.core_service.schedule.entity.WorkingHours;

public interface WorkingHoursRepository extends JpaRepository<WorkingHours, Long> {

    Optional<WorkingHours> findByBusinessIdAndDayOfWeek(Long businessId, DayOfWeek day);

}