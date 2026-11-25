package com.cloudsage.data;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.cloudsage.cost.CostRecord;
import com.cloudsage.cost.CostRecordRepository;
import com.cloudsage.resource.CloudResource;
import com.cloudsage.resource.CloudResourceRepository;
import com.cloudsage.resource.ResourceMetric;
import com.cloudsage.resource.ResourceMetricRepository;
@Service
public class SampleDataService {
    private final CloudResourceRepository cloudResourceRepository;
    private final ResourceMetricRepository resourceMetricRepository;
    private final CostRecordRepository costRecordRepository;
    public SampleDataService(CloudResourceRepository cloudResourceRepository, ResourceMetricRepository resourceMetricRepository, CostRecordRepository costRecordRepository) {
        this.cloudResourceRepository = cloudResourceRepository;
        this.resourceMetricRepository = resourceMetricRepository;
        this.costRecordRepository = costRecordRepository;
    }
    @Transactional
    public String loadSampleData() {
        costRecordRepository.deleteAll();
        resourceMetricRepository.deleteAll();
        cloudResourceRepository.deleteAll();
        LocalDateTime now = LocalDateTime.now();
        CloudResource webServer = new CloudResource("web-server-01", "EC2", "AWS", "us-east-1", "RUNNING");
        cloudResourceRepository.save(webServer);
        saveMetric(webServer, 62.0, 58.0, 35.0, 6500.0, 145.0, 0.8, now.minusHours(14));
        saveMetric(webServer, 64.0, 59.0, 36.0, 6700.0, 148.0, 0.8, now.minusHours(13));
        saveMetric(webServer, 66.0, 61.0, 38.0, 7000.0, 152.0, 0.9, now.minusHours(12));
        saveMetric(webServer, 68.0, 62.0, 40.0, 7200.0, 157.0, 1.0, now.minusHours(11));
        saveMetric(webServer, 71.0, 64.0, 42.0, 7600.0, 163.0, 1.0, now.minusHours(10));
        saveMetric(webServer, 73.0, 66.0, 44.0, 8000.0, 170.0, 1.1, now.minusHours(9));
        saveMetric(webServer, 76.0, 68.0, 46.0, 8400.0, 178.0, 1.2, now.minusHours(8));
        saveMetric(webServer, 78.0, 70.0, 48.0, 8800.0, 184.0, 1.3, now.minusHours(7));
        saveMetric(webServer, 81.0, 72.0, 50.0, 9200.0, 191.0, 1.5, now.minusHours(6));
        saveMetric(webServer, 82.0, 74.0, 51.0, 9500.0, 198.0, 1.6, now.minusHours(5));
        saveMetric(webServer, 83.0, 75.0, 52.0, 9700.0, 204.0, 1.7, now.minusHours(4));
        saveMetric(webServer, 84.0, 76.0, 53.0, 9900.0, 211.0, 1.8, now.minusHours(3));
        saveMetric(webServer, 85.0, 77.0, 54.0, 10100.0, 216.0, 1.9, now.minusHours(2));
        saveMetric(webServer, 86.0, 78.0, 55.0, 10500.0, 225.0, 2.1, now.minusHours(1));
        saveMetric(webServer, 84.0, 77.0, 53.0, 10200.0, 218.0, 1.9, now);
        saveCost(webServer, 82.50, "USD", "MONTHLY", "COMPUTE", now.minusHours(2));
        CloudResource apiServer = new CloudResource("api-server-01", "EC2", "AWS", "us-east-1", "RUNNING");
        cloudResourceRepository.save(apiServer);
        saveMetric(apiServer, 45.0, 48.0, 28.0, 4200.0, 120.0, 0.5, now.minusHours(14));
        saveMetric(apiServer, 46.0, 49.0, 29.0, 4300.0, 121.0, 0.5, now.minusHours(13));
        saveMetric(apiServer, 47.0, 50.0, 30.0, 4400.0, 122.0, 0.6, now.minusHours(12));
        saveMetric(apiServer, 48.0, 50.0, 30.0, 4500.0, 123.0, 0.6, now.minusHours(11));
        saveMetric(apiServer, 49.0, 51.0, 31.0, 4600.0, 124.0, 0.6, now.minusHours(10));
        saveMetric(apiServer, 50.0, 52.0, 32.0, 4700.0, 125.0, 0.7, now.minusHours(9));
        saveMetric(apiServer, 51.0, 53.0, 32.0, 4900.0, 128.0, 0.7, now.minusHours(8));
        saveMetric(apiServer, 52.0, 54.0, 33.0, 5000.0, 129.0, 0.7, now.minusHours(7));
        saveMetric(apiServer, 53.0, 54.0, 34.0, 5100.0, 131.0, 0.8, now.minusHours(6));
        saveMetric(apiServer, 54.0, 55.0, 34.0, 5200.0, 132.0, 0.8, now.minusHours(5));
        saveMetric(apiServer, 55.0, 56.0, 35.0, 5300.0, 134.0, 0.8, now.minusHours(4));
        saveMetric(apiServer, 55.0, 56.0, 35.0, 5400.0, 135.0, 0.8, now.minusHours(3));
        saveMetric(apiServer, 56.0, 57.0, 36.0, 5500.0, 136.0, 0.9, now.minusHours(2));
        saveMetric(apiServer, 57.0, 58.0, 37.0, 5600.0, 138.0, 0.9, now.minusHours(1));
        saveMetric(apiServer, 55.0, 57.0, 35.0, 5400.0, 135.0, 0.8, now);
        saveCost(apiServer, 64.25, "USD", "MONTHLY", "COMPUTE", now.minusHours(2));
        CloudResource databaseServer = new CloudResource("database-01", "RDS", "AWS", "us-east-1", "RUNNING");
        cloudResourceRepository.save(databaseServer);
        saveMetric(databaseServer, 58.0, 64.0, 42.0, 3800.0, 180.0, 0.7, now.minusHours(14));
        saveMetric(databaseServer, 59.0, 65.0, 43.0, 3900.0, 182.0, 0.7, now.minusHours(13));
        saveMetric(databaseServer, 60.0, 66.0, 43.0, 3950.0, 184.0, 0.7, now.minusHours(12));
        saveMetric(databaseServer, 61.0, 67.0, 44.0, 4000.0, 188.0, 0.8, now.minusHours(11));
        saveMetric(databaseServer, 62.0, 68.0, 45.0, 4100.0, 190.0, 0.8, now.minusHours(10));
        saveMetric(databaseServer, 63.0, 69.0, 45.0, 4200.0, 193.0, 0.8, now.minusHours(9));
        saveMetric(databaseServer, 64.0, 70.0, 46.0, 4300.0, 195.0, 0.9, now.minusHours(8));
        saveMetric(databaseServer, 65.0, 71.0, 47.0, 4400.0, 198.0, 0.9, now.minusHours(7));
        saveMetric(databaseServer, 66.0, 72.0, 48.0, 4500.0, 200.0, 1.0, now.minusHours(6));
        saveMetric(databaseServer, 68.0, 74.0, 49.0, 4600.0, 205.0, 1.1, now.minusHours(5));
        saveMetric(databaseServer, 69.0, 75.0, 50.0, 4700.0, 208.0, 1.1, now.minusHours(4));
        saveMetric(databaseServer, 70.0, 76.0, 50.0, 4800.0, 211.0, 1.2, now.minusHours(3));
        saveMetric(databaseServer, 71.0, 77.0, 51.0, 4900.0, 214.0, 1.3, now.minusHours(2));
        saveMetric(databaseServer, 72.0, 78.0, 52.0, 5000.0, 218.0, 1.4, now.minusHours(1));
        saveMetric(databaseServer, 70.0, 76.0, 50.0, 4800.0, 212.0, 1.2, now);
        saveCost(databaseServer, 118.75, "USD", "MONTHLY", "DATABASE", now.minusHours(2));
        return "Cloud resource telemetry loaded successfully";
    }
    private void saveMetric(CloudResource resource, Double cpu, Double memory, Double network, Double requests, Double latency, Double errorRate, LocalDateTime recordedAt) {
        ResourceMetric metric = new ResourceMetric();
        metric.setResource(resource);
        metric.setCpuUtilization(cpu);
        metric.setMemoryUtilization(memory);
        metric.setNetworkUtilization(network);
        metric.setRequestCount(requests);
        metric.setAverageLatency(latency);
        metric.setErrorRate(errorRate);
        metric.setRecordedAt(recordedAt);
        resourceMetricRepository.save(metric);
    }
    private void saveCost(CloudResource resource, Double amount, String currency, String billingPeriod, String costType, LocalDateTime recordedAt) {
        CostRecord costRecord = new CostRecord();
        costRecord.setResource(resource);
        costRecord.setAmount(amount);
        costRecord.setCurrency(currency);
        costRecord.setBillingPeriod(billingPeriod);
        costRecord.setCostType(costType);
        costRecord.setRecordedAt(recordedAt);
        costRecordRepository.save(costRecord);
    }
}