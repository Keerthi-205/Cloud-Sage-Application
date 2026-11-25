
package com.cloudsage.resource;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "resource_metrics")
public class ResourceMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double cpuUtilization;
    private Double memoryUtilization;
    private Double memoryUsedGiB;
    private Double networkUtilization;
    private Double requestCount;
    private Double averageLatency;
    private Double errorRate;
    private LocalDateTime recordedAt;

    @ManyToOne
    @JoinColumn(name = "resource_id", nullable = false)
    private CloudResource resource;

    public ResourceMetric() {
    }

    public Long getId() {
        return id;
    }

    public Double getCpuUtilization() {
        return cpuUtilization;
    }

    public void setCpuUtilization(Double cpuUtilization) {
        this.cpuUtilization = cpuUtilization;
    }

    public Double getMemoryUtilization() {
        return memoryUtilization;
    }

    public void setMemoryUtilization(Double memoryUtilization) {
        this.memoryUtilization = memoryUtilization;
    }

    public Double getMemoryUsedGiB() {
        return memoryUsedGiB;
    }

    public void setMemoryUsedGiB(Double memoryUsedGiB) {
        this.memoryUsedGiB = memoryUsedGiB;
    }

    public Double getNetworkUtilization() {
        return networkUtilization;
    }

    public void setNetworkUtilization(Double networkUtilization) {
        this.networkUtilization = networkUtilization;
    }

    public Double getRequestCount() {
        return requestCount;
    }

    public void setRequestCount(Double requestCount) {
        this.requestCount = requestCount;
    }

    public Double getAverageLatency() {
        return averageLatency;
    }

    public void setAverageLatency(Double averageLatency) {
        this.averageLatency = averageLatency;
    }

    public Double getErrorRate() {
        return errorRate;
    }

    public void setErrorRate(Double errorRate) {
        this.errorRate = errorRate;
    }

    public LocalDateTime getRecordedAt() {
        return recordedAt;
    }

    public void setRecordedAt(LocalDateTime recordedAt) {
        this.recordedAt = recordedAt;
    }

    public CloudResource getResource() {
        return resource;
    }

    public void setResource(CloudResource resource) {
        this.resource = resource;
    }
}
