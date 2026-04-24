package uz.encode.fresh.user_service.entity;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Preferences {

    private String language;
    private String timezone;
    private boolean emailNotifications;

}