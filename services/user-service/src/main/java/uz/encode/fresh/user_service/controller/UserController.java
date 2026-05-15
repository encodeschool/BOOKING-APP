package uz.encode.fresh.user_service.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import uz.encode.fresh.user_service.dto.CreateUserRequest;
import uz.encode.fresh.user_service.dto.UpdateUserRequest;
import uz.encode.fresh.user_service.dto.UpdateUserRoleRequest;
import uz.encode.fresh.user_service.entity.Role;
import uz.encode.fresh.user_service.entity.User;
import uz.encode.fresh.user_service.service.UserService;


@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public User getMe(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return service.getById(userId);
    }

    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public User updateMe(HttpServletRequest request,
                     @Valid @RequestBody UpdateUserRequest req) {

        Long userId = (Long) request.getAttribute("userId");
        return service.update(userId, req);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<User> getUsers(@RequestParam(required = false) String email) {
        return service.getAll();
    }

    @DeleteMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public void deleteMe(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        service.delete(userId);
    }

    @PostMapping("/internal")
    public User createUser(@RequestBody CreateUserRequest request) {
        Role role = Role.CLIENT;
        if (request.role != null && !request.role.isBlank()) {
            try {
                role = Role.valueOf(request.role.toUpperCase());
            } catch (IllegalArgumentException ignored) {
                role = Role.CLIENT;
            }
        }
        return service.createIfNotExists(
                request.id,
                request.email,
                role
                , request.fullName
        );
    }

    @GetMapping("/internal/{id}")
    public User getUserInternal(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasAuthority('ADMIN')")
    public User updateRole(@PathVariable Long id, @RequestBody UpdateUserRoleRequest req) {
        return service.setRole(id, req.role());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public User updateById(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest req) {
        return service.updateById(id, req);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public void deleteById(@PathVariable Long id) {
        service.delete(id);
    }
}