package uz.encode.fresh.user_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import uz.encode.fresh.user_service.dto.UpdateUserRequest;
import uz.encode.fresh.user_service.entity.User;
import uz.encode.fresh.user_service.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping("/me")
    public User getMe(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return service.getById(userId);
    }

    @PutMapping("/me")
    public User updateMe(HttpServletRequest request,
                     @Valid @RequestBody UpdateUserRequest req) {

        Long userId = (Long) request.getAttribute("userId");
        return service.update(userId, req);
    }
}