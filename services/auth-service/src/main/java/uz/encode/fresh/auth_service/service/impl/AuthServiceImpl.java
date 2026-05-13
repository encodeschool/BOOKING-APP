package uz.encode.fresh.auth_service.service.impl;

import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.AllArgsConstructor;
import uz.encode.fresh.auth_service.dto.AuthRequest;
import uz.encode.fresh.auth_service.dto.AuthResponse;
import uz.encode.fresh.auth_service.entity.User;
import uz.encode.fresh.auth_service.integration.NotificationClient;
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
    private final NotificationClient notificationClient;

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

        // Send welcome email
        try {
            Map<String, Object> welcomeData = Map.of(
                "email", saved.getEmail(),
                "userName", saved.getEmail().split("@")[0], // Use email prefix as name for now
                "registrationDate", java.time.LocalDate.now().toString(),
                "accountType", "Client" // Default to client, can be updated later
            );
            notificationClient.sendUserWelcome(welcomeData);
        } catch (Exception e) {
            // Log but don't fail registration if email fails
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }

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

    @Override
    public String forgotPassword(String email) {
        User user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate a simple reset token (in production, use proper token generation)
        String resetToken = jwtUtil.generateToken(user.getId(), user.getEmail());

        try {
            Map<String, Object> resetData = Map.of(
                "email", user.getEmail(),
                "userName", user.getEmail().split("@")[0],
                "resetLink", "https://fresha.com/reset-password?token=" + resetToken,
                "expiryHours", "24",
                "requestTime", java.time.LocalDateTime.now().toString(),
                "ipAddress", "127.0.0.1" // In production, get from request
            );
            notificationClient.sendPasswordReset(resetData);
        } catch (Exception e) {
            System.err.println("Failed to send password reset email: " + e.getMessage());
            throw new RuntimeException("Failed to send password reset email");
        }

        return "Password reset email sent";
    }

    @Override
    public String resetPassword(String token, String newPassword) {
        // In production, validate token properly
        try {
            // For now, just update password - in production validate token expiry, etc.
            String email = jwtUtil.extractEmail(token);
            User user = repo.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Invalid token"));

            user.setPassword(passwordEncoder.encode(newPassword));
            repo.save(user);

            return "Password reset successfully";
        } catch (Exception e) {
            throw new RuntimeException("Invalid or expired token");
        }
    }
}
