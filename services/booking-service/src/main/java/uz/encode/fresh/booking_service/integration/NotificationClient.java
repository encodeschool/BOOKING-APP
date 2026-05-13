package uz.encode.fresh.booking_service.integration;

import java.util.Map;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import uz.encode.fresh.booking_service.integration.dto.EmailNotificationRequest;

@FeignClient(name = "notification-service")
public interface NotificationClient {

    @PostMapping("/api/notifications/email")
    void sendEmail(@RequestBody EmailNotificationRequest request);

    @PostMapping("/api/notifications/booking/confirmation")
    void sendBookingConfirmation(@RequestBody Map<String, Object> bookingData);

    @PostMapping("/api/notifications/booking/status-update")
    void sendBookingStatusUpdate(@RequestBody Map<String, Object> bookingData);

    @PostMapping("/api/notifications/booking/reminder")
    void sendBookingReminder(@RequestBody Map<String, Object> bookingData);

    @PostMapping("/api/notifications/admin/new-booking")
    void sendAdminNewBookingNotification(@RequestBody Map<String, Object> bookingData);
}
