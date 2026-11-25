package com.cloudsage.recommendation;

import java.time.LocalDateTime;

import com.cloudsage.resource.CloudResource;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "recommendations")
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String recommendedAction;

    private String reason;

    private Double estimatedCost;

    private Double estimatedPerformanceScore;

    private Double estimatedReliabilityScore;

    private String riskLevel;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "resource_id", nullable = false)
    private CloudResource resource;

    public Recommendation() {
    }

    public Long getId() {
        return id;
    }

    public String getRecommendedAction() {
        return recommendedAction;
    }

    public void setRecommendedAction(String recommendedAction) {
        this.recommendedAction = recommendedAction;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public Double getEstimatedCost() {
        return estimatedCost;
    }

    public void setEstimatedCost(Double estimatedCost) {
        this.estimatedCost = estimatedCost;
    }

    public Double getEstimatedPerformanceScore() {
        return estimatedPerformanceScore;
    }

    public void setEstimatedPerformanceScore(Double estimatedPerformanceScore) {
        this.estimatedPerformanceScore = estimatedPerformanceScore;
    }

    public Double getEstimatedReliabilityScore() {
        return estimatedReliabilityScore;
    }

    public void setEstimatedReliabilityScore(Double estimatedReliabilityScore) {
        this.estimatedReliabilityScore = estimatedReliabilityScore;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public CloudResource getResource() {
        return resource;
    }

    public void setResource(CloudResource resource) {
        this.resource = resource;
    }
}