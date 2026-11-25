package com.cloudsage.decision;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
@Service
public class DecisionEngine {
    private static final int MINIMUM_HISTORY_RECORDS = 10;
    private static final double CPU_REVIEW_THRESHOLD = 80.0;
    private static final double MEMORY_REVIEW_THRESHOLD = 80.0;
    private static final double LATENCY_REVIEW_THRESHOLD = 200.0;
    private static final double ERROR_RATE_REVIEW_THRESHOLD = 2.0;
    public DecisionResult evaluate(Double cpuPeak, Double memoryPeak, Double averageLatency, Double errorRate, long historyCount) {
        List<Evidence> evidence = new ArrayList<>();
        if (historyCount < MINIMUM_HISTORY_RECORDS) {
            evidence.add(new Evidence(
                    "DATA_QUALITY",
                    "History Count",
                    (double) historyCount,
                    "records",
                    "Historical observations are insufficient for a reliable infrastructure decision.",
                    DataQuality.INSUFFICIENT));
            return new DecisionResult(
                    "DO_NOT_RECOMMEND",
                    "Collect additional monitoring data",
                    "The available history is insufficient to justify an infrastructure change.",
                    "INFO",
                    DataQuality.LIMITED,
                    evidence);
        }
        addEvidence(evidence, "PERFORMANCE", "CPU Peak", cpuPeak, "%", CPU_REVIEW_THRESHOLD, "CPU utilization shows potential capacity pressure.", "CPU utilization is not a strong pressure signal.");
        addEvidence(evidence, "PERFORMANCE", "Memory Peak", memoryPeak, "%", MEMORY_REVIEW_THRESHOLD, "Memory utilization shows potential capacity pressure.", "Memory utilization is not a strong pressure signal.");
        addEvidence(evidence, "RELIABILITY", "Average Latency", averageLatency, "ms", LATENCY_REVIEW_THRESHOLD, "Average latency indicates potential performance pressure.", "Average latency is not a strong pressure signal.");
        addEvidence(evidence, "RELIABILITY", "Error Rate", errorRate, "%", ERROR_RATE_REVIEW_THRESHOLD, "Error rate indicates potential reliability pressure.", "Error rate is not a strong pressure signal.");
        boolean performancePressure =
                isAtOrAbove(cpuPeak, CPU_REVIEW_THRESHOLD)
                || isAtOrAbove(memoryPeak, MEMORY_REVIEW_THRESHOLD)
                || isAtOrAbove(averageLatency, LATENCY_REVIEW_THRESHOLD)
                || isAtOrAbove(errorRate, ERROR_RATE_REVIEW_THRESHOLD);
        if (performancePressure) {
            return new DecisionResult(
                    "REVIEW_RESOURCE",
                    "Review resource capacity and workload behavior",
                    "Performance or reliability pressure was detected from the available monitoring evidence.",
                    "WARNING",
                    DataQuality.SUFFICIENT,
                    evidence);
        }
        return new DecisionResult(
                "NO_ACTION",
                "Continue monitoring",
                "No strong performance or reliability pressure was detected from the available evidence.",
                "INFO",
                DataQuality.SUFFICIENT,
                evidence);
    }
    private void addEvidence(List<Evidence> evidence, String category, String metric, Double value, String unit, double threshold, String pressureInterpretation, String normalInterpretation) {
        String interpretation = value != null && value >= threshold ? pressureInterpretation : normalInterpretation;
        evidence.add(new Evidence(
                category,
                metric,
                value,
                unit,
                interpretation,
                DataQuality.SUFFICIENT));
    }
    private boolean isAtOrAbove(Double value, double threshold) {
        return value != null && value >= threshold;
    }
}