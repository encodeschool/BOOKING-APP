package uz.encode.fresh.user_service.dto;
import uz.encode.fresh.user_service.entity.Role;

public class UserResponse {
    public Long id;
    public String email;
    public Role role;
    public String fullName;
    public String phone;
}