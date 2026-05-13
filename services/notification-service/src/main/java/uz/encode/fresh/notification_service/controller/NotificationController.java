package uz.encode.fresh.notification_service.controller;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import uz.encode.fresh.notification_service.dto.EmailRequest;
import uz.encode.fresh.notification_service.dto.HtmlEmailRequest;
import uz.encode.fresh.notification_service.service.EmailService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private static final Logger log = LoggerFactory.getLogger(NotificationController.class);
    private final EmailService emailService;

    public NotificationController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/email")
    public ResponseEntity<String> sendEmail(@Valid @RequestBody EmailRequest request) {
        try {
            emailService.sendHtmlEmail(request);
            return ResponseEntity.ok("Email sent successfully");
        } catch (MessagingException e) {
            log.error("Failed to send email", e);
            return ResponseEntity.internalServerError().body("Failed to send email: " + e.getMessage());
        }
    }

    @PostMapping("/email/template")
    public ResponseEntity<String> sendTemplateEmail(
            @RequestParam String to,
            @RequestParam String subject,
            @RequestParam String templateName,
            @RequestBody Map<String, Object> variables) {
        try {
            emailService.sendTemplateEmail(to, subject, templateName, variables);
            return ResponseEntity.ok("Template email sent successfully");
        } catch (MessagingException e) {
            log.error("Failed to send template email", e);
            return ResponseEntity.internalServerError().body("Failed to send template email: " + e.getMessage());
        }
    }

    @PostMapping("/email/html")
    public ResponseEntity<String> sendHtmlEmailWithVariables(
            @Valid @RequestBody HtmlEmailRequest request) {
        try {
            emailService.sendHtmlEmail(request.toEmailRequest(), request.getVariables());
            return ResponseEntity.ok("HTML email with variables sent successfully");
        } catch (MessagingException e) {
            log.error("Failed to send HTML email with variables", e);
            return ResponseEntity.internalServerError().body("Failed to send HTML email: " + e.getMessage());
        }
    }

    // Booking Notifications
    @PostMapping("/booking/confirmation")
    public ResponseEntity<String> sendBookingConfirmation(@RequestBody Map<String, Object> bookingData) {
        try {
            emailService.sendTemplateEmail(
                (String) bookingData.get("customerEmail"),
                "Your Booking is Confirmed - Fresha",
                "booking-confirmation",
                bookingData
            );
            return ResponseEntity.ok("Booking confirmation sent successfully");
        } catch (MessagingException e) {
            log.error("Failed to send booking confirmation", e);
            return ResponseEntity.internalServerError().body("Failed to send booking confirmation: " + e.getMessage());
        }
    }

    @PostMapping("/booking/status-update")
    public ResponseEntity<String> sendBookingStatusUpdate(@RequestBody Map<String, Object> bookingData) {
        try {
            String status = (String) bookingData.get("status");
            String subject = "Booking " + status.substring(0, 1).toUpperCase() + status.substring(1) + " - Fresha";

            emailService.sendTemplateEmail(
                (String) bookingData.get("customerEmail"),
                subject,
                "booking-status-update",
                bookingData
            );
            return ResponseEntity.ok("Booking status update sent successfully");
        } catch (MessagingException e) {
            log.error("Failed to send booking status update", e);
            return ResponseEntity.internalServerError().body("Failed to send booking status update: " + e.getMessage());
        }
    }

    @PostMapping("/booking/reminder")
    public ResponseEntity<String> sendBookingReminder(@RequestBody Map<String, Object> bookingData) {
        try {
            emailService.sendTemplateEmail(
                (String) bookingData.get("customerEmail"),
                "Appointment Reminder - Fresha",
                "booking-reminder",
                bookingData
            );
            return ResponseEntity.ok("Booking reminder sent successfully");
        } catch (MessagingException e) {
            log.error("Failed to send booking reminder", e);
            return ResponseEntity.internalServerError().body("Failed to send booking reminder: " + e.getMessage());
        }
    }

    @PostMapping("/admin/new-booking")
    public ResponseEntity<String> sendAdminNewBookingNotification(@RequestBody Map<String, Object> bookingData) {
        try {
            emailService.sendTemplateEmail(
                (String) bookingData.get("adminEmail"),
                "New Booking Request - Fresha",
                "admin-new-booking",
                bookingData
            );
            return ResponseEntity.ok("Admin notification sent successfully");
        } catch (MessagingException e) {
            log.error("Failed to send admin notification", e);
            return ResponseEntity.internalServerError().body("Failed to send admin notification: " + e.getMessage());
        }
    }

    // User Notifications
    @PostMapping("/user/welcome")
    public ResponseEntity<String> sendUserWelcome(@RequestBody Map<String, Object> userData) {
        try {
            emailService.sendTemplateEmail(
                (String) userData.get("email"),
                "Welcome to Fresha!",
                "user-welcome",
                userData
            );
            return ResponseEntity.ok("Welcome email sent successfully");
        } catch (MessagingException e) {
            log.error("Failed to send welcome email", e);
            return ResponseEntity.internalServerError().body("Failed to send welcome email: " + e.getMessage());
        }
    }

    @PostMapping("/user/password-reset")
    public ResponseEntity<String> sendPasswordReset(@RequestBody Map<String, Object> resetData) {
        try {
            emailService.sendTemplateEmail(
                (String) resetData.get("email"),
                "Password Reset Request - Fresha",
                "password-reset",
                resetData
            );
            return ResponseEntity.ok("Password reset email sent successfully");
        } catch (MessagingException e) {
            log.error("Failed to send password reset email", e);
            return ResponseEntity.internalServerError().body("Failed to send password reset email: " + e.getMessage());
        }
    }
}