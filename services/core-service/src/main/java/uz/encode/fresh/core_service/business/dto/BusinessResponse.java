package uz.encode.fresh.core_service.business.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BusinessResponse {

    public Long id;
    public String name;
    public String address;
    public String phone;
}
