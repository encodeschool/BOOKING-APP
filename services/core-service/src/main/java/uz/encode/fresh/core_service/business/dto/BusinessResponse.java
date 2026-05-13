package uz.encode.fresh.core_service.business.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BusinessResponse {

    public Long id;

    public String name;

    public String description;

    public String address;

    public String phone;

    public String category;

    public String workingHours;

    public Double latitude;

    public Double longitude;

    public List<String> images;
}