package com.cloudsage.recommendation;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "recommendation_outcomes")
public class RecommendationOutcome {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String approvalStatus;

    private String actualAction;

    private Double actualCost;

    private Double actualPerformanceScore;

    private Double actualReliabilityScore;

    private String outcomeStatus;

    private String notes;

    private LocalDateTime recordedAt;

    @OneToOne
    @JoinColumn(name = "recommendation_id", nullable = false)
    private Recommendation recommendation;

    public RecommendationOutcome() {
    }

    public Long getId() {
        return id;
    }

    public String getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(String approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    public String getActualAction() {
        return actualAction;
    }

    public void setActualAction(String actualAction) {
        this.actualAction = actualAction;
    }

    public Double getActualCost() {
        return actualCost;
    }

    public void setActualCost(Double actualCost) {
        this.actualCost = actualCost;
    }

    public Double getActualPerformanceScore() {
        return actualPerformanceScore;
    }

    public void setActualPerformanceScore(Double actualPerformanceScore) {
        this.actualPerformanceScore = actualPerformanceScore;
    }

    public Double getActualReliabilityScore() {
        return actualReliabilityScore;
    }

    public void setActualReliabilityScore(Double actualReliabilityScore) {
        this.actualReliabilityScore = actualReliabilityScore;
    }

    public String getOutcomeStatus() {
        return outcomeStatus;
    }

    public void setOutcomeStatus(String outcomeStatus) {
        this.outcomeStatus = outcomeStatus;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getRecordedAt() {
        return recordedAt;
    }

    public void setRecordedAt(LocalDateTime recordedAt) {
        this.recordedAt = recordedAt;
    }

    public Recommendation getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(Recommendation recommendation) {
        this.recommendation = recommendation;
    }
}