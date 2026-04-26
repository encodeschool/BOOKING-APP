package uz.encode.fresh.core_service.business.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateBusinessRequest {

    @NotBlank
    public String name;

    public String description;

    @NotBlank
    public String address;

    @NotBlank
    public String phone;

    public String category;

    public String workingHours;
}