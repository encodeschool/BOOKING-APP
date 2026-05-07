package uz.encode.fresh.booking_service.integration;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import uz.encode.fresh.booking_service.integration.dto.EmailNotificationRequest;

@FeignClient(name = "notification-service")
public interface NotificationClient {

    @PostMapping("/api/notifications/email")
    void sendEmail(@RequestBody EmailNotificationRequest request);
}
