
package com.cloudsage.analysis;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analysis")
@CrossOrigin(origins = "http://localhost:5173")
public class ResourceAnalysisController {

    private final ResourceAnalysisService resourceAnalysisService;

    public ResourceAnalysisController(
            ResourceAnalysisService resourceAnalysisService) {
        this.resourceAnalysisService = resourceAnalysisService;
    }

    @GetMapping("/resources/{resourceId}")
    public ResponseEntity<ResourceAnalysisService.ResourceAnalysis>
            analyzeResource(@PathVariable Long resourceId) {

        return ResponseEntity.ok(
                resourceAnalysisService.analyzeResource(resourceId));
    }
}
