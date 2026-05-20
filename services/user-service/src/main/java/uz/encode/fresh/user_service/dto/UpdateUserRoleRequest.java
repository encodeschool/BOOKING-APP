package uz.encode.fresh.user_service.dto;

import jakarta.validation.constraints.NotNull;
import uz.encode.fresh.user_service.entity.Role;

public record UpdateUserRoleRequest(@NotNull Role role) {}
