package com.cloudsage.decision;
import java.util.List;
public record DecisionResult(
        String decision,
        String recommendation,
        String reason,
        String severity,
        DataQuality confidence,
        List<Evidence> evidence) {
}