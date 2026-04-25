package uz.encode.fresh.auth_service.service;

import uz.encode.fresh.auth_service.dto.AuthRequest;
import uz.encode.fresh.auth_service.dto.AuthResponse;

public interface AuthService {
    AuthResponse register(AuthRequest request);

    String login(AuthRequest request);
}
