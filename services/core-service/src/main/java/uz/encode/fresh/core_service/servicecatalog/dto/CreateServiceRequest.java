package uz.encode.fresh.core_service.servicecatalog.dto;

import jakarta.validation.constraints.*;

public class CreateServiceRequest {

    @NotNull
    public Long businessId;

    @NotBlank
    public String name;

    @NotNull
    @Min(1)
    public Double price;

    @NotNull
    @Min(5)
    public Integer durationMinutes;

    public String description;
}
