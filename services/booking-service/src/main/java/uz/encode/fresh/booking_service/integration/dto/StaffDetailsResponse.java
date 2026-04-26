package uz.encode.fresh.booking_service.integration.dto;

public record StaffDetailsResponse(
        Long id,
        Long businessId,
        String name,
        Boolean active,
        Integer maxBookingsPerDay
) {
}
