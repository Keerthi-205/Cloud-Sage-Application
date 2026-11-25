package com.cloudsage.resource;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final CloudResourceRepository cloudResourceRepository;

    public ResourceController(
            CloudResourceRepository cloudResourceRepository) {
        this.cloudResourceRepository = cloudResourceRepository;
    }

    @GetMapping
    public List<CloudResource> getAllResources() {
        return cloudResourceRepository.findAll();
    }
}