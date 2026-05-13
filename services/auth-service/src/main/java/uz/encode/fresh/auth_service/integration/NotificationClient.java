package uz.encode.fresh.auth_service.integration;

import java.util.Map;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "notification-service")
public interface NotificationClient {

    @PostMapping("/api/notifications/user/welcome")
    void sendUserWelcome(@RequestBody Map<String, Object> userData);

    @PostMapping("/api/notifications/user/password-reset")
    void sendPasswordReset(@RequestBody Map<String, Object> resetData);
}