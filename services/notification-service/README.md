# Notification Service

A microservice for sending custom HTML emails in the Booking Platform.

## Features

- Send custom HTML emails
- Template-based emails using Thymeleaf
- RESTful API for email notifications
- Integration with Spring Cloud Eureka for service discovery

## API Endpoints

### Send HTML Email

**POST** `/api/notifications/email`

Send a custom HTML email.

**Request Body:**
```json
{
  "to": "user@example.com",
  "subject": "Booking Confirmation",
  "htmlContent": "<h1>Your booking is confirmed!</h1>",
  "from": "noreply@bookingapp.com" // optional
}
```

### Send Template Email

**POST** `/api/notifications/email/template`

Send an email using a Thymeleaf template.

**Request Parameters:**
- `to`: Recipient email
- `subject`: Email subject
- `templateName`: Template file name (without .html extension)

**Request Body:** Template variables as JSON
```json
{
  "userName": "John Doe",
  "bookingId": "BK-12345",
  "serviceName": "Hotel Booking",
  "bookingDate": "2024-01-15",
  "bookingTime": "14:00"
}
```

### Send HTML Email with Variables

**POST** `/api/notifications/email/html`

Send HTML email with inline variable substitution.

**Request Body (EmailRequest):**
```json
{
  "to": "user@example.com",
  "subject": "Booking Confirmation",
  "htmlContent": "<h1>Hello ${userName}!</h1><p>Your booking ${bookingId} is confirmed.</p>"
}
```

**Request Body (Variables):** Map of variables
```json
{
  "userName": "John Doe",
  "bookingId": "BK-12345"
}
```

## Email Templates

Templates are stored in `src/main/resources/templates/`.

Example template: `booking-confirmation.html`

## Configuration

Configure email settings in `application-dev.yml`:

```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: your-email@gmail.com
    password: your-app-password
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
            required: true
```

## Building and Running

```bash
./mvnw clean compile
./mvnw spring-boot:run
```

The service runs on port 8086 by default.

## Dependencies

- Spring Boot Web
- Spring Boot Mail
- Spring Boot Thymeleaf
- Spring Cloud Eureka Client