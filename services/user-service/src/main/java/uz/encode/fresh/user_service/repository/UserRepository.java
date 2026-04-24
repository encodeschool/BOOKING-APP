package uz.encode.fresh.user_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import uz.encode.fresh.user_service.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
}