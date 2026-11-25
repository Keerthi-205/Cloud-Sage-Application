
package com.cloudsage.data;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/historical-data")
public class HistoricalDatasetController {

    private final HistoricalDatasetService historicalDatasetService;

    public HistoricalDatasetController(
            HistoricalDatasetService historicalDatasetService) {
        this.historicalDatasetService = historicalDatasetService;
    }

    @PostMapping("/import")
    public ResponseEntity<Map<String, Object>> importDataset() {
        try {
            HistoricalDatasetService.ImportResult result =
                    historicalDatasetService.importDataset();

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "resourceName", result.resourceName(),
                    "importedRecords", result.importedRecords(),
                    "alreadyImported", result.alreadyImported(),
                    "message", result.message()
            ));

        } catch (IOException | RuntimeException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    Map.of(
                            "success", false,
                            "message", exception.getMessage() == null
                                    ? "Dataset import failed."
                                    : exception.getMessage()
                    )
            );
        }
    }
}
