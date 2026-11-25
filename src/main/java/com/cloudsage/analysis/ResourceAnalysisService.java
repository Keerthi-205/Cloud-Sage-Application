package com.cloudsage.analysis;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import com.cloudsage.decision.DataQuality;
import com.cloudsage.decision.DecisionEngine;
import com.cloudsage.decision.DecisionResult;
import com.cloudsage.decision.Evidence;
import com.cloudsage.resource.ResourceMetric;
import com.cloudsage.resource.ResourceMetricRepository;
@Service
public class ResourceAnalysisService {
    private static final double CPU_LOW_THRESHOLD = 20.0;
    private static final double CPU_HIGH_THRESHOLD = 80.0;
    private static final double MEMORY_HIGH_THRESHOLD = 80.0;
    private static final double ERROR_RATE_REVIEW_THRESHOLD = 2.0;
    private static final double LATENCY_REVIEW_THRESHOLD_MS = 200.0;
    private static final int MINIMUM_HISTORY_RECORDS = 10;
    private static final long STALE_DATA_HOURS = 24;
    private final ResourceMetricRepository metricRepository;
    private final DecisionEngine decisionEngine;
    public ResourceAnalysisService(ResourceMetricRepository metricRepository, DecisionEngine decisionEngine) {
        this.metricRepository = metricRepository;
        this.decisionEngine = decisionEngine;
    }
    public ResourceAnalysis analyzeResource(Long resourceId) {
        if (resourceId == null || resourceId <= 0) {
            throw new IllegalArgumentException("Resource ID must be a positive number.");
        }
        List<ResourceMetric> metrics = metricRepository.findByResourceIdOrderByRecordedAtAsc(resourceId);
        if (metrics.isEmpty()) {
            throw new IllegalArgumentException("No metrics found for resource ID " + resourceId);
        }
        double totalCpu = 0;
        double totalMemoryPercent = 0;
        double totalMemoryGiB = 0;
        double totalNetwork = 0;
        double totalRequests = 0;
        double totalLatency = 0;
        double totalErrorRate = 0;
        Double peakCpu = null;
        Double peakMemoryPercent = null;
        Double peakMemoryGiB = null;
        Double peakNetwork = null;
        Double peakRequests = null;
        Double peakLatency = null;
        Double peakErrorRate = null;
        int cpuCount = 0;
        int memoryPercentCount = 0;
        int memoryGiBCount = 0;
        int networkCount = 0;
        int requestCount = 0;
        int latencyCount = 0;
        int errorRateCount = 0;
        LocalDateTime latestTimestamp = null;
        for (ResourceMetric metric : metrics) {
            if (metric.getRecordedAt() != null && (latestTimestamp == null || metric.getRecordedAt().isAfter(latestTimestamp))) {
                latestTimestamp = metric.getRecordedAt();
            }
            Double cpu = metric.getCpuUtilization();
            Double memoryPercent = metric.getMemoryUtilization();
            Double memoryGiB = metric.getMemoryUsedGiB();
            Double network = metric.getNetworkUtilization();
            Double requests = metric.getRequestCount();
            Double latency = metric.getAverageLatency();
            Double errorRate = metric.getErrorRate();
            if (isValidPercentage(cpu)) {
                totalCpu += cpu;
                peakCpu = max(peakCpu, cpu);
                cpuCount++;
            }
            if (isValidPercentage(memoryPercent)) {
                totalMemoryPercent += memoryPercent;
                peakMemoryPercent = max(peakMemoryPercent, memoryPercent);
                memoryPercentCount++;
            }
            if (isValidNonNegative(memoryGiB)) {
                totalMemoryGiB += memoryGiB;
                peakMemoryGiB = max(peakMemoryGiB, memoryGiB);
                memoryGiBCount++;
            }
            if (isValidPercentage(network)) {
                totalNetwork += network;
                peakNetwork = max(peakNetwork, network);
                networkCount++;
            }
            if (isValidNonNegative(requests)) {
                totalRequests += requests;
                peakRequests = max(peakRequests, requests);
                requestCount++;
            }
            if (isValidNonNegative(latency)) {
                totalLatency += latency;
                peakLatency = max(peakLatency, latency);
                latencyCount++;
            }
            if (isValidPercentage(errorRate)) {
                totalErrorRate += errorRate;
                peakErrorRate = max(peakErrorRate, errorRate);
                errorRateCount++;
            }
        }
        Double averageCpu = average(totalCpu, cpuCount);
        Double averageMemoryPercent = average(totalMemoryPercent, memoryPercentCount);
        Double averageMemoryGiB = average(totalMemoryGiB, memoryGiBCount);
        Double averageNetwork = average(totalNetwork, networkCount);
        Double averageRequests = average(totalRequests, requestCount);
        Double averageLatency = average(totalLatency, latencyCount);
        Double averageErrorRate = average(totalErrorRate, errorRateCount);
        List<Recommendation> recommendations = new ArrayList<>();
        addDataFreshnessRecommendation(recommendations, latestTimestamp, metrics.size());
        addCpuRecommendation(recommendations, averageCpu, peakCpu, cpuCount);
        addMemoryRecommendation(recommendations, averageMemoryPercent, peakMemoryPercent, memoryPercentCount, averageMemoryGiB, peakMemoryGiB, memoryGiBCount);
        addNetworkRecommendation(recommendations, averageNetwork, peakNetwork, networkCount);
        addLatencyRecommendation(recommendations, averageLatency, peakLatency, latencyCount);
        addErrorRateRecommendation(recommendations, averageErrorRate, peakErrorRate, errorRateCount);
        if (requestCount == 0) {
            recommendations.add(new Recommendation(
                    "REQUEST_DATA_GAP",
                    "Request volume data unavailable",
                    "INFO",
                    "No valid request-count measurements are available.",
                    "Collect request volume data before evaluating demand patterns."));
        } else {
            recommendations.add(new Recommendation(
                    "REQUEST_VOLUME_REVIEW",
                    "Review request volume alongside performance",
                    "INFO",
                    "Average recorded request count is " + round(averageRequests) + ", with a peak of " + round(peakRequests) + ".",
                    "Confirm the measurement interval and compare traffic with latency, CPU and error rates."));
        }
        recommendations.add(new Recommendation(
                "COST_DATA_LIMIT",
                "Performance analysis is not a savings estimate",
                "INFO",
                "This analysis uses resource metrics and does not calculate verified cost savings.",
                "Use comparable billing records and validate workload requirements before making cost or resizing decisions."));
        recommendations.add(new Recommendation(
                "DATA_QUALITY",
                "Review measurement coverage",
                "INFO",
                "Valid measurements: CPU " + cpuCount + "/" + metrics.size()
                        + ", memory percentage " + memoryPercentCount + "/" + metrics.size()
                        + ", memory GiB " + memoryGiBCount + "/" + metrics.size()
                        + ", network " + networkCount + "/" + metrics.size()
                        + ", requests " + requestCount + "/" + metrics.size()
                        + ", latency " + latencyCount + "/" + metrics.size()
                        + ", error rate " + errorRateCount + "/" + metrics.size() + ".",
                "Check missing values, measurement units and collection intervals before relying on recommendations."));
        DecisionResult decision = decisionEngine.evaluate(
                peakCpu,
                peakMemoryPercent,
                averageLatency,
                averageErrorRate,
                metrics.size());
        return new ResourceAnalysis(
                resourceId,
                metrics.size(),
                cpuCount,
                memoryGiBCount,
                round(averageCpu),
                round(peakCpu),
                round(averageMemoryGiB),
                round(peakMemoryGiB),
                recommendations,
                round(averageMemoryPercent),
                round(peakMemoryPercent),
                memoryPercentCount,
                round(averageNetwork),
                round(peakNetwork),
                networkCount,
                round(averageRequests),
                round(peakRequests),
                requestCount,
                round(averageLatency),
                round(peakLatency),
                latencyCount,
                round(averageErrorRate),
                round(peakErrorRate),
                errorRateCount,
                decision);
    }
    private void addDataFreshnessRecommendation(List<Recommendation> recommendations, LocalDateTime latestTimestamp, int totalRecords) {
        if (totalRecords < MINIMUM_HISTORY_RECORDS) {
            recommendations.add(new Recommendation(
                    "INSUFFICIENT_HISTORY",
                    "Limited metric history",
                    "MEDIUM",
                    "Only " + totalRecords + " records are available. The initial minimum-history threshold is " + MINIMUM_HISTORY_RECORDS + " records.",
                    "Collect more measurements before making strong capacity or trend-based decisions."));
        }
        if (latestTimestamp == null) {
            recommendations.add(new Recommendation(
                    "TIMESTAMP_DATA_GAP",
                    "Metric timestamps unavailable",
                    "HIGH",
                    "None of the available records has a valid recorded-at timestamp.",
                    "Correct timestamp collection before assessing data freshness or temporal trends."));
            return;
        }
        LocalDateTime now = LocalDateTime.now();
        long ageHours = Duration.between(latestTimestamp, now).toHours();
        if (latestTimestamp.isAfter(now)) {
            recommendations.add(new Recommendation(
                    "FUTURE_TIMESTAMP",
                    "Metric timestamp is in the future",
                    "MEDIUM",
                    "The newest recorded timestamp is later than the application server's current time.",
                    "Check clock synchronization, time zones and timestamp ingestion."));
        } else if (ageHours > STALE_DATA_HOURS) {
            recommendations.add(new Recommendation(
                    "STALE_METRIC_DATA",
                    "Metric data may be stale",
                    "HIGH",
                    "The newest metric is approximately " + ageHours + " hours old. The initial stale-data threshold is " + STALE_DATA_HOURS + " hours.",
                    "Refresh the metrics before treating this analysis as a description of current AWS resource conditions."));
        } else {
            recommendations.add(new Recommendation(
                    "METRIC_DATA_FRESHNESS",
                    "Metric data is within the freshness threshold",
                    "INFO",
                    "The newest timestamp is within the configured " + STALE_DATA_HOURS + "-hour threshold.",
                    "Continue collecting metrics and verify that ingestion is operating as expected."));
        }
    }
    private void addCpuRecommendation(List<Recommendation> recommendations, Double averageCpu, Double peakCpu, int count) {
        if (count == 0) {
            recommendations.add(new Recommendation(
                    "CPU_DATA_GAP",
                    "CPU data unavailable",
                    "INFO",
                    "No valid CPU percentage measurements are available.",
                    "Collect valid CPU measurements before assessing processor capacity."));
        } else if (averageCpu < CPU_LOW_THRESHOLD) {
            recommendations.add(new Recommendation(
                    "CPU_REVIEW",
                    "Review possible CPU over-provisioning",
                    "MEDIUM",
                    "Average CPU usage is " + round(averageCpu) + "% and peak usage is " + round(peakCpu) + "%.",
                    "Review workload demand and peak periods before considering a smaller instance."));
        } else if (averageCpu > CPU_HIGH_THRESHOLD) {
            recommendations.add(new Recommendation(
                    "CPU_PRESSURE",
                    "Investigate high CPU usage",
                    "HIGH",
                    "Average CPU usage is " + round(averageCpu) + "% and peak usage is " + round(peakCpu) + "%.",
                    "Check workload behaviour and latency before considering scaling."));
        } else {
            recommendations.add(new Recommendation(
                    "CPU_NORMAL",
                    "CPU usage is within the review range",
                    "INFO",
                    "Average CPU usage is " + round(averageCpu) + "% and peak usage is " + round(peakCpu) + "%.",
                    "Continue monitoring CPU alongside latency, traffic and error rates."));
        }
    }
    private void addMemoryRecommendation(List<Recommendation> recommendations, Double averagePercent, Double peakPercent, int percentCount, Double averageGiB, Double peakGiB, int giBCount) {
        if (percentCount > 0) {
            String severity = averagePercent >= MEMORY_HIGH_THRESHOLD ? "HIGH" : "INFO";
            String title = averagePercent >= MEMORY_HIGH_THRESHOLD ? "Investigate high memory utilization" : "Review memory utilization";
            recommendations.add(new Recommendation(
                    "MEMORY_PERCENT_REVIEW",
                    title,
                    severity,
                    "Average memory utilization is " + round(averagePercent) + "% and peak utilization is " + round(peakPercent) + "%.",
                    "Check sustained memory pressure and available capacity before resizing."));
        } else {
            recommendations.add(new Recommendation(
                    "MEMORY_PERCENT_DATA_GAP",
                    "Memory utilization percentage unavailable",
                    "INFO",
                    "No valid memory percentage measurements are available.",
                    "Collect memory utilization percentages to assess memory pressure."));
        }
        if (giBCount > 0) {
            recommendations.add(new Recommendation(
                    "MEMORY_GIB_REVIEW",
                    "Review memory used",
                    "INFO",
                    "Average memory used is " + round(averageGiB) + " GiB and peak memory used is " + round(peakGiB) + " GiB.",
                    "Compare memory used against the resource's total memory capacity."));
        } else {
            recommendations.add(new Recommendation(
                    "MEMORY_GIB_DATA_GAP",
                    "Memory used in GiB unavailable",
                    "INFO",
                    "No valid memory-used measurements are available in GiB.",
                    "Collect memory-used values and total memory capacity if absolute memory analysis is required."));
        }
    }
    private void addNetworkRecommendation(List<Recommendation> recommendations, Double averageNetwork, Double peakNetwork, int count) {
        if (count == 0) {
            recommendations.add(new Recommendation(
                    "NETWORK_DATA_GAP",
                    "Network data unavailable",
                    "INFO",
                    "No valid network utilization measurements are available.",
                    "Collect network metrics with documented units before evaluating network pressure."));
        } else {
            recommendations.add(new Recommendation(
                    "NETWORK_REVIEW",
                    "Review network utilization",
                    "INFO",
                    "Average recorded network utilization is " + round(averageNetwork) + " and the peak is " + round(peakNetwork) + ".",
                    "Confirm the measurement unit and compare network changes with traffic and latency."));
        }
    }
    private void addLatencyRecommendation(List<Recommendation> recommendations, Double averageLatency, Double peakLatency, int count) {
        if (count == 0) {
            recommendations.add(new Recommendation(
                    "LATENCY_DATA_GAP",
                    "Latency data unavailable",
                    "INFO",
                    "No valid latency measurements are available.",
                    "Collect response latency measurements with a documented unit."));
        } else if (averageLatency >= LATENCY_REVIEW_THRESHOLD_MS) {
            recommendations.add(new Recommendation(
                    "LATENCY_PRESSURE",
                    "Investigate elevated latency",
                    "HIGH",
                    "Average latency is " + round(averageLatency) + " ms and peak latency is " + round(peakLatency) + " ms.",
                    "Investigate application response time, dependencies and resource pressure."));
        } else {
            recommendations.add(new Recommendation(
                    "LATENCY_REVIEW",
                    "Monitor response latency",
                    "INFO",
                    "Average latency is " + round(averageLatency) + " ms and peak latency is " + round(peakLatency) + " ms.",
                    "Compare latency with the application's service-level objective and traffic pattern."));
        }
    }
    private void addErrorRateRecommendation(List<Recommendation> recommendations, Double averageErrorRate, Double peakErrorRate, int count) {
        if (count == 0) {
            recommendations.add(new Recommendation(
                    "ERROR_RATE_DATA_GAP",
                    "Error-rate data unavailable",
                    "INFO",
                    "No valid error-rate measurements are available.",
                    "Collect error-rate data and document whether values are percentages."));
        } else if (averageErrorRate >= ERROR_RATE_REVIEW_THRESHOLD) {
            recommendations.add(new Recommendation(
                    "ERROR_RATE_PRESSURE",
                    "Investigate elevated error rate",
                    "HIGH",
                    "Average error rate is " + round(averageErrorRate) + "% and peak error rate is " + round(peakErrorRate) + "%.",
                    "Inspect application errors and correlate them with latency, traffic and resource pressure."));
        } else {
            recommendations.add(new Recommendation(
                    "ERROR_RATE_REVIEW",
                    "Monitor error rate",
                    "INFO",
                    "Average error rate is " + round(averageErrorRate) + "% and peak error rate is " + round(peakErrorRate) + "%.",
                    "Compare error rates with the application's reliability targets."));
        }
    }
    private boolean isValidPercentage(Double value) {
        return value != null && Double.isFinite(value) && value >= 0.0 && value <= 100.0;
    }
    private boolean isValidNonNegative(Double value) {
        return value != null && Double.isFinite(value) && value >= 0.0;
    }
    private Double average(double total, int count) {
        return count == 0 ? null : total / count;
    }
    private Double max(Double current, double value) {
        return current == null ? value : Math.max(current, value);
    }
    private Double round(Double value) {
        return value == null ? null : round(value.doubleValue());
    }
    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
    public record Recommendation(
            String code,
            String title,
            String severity,
            String reason,
            String suggestedAction) {
    }
    public record ResourceAnalysis(
            Long resourceId,
            int totalRecords,
            int cpuRecords,
            int memoryRecords,
            Double averageCpuPercent,
            Double peakCpuPercent,
            Double averageMemoryGiB,
            Double peakMemoryGiB,
            List<Recommendation> recommendations,
            Double averageMemoryPercent,
            Double peakMemoryPercent,
            int memoryPercentRecords,
            Double averageNetworkUtilization,
            Double peakNetworkUtilization,
            int networkRecords,
            Double averageRequestCount,
            Double peakRequestCount,
            int requestRecords,
            Double averageLatencyMs,
            Double peakLatencyMs,
            int latencyRecords,
            Double averageErrorRatePercent,
            Double peakErrorRatePercent,
            int errorRateRecords,
            DecisionResult decision) {
    }
}