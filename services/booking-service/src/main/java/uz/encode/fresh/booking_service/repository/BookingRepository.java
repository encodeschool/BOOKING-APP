package uz.encode.fresh.booking_service.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import uz.encode.fresh.booking_service.entity.Booking;
import uz.encode.fresh.booking_service.model.BookingStatus;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByClientIdOrderByBookingDateDescStartTimeDesc(Long clientId);

    List<Booking> findByBusinessIdOrderByBookingDateDescStartTimeDesc(Long businessId);

    List<Booking> findByStaffIdOrderByBookingDateDescStartTimeDesc(Long staffId);

    long countByStaffIdAndBookingDateAndStatusIn(Long staffId, LocalDate bookingDate, Collection<BookingStatus> statuses);

    @Query("""
            select count(b) > 0
            from Booking b
            where b.staffId = :staffId
              and b.bookingDate = :bookingDate
              and b.status in :statuses
              and b.startTime < :endTime
              and b.endTime > :startTime
            """)
    boolean existsOverlappingBooking(@Param("staffId") Long staffId,
                                     @Param("bookingDate") LocalDate bookingDate,
                                     @Param("startTime") LocalTime startTime,
                                     @Param("endTime") LocalTime endTime,
                                     @Param("statuses") Collection<BookingStatus> statuses);

    List<Booking> findByBusinessIdAndBookingDateBetween(
        Long businessId,
        LocalDate from,
        LocalDate to
    );

    long countByBusinessId(Long businessId);

    long countByBusinessIdAndStatus(
            Long businessId,
            BookingStatus status
    );
}
