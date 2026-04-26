package uz.encode.fresh.auth_service.service.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.AllArgsConstructor;
import uz.encode.fresh.auth_service.dto.AuthRequest;
import uz.encode.fresh.auth_service.dto.AuthResponse;
import uz.encode.fresh.auth_service.entity.User;
import uz.encode.fresh.auth_service.integration.UserServiceClient;
import uz.encode.fresh.auth_service.integration.dto.CreateUserProfileRequest;
import uz.encode.fresh.auth_service.repository.UserRepository;
import uz.encode.fresh.auth_service.security.JwtUtil;
import uz.encode.fresh.auth_service.service.AuthService;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository repo;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final UserServiceClient userServiceClient;

    @Override
    @Transactional
    public AuthResponse register(AuthRequest request) {

        if (repo.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User saved = repo.save(user);
        userServiceClient.createUser(new CreateUserProfileRequest(saved.getId(), saved.getEmail()));

        String token = jwtUtil.generateToken(saved.getId(), saved.getEmail());

        return new AuthResponse(saved.getId(), saved.getEmail(), token);
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        User user = repo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        userServiceClient.createUser(new CreateUserProfileRequest(user.getId(), user.getEmail()));

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        return new AuthResponse(user.getId(), user.getEmail(), token);
    }
}
