
package com.cloudsage.resource;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "http://localhost:5173")
public class ResourceMetricController {

    private final ResourceMetricRepository resourceMetricRepository;

    public ResourceMetricController(
            ResourceMetricRepository resourceMetricRepository) {
        this.resourceMetricRepository = resourceMetricRepository;
    }

    @GetMapping("/{resourceId}/metrics")
    public ResponseEntity<List<MetricResponse>> getResourceMetrics(
            @PathVariable Long resourceId) {

        List<MetricResponse> metrics =
                resourceMetricRepository
                        .findByResourceIdOrderByRecordedAtAsc(resourceId)
                        .stream()
                        .map(metric -> new MetricResponse(
                                metric.getId(),
                                metric.getResource().getId(),
                                metric.getCpuUtilization(),
                                metric.getMemoryUtilization(),
                                metric.getMemoryUsedGiB(),
                                metric.getNetworkUtilization(),
                                metric.getRequestCount(),
                                metric.getAverageLatency(),
                                metric.getErrorRate(),
                                metric.getRecordedAt()))
                        .toList();

        return ResponseEntity.ok(metrics);
    }

    public record MetricResponse(
            Long id,
            Long resourceId,
            Double cpuUtilization,
            Double memoryUtilization,
            Double memoryUsedGiB,
            Double networkUtilization,
            Double requestCount,
            Double averageLatency,
            Double errorRate,
            LocalDateTime recordedAt) {
    }
}
