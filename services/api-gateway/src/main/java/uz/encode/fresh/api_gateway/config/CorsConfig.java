package uz.encode.fresh.api_gateway.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {

        CorsConfiguration config = new CorsConfiguration();

        // Frontend origins
        config.setAllowedOriginPatterns(List.of(
            "http://localhost:3010",
            "http://localhost:3011",
            "https://*.encode.uz"
        ));

        // Allow all headers
        config.setAllowedHeaders(List.of("*"));

        // Allow all methods
        config.setAllowedMethods(List.of("*"));

        // Allow credentials (JWT)
        config.setAllowCredentials(true);

        config.setExposedHeaders(List.of("Authorization", "Content-Disposition"));
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsWebFilter(source);
    }
}