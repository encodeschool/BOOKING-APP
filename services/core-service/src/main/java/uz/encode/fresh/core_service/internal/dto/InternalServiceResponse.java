package uz.encode.fresh.core_service.internal.dto;

public record InternalServiceResponse(
        Long id,
        Long businessId,
        String name,
        Integer durationMinutes,
        Boolean active
) {
}
