package com.cloudsage.cost;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/costs")
@CrossOrigin(origins = "http://localhost:5173")
public class CostRecordController {

    private final CostRecordRepository costRecordRepository;

    public CostRecordController(
            CostRecordRepository costRecordRepository) {
        this.costRecordRepository = costRecordRepository;
    }

    @GetMapping
    public List<CostResponse> getAllCosts() {

        return costRecordRepository.findAll()
                .stream()
                .map(cost -> new CostResponse(
                        cost.getId(),
                        cost.getResource().getId(),
                        cost.getResource().getResourceName(),
                        cost.getAmount(),
                        cost.getCurrency(),
                        cost.getBillingPeriod(),
                        cost.getCostType(),
                        cost.getRecordedAt()))
                .toList();
    }

    public record CostResponse(
            Long id,
            Long resourceId,
            String resourceName,
            Double amount,
            String currency,
            String billingPeriod,
            String costType,
            LocalDateTime recordedAt) {
    }
}
