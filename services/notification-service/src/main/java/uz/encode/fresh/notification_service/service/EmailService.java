package uz.encode.fresh.notification_service.service;

import java.util.Map;
import java.util.Objects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import uz.encode.fresh.notification_service.dto.EmailRequest;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    public EmailService(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    @Value("${spring.mail.username}")
    private String defaultFrom;

    public void sendHtmlEmail(EmailRequest request) throws MessagingException {
        sendHtmlEmail(request, null);
    }

    public void sendHtmlEmail(EmailRequest request, Map<String, Object> templateVariables) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        String from = Objects.requireNonNullElse(request.getFrom(), defaultFrom);
        helper.setFrom(Objects.requireNonNull(from, "Email sender cannot be null"));
        helper.setTo(Objects.requireNonNull(request.getTo(), "Email recipient cannot be null"));
        helper.setSubject(Objects.requireNonNull(request.getSubject(), "Email subject cannot be null"));

        String htmlContent = Objects.requireNonNull(request.getHtmlContent(), "Email content cannot be null");
        if (templateVariables != null && !templateVariables.isEmpty()) {
            Context context = new Context();
            templateVariables.forEach(context::setVariable);
            htmlContent = templateEngine.process(request.getHtmlContent(), context);
        }

        helper.setText(Objects.requireNonNull(htmlContent, "Email content cannot be null"), true); // true indicates HTML

        mailSender.send(message);
        log.info("HTML email sent to: {}", request.getTo());
    }

    public void sendTemplateEmail(String to, String subject, String templateName, Map<String, Object> variables) throws MessagingException {
        sendTemplateEmail(to, subject, templateName, variables, null);
    }

    public void sendTemplateEmail(String to, String subject, String templateName, Map<String, Object> variables, String from) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        String sender = Objects.requireNonNullElse(from, defaultFrom);
        helper.setFrom(Objects.requireNonNull(sender, "Email sender cannot be null"));
        helper.setTo(Objects.requireNonNull(to, "Email recipient cannot be null"));
        helper.setSubject(Objects.requireNonNull(subject, "Email subject cannot be null"));

        Context context = new Context();
        if (variables != null) {
            variables.forEach(context::setVariable);
        }

        String htmlContent = templateEngine.process(templateName, context);
        helper.setText(Objects.requireNonNull(htmlContent, "Email content cannot be null"), true);

        mailSender.send(message);
        log.info("Template email sent to: {} using template: {}", to, templateName);
    }
}