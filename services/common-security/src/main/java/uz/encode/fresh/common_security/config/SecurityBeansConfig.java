package uz.encode.fresh.common_security.config;


import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import uz.encode.fresh.common_security.filter.JwtAuthenticationFilter;
import uz.encode.fresh.common_security.jwt.JwtProperties;
import uz.encode.fresh.common_security.jwt.JwtUtil;

@Configuration
@EnableConfigurationProperties(JwtProperties.class)
public class SecurityBeansConfig {

    @Bean
    public JwtUtil jwtUtil(JwtProperties props) {
        return new JwtUtil(props);
    }

    @Bean
    public JwtAuthenticationFilter jwtFilter(JwtUtil jwtUtil) {
        return new JwtAuthenticationFilter(jwtUtil);
    }
}