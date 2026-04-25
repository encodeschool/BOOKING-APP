package uz.encode.fresh.auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private Long userId;
    private String email;
    private String token;

    public AuthResponse(String token) {
        this.token = token;
    }
}
