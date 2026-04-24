package uz.encode.fresh.auth_service.service;

import uz.encode.fresh.auth_service.dto.AuthRequest;

public interface AuthService {
    String register(AuthRequest request);

    String login(AuthRequest request);
}
