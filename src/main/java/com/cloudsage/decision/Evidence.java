package com.cloudsage.decision;
public record Evidence(
        String category,
        String metric,
        Double value,
        String unit,
        String interpretation,
        DataQuality dataQuality) {
}