package uz.encode.fresh.core_service.business.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    public String save(MultipartFile file) {
        return save(file, "business");
    }

    public String save(MultipartFile file, String subFolder) {
        try {
            Path dirPath = resolveUploadRoot().resolve(subFolder).toAbsolutePath().normalize();

            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }

            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = dirPath.resolve(filename);
            file.transferTo(filePath.toFile());

            return "/uploads/" + subFolder + "/" + filename;

        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("File upload failed: " + e.getMessage(), e);
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

            Path filePath = resolveUploadRoot().resolve(subFolder).resolve(filename).toAbsolutePath().normalize();
            Files.deleteIfExists(filePath);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private Path resolveUploadRoot() {
        Path currentDir = Paths.get(System.getProperty("user.dir")).toAbsolutePath().normalize();
        List<Path> candidates = Arrays.asList(
                currentDir.resolve("uploads"),
                currentDir.resolve("..").resolve("uploads").normalize(),
                currentDir.resolve("..").resolve("..").resolve("uploads").normalize(),
                currentDir.resolve("..").resolve("..").resolve("..").resolve("uploads").normalize()
        );

        for (Path uploadDir : candidates) {
            if (Files.exists(uploadDir)) {
                return uploadDir;
            }
        }

        return candidates.get(0).toAbsolutePath().normalize();
    }
}