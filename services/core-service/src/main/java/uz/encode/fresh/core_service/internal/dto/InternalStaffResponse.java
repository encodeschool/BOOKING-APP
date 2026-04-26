package uz.encode.fresh.core_service.internal.dto;

public record InternalStaffResponse(
        Long id,
        Long businessId,
        String name,
        Boolean active,
        Integer maxBookingsPerDay
) {
}
