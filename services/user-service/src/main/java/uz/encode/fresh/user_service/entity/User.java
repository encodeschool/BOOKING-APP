package uz.encode.fresh.user_service.entity;

import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User {

    @Id
    private Long id; // comes from auth-service (important!)

    private String email;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Embedded
    private Preferences preferences;

    private String fullName;
    private String phone;

}