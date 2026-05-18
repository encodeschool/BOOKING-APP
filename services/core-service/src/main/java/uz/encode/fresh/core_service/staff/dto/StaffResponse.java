package uz.encode.fresh.core_service.staff.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StaffResponse {

    public Long id;
    public String name;
    public String specialization;
    public String role;
    public String phone;
    public Boolean active;
    public Long userId;
    public Long businessId;
}