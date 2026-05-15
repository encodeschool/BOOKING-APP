package uz.encode.fresh.core_service.staff.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateStaffRequest {

    @NotNull
    public Long businessId;

    @NotBlank
    public String name;

    public String specialization;

    public String role;
    public String phone;
    public Long userId;
}