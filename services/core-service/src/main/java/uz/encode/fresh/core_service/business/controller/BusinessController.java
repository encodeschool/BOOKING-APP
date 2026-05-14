package uz.encode.fresh.core_service.business.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import uz.encode.fresh.core_service.business.dto.BusinessResponse;
import uz.encode.fresh.core_service.business.dto.CreateBusinessRequest;
import uz.encode.fresh.core_service.business.entity.Business;
import uz.encode.fresh.core_service.business.service.BusinessService;

@RestController
@RequestMapping("/api/businesses")
public class BusinessController {

    @Autowired
    private BusinessService service;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public BusinessResponse create(
            HttpServletRequest request,

            @ModelAttribute CreateBusinessRequest req,

            @RequestParam(value = "images", required = false)
            List<MultipartFile> images
    ) {

        Long userId =
                (Long) request.getAttribute("userId");

        Business b =
                service.create(userId, req, images);

        return map(b);
    }

    @PutMapping("/{id}")
    public BusinessResponse update(
            @PathVariable("id") Long id,

            HttpServletRequest request,

            @RequestBody CreateBusinessRequest req
    ) {

        Long userId =
                (Long) request.getAttribute("userId");

        return map(service.update(id, userId, req));
    }

    @PostMapping(
            value = "/{id}/images",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public void addImages(
            @PathVariable("id") Long id,

            HttpServletRequest request,

            @RequestParam("images")
            List<MultipartFile> images
    ) {

        Long userId =
                (Long) request.getAttribute("userId");

        service.addImages(id, userId, images);
    }

    @DeleteMapping("/images/{imageId}")
    public void deleteImage(
            @PathVariable("imageId") Long imageId,

            HttpServletRequest request
    ) {

        Long userId =
                (Long) request.getAttribute("userId");

        service.deleteImage(imageId, userId);
    }

    @GetMapping
    public List<BusinessResponse> myBusinesses(
            HttpServletRequest request
    ) {

        Long userId =
                (Long) request.getAttribute("userId");

        return service.getByOwner(userId)
                .stream()
                .map(this::map)
                .toList();
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable("id") Long id,

            HttpServletRequest request
    ) {

        Long userId =
                (Long) request.getAttribute("userId");

        service.delete(id, userId);
    }

    private BusinessResponse map(Business b) {

        List<String> images =
                b.getImages() == null
                        ? List.of()
                        : b.getImages()
                                .stream()
                                .map(i -> i.getImageUrl())
                                .toList();

        return new BusinessResponse(
                b.getId(),
                b.getName(),
                b.getDescription(),
                b.getAddress(),
                b.getPhone(),
                b.getCategory(),
                b.getWorkingHours(),
                b.getLatitude(),
                b.getLongitude(),
                images
        );
    }
}