package uz.encode.fresh.notification_service.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.encode.fresh.notification_service.dto.EmailRequest;
import uz.encode.fresh.notification_service.service.EmailService;

import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final EmailService emailService;

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
            @Valid @RequestBody EmailRequest request,
            @RequestBody(required = false) Map<String, Object> variables) {
        try {
            emailService.sendHtmlEmail(request, variables);
            return ResponseEntity.ok("HTML email with variables sent successfully");
        } catch (MessagingException e) {
            log.error("Failed to send HTML email with variables", e);
            return ResponseEntity.internalServerError().body("Failed to send HTML email: " + e.getMessage());
        }
    }
}