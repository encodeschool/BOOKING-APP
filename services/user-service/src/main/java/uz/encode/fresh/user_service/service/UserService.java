package uz.encode.fresh.user_service.service;   

import java.util.List;

import uz.encode.fresh.user_service.dto.UpdateUserRequest;
import uz.encode.fresh.user_service.entity.Role;
import uz.encode.fresh.user_service.entity.User;

public interface UserService {
    User getById(Long id);

    User createIfNotExists(Long id, String email, Role role, String fullName);

    User update(Long id, UpdateUserRequest req);

    User updateById(Long id, UpdateUserRequest req);

    void delete(Long id);

    List<User> getAll();

    User setRole(Long id, Role role);
}
