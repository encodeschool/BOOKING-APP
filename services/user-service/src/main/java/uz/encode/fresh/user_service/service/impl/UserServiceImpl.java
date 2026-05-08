package uz.encode.fresh.user_service.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import uz.encode.fresh.user_service.dto.UpdateUserRequest;
import uz.encode.fresh.user_service.entity.Preferences;
import uz.encode.fresh.user_service.entity.Role;
import uz.encode.fresh.user_service.entity.User;
import uz.encode.fresh.user_service.exception.ResourceNotFoundException;
import uz.encode.fresh.user_service.repository.UserRepository;
import uz.encode.fresh.user_service.service.UserService;


@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository repo;

    @Override
    public User getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public User createIfNotExists(Long id, String email, Role role) {
        return repo.findById(id).orElseGet(() -> {
            User u = new User();
            u.setId(id);
            u.setEmail(email);
            u.setRole(role);
            u.setPreferences(new Preferences());
            return repo.save(u);
        });
    }

    @Override
    public User update(Long id, UpdateUserRequest req) {
        User user = getById(id);

        user.setFullName(req.fullName);
        user.setPhone(req.phone);

        Preferences p = user.getPreferences();
        p.setLanguage(req.language);
        p.setTimezone(req.timezone);
        p.setEmailNotifications(req.emailNotifications);

        user.setPreferences(p);

        return repo.save(user);
    }

    @Override
    public List<User> getAll() {
        return repo.findAll();
    }
}