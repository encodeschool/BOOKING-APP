package uz.encode.fresh.core_service.business.service;

import java.nio.charset.StandardCharsets;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;

import feign.template.UriUtils;

@Service
public class GeocodingService {

    private final RestTemplate restTemplate = new RestTemplate();

    public double[] geocode(String address) {

        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "FreshApp/1.0 (contact: your-email@example.com)");
        headers.set("Accept-Language", "en");
        headers.set("Referer", "http://localhost");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        String url = "https://nominatim.openstreetmap.org/search"
                + "?q=" + UriUtils.encode(address, StandardCharsets.UTF_8)
                + "&format=json&limit=1";

        
        ResponseEntity<JsonNode> response =
                restTemplate.exchange(url, HttpMethod.GET, entity, JsonNode.class);

        JsonNode body = response.getBody();

        if (body != null && body.isArray() && body.size() > 0) {

            JsonNode result = body.get(0);

            return new double[]{
                    result.get("lat").asDouble(),
                    result.get("lon").asDouble()
            };
        }

        throw new RuntimeException("Address not found");
    }
}