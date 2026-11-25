package com.cloudsage.system;

import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class SystemService {

    public Map<String, String> getHealthStatus() {
        return Map.of("status", "UP");
    }
}