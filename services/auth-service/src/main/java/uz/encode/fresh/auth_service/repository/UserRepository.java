package uz.encode.fresh.auth_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import uz.encode.fresh.auth_service.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Object> {
    Optional<User> findByEmail(String email);
}
