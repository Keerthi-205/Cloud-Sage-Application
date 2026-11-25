
package com.cloudsage.ai;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @GetMapping("/resources/{resourceId}/explanation")
    public ResponseEntity<AIService.AIExplanationResponse>
            explainResource(@PathVariable Long resourceId) {

        return ResponseEntity.ok(
                aiService.explainResource(resourceId)
        );
    }
}
