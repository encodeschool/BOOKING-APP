package uz.encode.fresh.core_service.business.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "businesses")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Business {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long ownerId;

    private String name;
    private String description;
    private String address;
    private String phone;
    private String category;
    private String workingHours;

    // NEW
    private Double latitude;

    private Double longitude;
}