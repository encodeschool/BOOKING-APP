package uz.encode.fresh.core_service.business.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import uz.encode.fresh.core_service.business.dto.BusinessResponse;
import uz.encode.fresh.core_service.business.dto.CreateBusinessRequest;
import uz.encode.fresh.core_service.business.entity.Business;
import uz.encode.fresh.core_service.business.service.BusinessService;

@RestController
@RequestMapping("/api/businesses")
public class BusinessController {

    @Autowired
    private BusinessService service;

    @PostMapping
    public BusinessResponse create(HttpServletRequest request,
                                   @Valid @RequestBody CreateBusinessRequest req) {

        Long userId = (Long) request.getAttribute("userId");

        Business b = service.create(userId, req);

        return new BusinessResponse(
            b.getId(),
            b.getName(),
            b.getDescription(),
            b.getAddress(),
            b.getPhone(),
            b.getCategory(),
            b.getWorkingHours(),
            b.getLatitude(),
            b.getLongitude()
    );
    }

    @GetMapping
    public List<BusinessResponse> myBusinesses(HttpServletRequest request) {

        Long userId = (Long) request.getAttribute("userId");

        return service.getByOwner(userId)
                .stream()
                .map(b -> new BusinessResponse(
                        b.getId(),
                        b.getName(),
                        b.getDescription(),
                        b.getAddress(),
                        b.getPhone(),
                        b.getCategory(),
                        b.getWorkingHours(),
                        b.getLatitude(),
                        b.getLongitude()
                ))
                .toList();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id,
                       HttpServletRequest request) {

        Long userId = (Long) request.getAttribute("userId");

        service.delete(id, userId);
    }
}