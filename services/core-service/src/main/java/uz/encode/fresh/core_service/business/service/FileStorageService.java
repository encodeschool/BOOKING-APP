package uz.encode.fresh.core_service.business.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    private final String uploadDir =
            System.getProperty("user.dir") + "/uploads/business/";

    public String save(MultipartFile file) {

        try {
            Path dirPath = Paths.get(uploadDir);

            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }

            String filename =
                    UUID.randomUUID() + "_" + file.getOriginalFilename();

            Path filePath = dirPath.resolve(filename);

            file.transferTo(filePath.toFile());

            return "/uploads/business/" + filename;

        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("File upload failed: " + e.getMessage());
        }
    }

    public void delete(String path) {

        try {
            if (path == null) return;

            String filename = path.replace("/uploads/business/", "");

            Path filePath =
                    Paths.get(uploadDir).resolve(filename);

            Files.deleteIfExists(filePath);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}