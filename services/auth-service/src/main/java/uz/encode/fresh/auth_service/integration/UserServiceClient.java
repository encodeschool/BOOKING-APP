package uz.encode.fresh.auth_service.integration;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import uz.encode.fresh.auth_service.integration.dto.CreateUserProfileRequest;
import uz.encode.fresh.auth_service.integration.dto.UserProfileResponse;

@FeignClient(name = "user-service")
public interface UserServiceClient {

    @PostMapping("/api/users/internal")
    void createUser(@RequestBody CreateUserProfileRequest request);

    @GetMapping("/api/users/internal/{id}")
    UserProfileResponse getUser(@PathVariable Long id);
}
