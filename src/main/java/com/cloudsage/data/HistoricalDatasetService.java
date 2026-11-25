
package com.cloudsage.data;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cloudsage.resource.CloudResource;
import com.cloudsage.resource.CloudResourceRepository;
import com.cloudsage.resource.ResourceMetric;
import com.cloudsage.resource.ResourceMetricRepository;

@Service
public class HistoricalDatasetService {

    private static final String RESOURCE_NAME = "CODEF-Experiment-3";

    private static final DateTimeFormatter TIMESTAMP_FORMAT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final CloudResourceRepository resourceRepository;
    private final ResourceMetricRepository metricRepository;
    private final String cpuFilePath;
    private final String memoryFilePath;

    public HistoricalDatasetService(
            CloudResourceRepository resourceRepository,
            ResourceMetricRepository metricRepository,
            @Value("${cloudsage.dataset.cpu-file}") String cpuFilePath,
            @Value("${cloudsage.dataset.memory-file}") String memoryFilePath) {

        this.resourceRepository = resourceRepository;
        this.metricRepository = metricRepository;
        this.cpuFilePath = cpuFilePath;
        this.memoryFilePath = memoryFilePath;
    }

    public record HistoricalMeasurement(
            LocalDateTime recordedAt,
            Double cpuUsagePercent,
            Double memoryUsedGiB) {
    }

    @Transactional
    public ImportResult importDataset() throws IOException {

        List<HistoricalMeasurement> measurements =
                readAndValidate(cpuFilePath, memoryFilePath);

        CloudResource resource = resourceRepository
                .findByResourceName(RESOURCE_NAME)
                .orElseGet(() -> createHistoricalResource());

        long existingRecords =
                metricRepository.countByResource_Id(resource.getId());

        if (existingRecords > 0) {
            return new ImportResult(
                    RESOURCE_NAME,
                    0,
                    true,
                    "Historical dataset was already imported. Existing records were preserved.");
        }

        List<ResourceMetric> metrics = new ArrayList<>();

        for (HistoricalMeasurement measurement : measurements) {
            ResourceMetric metric = new ResourceMetric();

            metric.setResource(resource);
            metric.setCpuUtilization(measurement.cpuUsagePercent());
            metric.setMemoryUsedGiB(measurement.memoryUsedGiB());
            metric.setMemoryUtilization(null);
            metric.setNetworkUtilization(null);
            metric.setRequestCount(null);
            metric.setAverageLatency(null);
            metric.setErrorRate(null);
            metric.setRecordedAt(measurement.recordedAt());

            metrics.add(metric);
        }

        metricRepository.saveAll(metrics);

        return new ImportResult(
                RESOURCE_NAME,
                metrics.size(),
                false,
                "Historical CPU and RAM dataset imported successfully.");
    }

    private CloudResource createHistoricalResource() {
        CloudResource resource = new CloudResource();

        resource.setResourceName(RESOURCE_NAME);
        resource.setProvider("CODEF Dataset");
        resource.setRegion("Experiment 3");
        resource.setResourceType("HISTORICAL_DATASET");
        resource.setStatus("IMPORTED");

        return resourceRepository.save(resource);
    }

    private List<HistoricalMeasurement> readAndValidate(
            String cpuPath,
            String memoryPath) throws IOException {

        List<HistoricalMeasurement> measurements = new ArrayList<>();

        try (BufferedReader cpuReader = Files.newBufferedReader(
                    Path.of(cpuPath), StandardCharsets.UTF_8);
             BufferedReader memoryReader = Files.newBufferedReader(
                    Path.of(memoryPath), StandardCharsets.UTF_8)) {

            String cpuHeader = cpuReader.readLine();
            String memoryHeader = memoryReader.readLine();

            if (!"\"Time\",\"Busy User\"".equals(cpuHeader)
                    || !"\"Time\",\"Used\"".equals(memoryHeader)) {
                throw new IOException("Unexpected CPU or RAM CSV headers.");
            }

            int lineNumber = 1;

            while (true) {
                String cpuLine = cpuReader.readLine();
                String memoryLine = memoryReader.readLine();

                if (cpuLine == null && memoryLine == null) {
                    break;
                }

                lineNumber++;

                if (cpuLine == null || memoryLine == null) {
                    throw new IOException(
                            "CPU and RAM files have different record counts.");
                }

                String[] cpu = cpuLine.split(",", -1);
                String[] memory = memoryLine.split(",", -1);

                if (cpu.length != 2 || memory.length != 2) {
                    throw new IOException(
                            "Invalid CSV record at line " + lineNumber);
                }

                LocalDateTime cpuTime = LocalDateTime.parse(
                        cpu[0].trim(), TIMESTAMP_FORMAT);

                LocalDateTime memoryTime = LocalDateTime.parse(
                        memory[0].trim(), TIMESTAMP_FORMAT);

                if (!cpuTime.equals(memoryTime)) {
                    throw new IOException(
                            "Timestamp mismatch at line " + lineNumber);
                }

                double cpuPercent = Double.parseDouble(
                        cpu[1].trim().replace("%", ""));

                String memoryValue = memory[1].trim();

                if (!memoryValue.endsWith("GiB")) {
                    throw new IOException(
                            "Expected memory in GiB at line " + lineNumber);
                }

                double memoryGiB = Double.parseDouble(
                        memoryValue.substring(
                                0, memoryValue.length() - 3).trim());

                if (!Double.isFinite(cpuPercent)
                        || cpuPercent < 0
                        || cpuPercent > 100
                        || !Double.isFinite(memoryGiB)
                        || memoryGiB < 0) {
                    throw new IOException(
                            "Invalid measurement value at line " + lineNumber);
                }

                measurements.add(new HistoricalMeasurement(
                        cpuTime, cpuPercent, memoryGiB));
            }
        }

        if (measurements.isEmpty()) {
            throw new IOException("The dataset contains no measurements.");
        }

        return List.copyOf(measurements);
    }

    public record ImportResult(
            String resourceName,
            int importedRecords,
            boolean alreadyImported,
            String message) {
    }
}
