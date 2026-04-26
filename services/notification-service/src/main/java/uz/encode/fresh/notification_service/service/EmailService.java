package uz.encode.fresh.notification_service.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import uz.encode.fresh.notification_service.dto.EmailRequest;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String defaultFrom;

    public void sendHtmlEmail(EmailRequest request) throws MessagingException {
        sendHtmlEmail(request, null);
    }

    public void sendHtmlEmail(EmailRequest request, Map<String, Object> templateVariables) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        String from = request.getFrom() != null ? request.getFrom() : defaultFrom;
        helper.setFrom(from);
        helper.setTo(request.getTo());
        helper.setSubject(request.getSubject());

        String htmlContent = request.getHtmlContent();
        if (templateVariables != null && !templateVariables.isEmpty()) {
            Context context = new Context();
            templateVariables.forEach(context::setVariable);
            htmlContent = templateEngine.process(request.getHtmlContent(), context);
        }

        helper.setText(htmlContent, true); // true indicates HTML

        mailSender.send(message);
        log.info("HTML email sent to: {}", request.getTo());
    }

    public void sendTemplateEmail(String to, String subject, String templateName, Map<String, Object> variables) throws MessagingException {
        sendTemplateEmail(to, subject, templateName, variables, null);
    }

    public void sendTemplateEmail(String to, String subject, String templateName, Map<String, Object> variables, String from) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        String sender = from != null ? from : defaultFrom;
        helper.setFrom(sender);
        helper.setTo(to);
        helper.setSubject(subject);

        Context context = new Context();
        if (variables != null) {
            variables.forEach(context::setVariable);
        }

        String htmlContent = templateEngine.process(templateName, context);
        helper.setText(htmlContent, true);

        mailSender.send(message);
        log.info("Template email sent to: {} using template: {}", to, templateName);
    }
}