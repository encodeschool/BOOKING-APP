package uz.encode.fresh.auth_service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

import uz.encode.fresh.auth_service.integration.UserServiceClient;

@SpringBootTest(properties = {
		"spring.cloud.config.enabled=false",
		"spring.config.import=",
		"eureka.client.enabled=false",
		"spring.datasource.url=jdbc:h2:mem:auth-test;MODE=PostgreSQL;DB_CLOSE_DELAY=-1",
		"spring.datasource.driver-class-name=org.h2.Driver",
		"spring.datasource.username=sa",
		"spring.datasource.password=",
		"spring.jpa.hibernate.ddl-auto=create-drop",
		"jwt.secret=mysupersecuresecretkeythatisatleast32characterslong123",
		"spring.main.allow-bean-definition-overriding=true"
})
class AuthServiceApplicationTests {

	@Test
	void contextLoads() {
	}

	@TestConfiguration
	static class TestConfig {
		@Bean(name = "uz.encode.fresh.auth_service.integration.UserServiceClient")
		UserServiceClient userServiceClient() {
			return request -> {
			};
		}
	}

}
