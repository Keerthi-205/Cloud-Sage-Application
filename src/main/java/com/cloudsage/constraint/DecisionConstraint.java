package com.cloudsage.constraint;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "decision_constraints")
public class DecisionConstraint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double maximumBudget;

    private Double minimumPerformanceScore;

    private Double minimumReliabilityScore;

    private String workloadPriority;

    private String serviceLevelRequirement;

    public DecisionConstraint() {
    }

    public Long getId() {
        return id;
    }

    public Double getMaximumBudget() {
        return maximumBudget;
    }

    public void setMaximumBudget(Double maximumBudget) {
        this.maximumBudget = maximumBudget;
    }

    public Double getMinimumPerformanceScore() {
        return minimumPerformanceScore;
    }

    public void setMinimumPerformanceScore(Double minimumPerformanceScore) {
        this.minimumPerformanceScore = minimumPerformanceScore;
    }

    public Double getMinimumReliabilityScore() {
        return minimumReliabilityScore;
    }

    public void setMinimumReliabilityScore(Double minimumReliabilityScore) {
        this.minimumReliabilityScore = minimumReliabilityScore;
    }

    public String getWorkloadPriority() {
        return workloadPriority;
    }

    public void setWorkloadPriority(String workloadPriority) {
        this.workloadPriority = workloadPriority;
    }

    public String getServiceLevelRequirement() {
        return serviceLevelRequirement;
    }

    public void setServiceLevelRequirement(String serviceLevelRequirement) {
        this.serviceLevelRequirement = serviceLevelRequirement;
    }
}