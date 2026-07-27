package uz.encode.fresh.api_gateway;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.gateway.route.RouteDefinitionLocator;
import org.springframework.cloud.gateway.route.RouteDefinition;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(properties = {
    "spring.cloud.config.enabled=false",
    "eureka.client.enabled=false"
})
class GatewayRouteConfigurationTest {

    @Autowired
    private RouteDefinitionLocator routeDefinitionLocator;

    @Test
    void shouldExposeServiceRoutesWithExpectedPrefixes() {
        List<RouteDefinition> routes = routeDefinitionLocator.getRouteDefinitions().collectList().block();

        assertThat(routes).isNotNull();
        assertThat(routes).extracting(RouteDefinition::getId).contains(
            "auth-service",
            "user-service",
            "core-service",
            "booking-service",
            "notification-service"
        );

        RouteDefinition authRoute = routes.stream()
            .filter(route -> "auth-service".equals(route.getId()))
            .findFirst()
            .orElseThrow(AssertionError::new);

        assertThat(authRoute.getPredicates()).anyMatch(predicate -> predicate.getName().equals("Path")
            && predicate.getArgs().containsValue("/api/auth/**"));
    }
}
