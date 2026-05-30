package uz.encode.fresh.core_service.config;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(resolveUploadLocation());
    }

    private String resolveUploadLocation() {
        Path currentDir = Paths.get(System.getProperty("user.dir")).toAbsolutePath().normalize();
        List<Path> candidates = Arrays.asList(
                currentDir.resolve("uploads"),
                currentDir.resolve("..").resolve("uploads").normalize(),
                currentDir.resolve("..").resolve("..").resolve("uploads").normalize(),
                currentDir.resolve("..").resolve("..").resolve("..").resolve("uploads").normalize()
        );

        for (Path uploadDir : candidates) {
            if (Files.exists(uploadDir)) {
                return uploadDir.toUri().toString();
            }
        }

        return candidates.get(0).toAbsolutePath().normalize().toUri().toString();
    }
}
