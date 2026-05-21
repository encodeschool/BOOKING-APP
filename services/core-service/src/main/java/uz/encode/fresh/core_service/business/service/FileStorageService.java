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

    private final String baseUploadDir = System.getProperty("user.dir") + "/uploads/";

    public String save(MultipartFile file) {
        return save(file, "business");
    }

    public String save(MultipartFile file, String subFolder) {
        try {
            String uploadDir = baseUploadDir + subFolder + "/";

            Path dirPath = Paths.get(uploadDir);

            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }

            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();

            Path filePath = dirPath.resolve(filename);

            file.transferTo(filePath.toFile());

            return "/uploads/" + subFolder + "/" + filename;

        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("File upload failed: " + e.getMessage());
        }
    }

    public void delete(String path) {
        delete(path, "business");
    }

    public void delete(String path, String subFolder) {
        try {
            if (path == null) return;

            String prefix = "/uploads/" + subFolder + "/";

            String filename = path.replace(prefix, "");

            String uploadDir = baseUploadDir + subFolder + "/";

            Path filePath = Paths.get(uploadDir).resolve(filename);

            Files.deleteIfExists(filePath);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}