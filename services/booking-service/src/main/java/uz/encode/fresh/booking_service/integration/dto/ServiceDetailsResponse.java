package uz.encode.fresh.booking_service.integration.dto;

public record ServiceDetailsResponse(
        Long id,
        Long businessId,
        String name,
        Integer durationMinutes,
        Boolean active
) {
}
