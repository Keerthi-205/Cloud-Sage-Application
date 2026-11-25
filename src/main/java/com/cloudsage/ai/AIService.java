package com.cloudsage.ai;
import com.cloudsage.analysis.ResourceAnalysisService;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
@Service
public class AIService {
    private final ChatClient chatClient;
    private final ResourceAnalysisService analysisService;
    public AIService(ChatClient.Builder chatClientBuilder, ResourceAnalysisService analysisService) {
        this.chatClient = chatClientBuilder.build();
        this.analysisService = analysisService;
    }
    public AIExplanationResponse explainResource(Long resourceId) {
        ResourceAnalysisService.ResourceAnalysis analysis = analysisService.analyzeResource(resourceId);
        String analysisData = buildAnalysisData(analysis);
        String explanation = chatClient.prompt()
                .system("""
                        You are the AI explanation layer of CloudSage, a cloud resource decision advisor.
                        The supplied analysis is calculated by CloudSage Java services and must be treated as the only source of factual information.
                        Your job is to explain the analysis clearly. Do not perform new calculations.
                        Follow these rules:
                        1. Use only the supplied analysis data.
                        2. Explain important performance, reliability, cost and data quality findings.
                        3. Explain why each important finding matters.
                        4. Explain the decision implications without inventing infrastructure changes.
                        5. Clearly identify missing, limited, stale or insufficient data.
                        6. Never invent measurements, costs, savings, forecasts or resource specifications.
                        7. Never claim verified cost savings unless explicitly provided in the supplied data.
                        8. Never claim machine learning, forecasting or predictive modeling unless explicitly provided in the supplied data.
                        9. Do not recommend resizing based only on low average CPU utilization.
                        10. Do not assume that a metric exists when its value is null or unavailable.
                        11. If evidence is insufficient for a strong decision, state that clearly.
                        12. Keep the explanation professional, concise and understandable.
                        Organize the response using exactly these sections:
                        Resource Overview
                        Important Findings
                        Performance and Reliability Assessment
                        Data Quality Limitations
                        Recommended Next Actions
                        Do not add greetings, disclaimers or unrelated sections.
                        """)
                .user(user -> user.text("""
                        Explain the following CloudSage resource analysis.
                        Resource ID: {resourceId}
                        Analysis:
                        {analysisData}
                        """)
                        .param("resourceId", resourceId)
                        .param("analysisData", analysisData))
                .call()
                .content();
        return new AIExplanationResponse(resourceId, "SUCCESS", explanation);
    }
    private String buildAnalysisData(ResourceAnalysisService.ResourceAnalysis analysis) {
        return """
                Resource ID: %s
                Total Records: %s
                CPU Records: %s
                Average CPU: %s
                Peak CPU: %s
                Memory Percentage Records: %s
                Average Memory Percentage: %s
                Peak Memory Percentage: %s
                Memory GiB Records: %s
                Average Memory GiB: %s
                Peak Memory GiB: %s
                Network Records: %s
                Average Network Utilization: %s
                Peak Network Utilization: %s
                Request Records: %s
                Average Request Count: %s
                Peak Request Count: %s
                Latency Records: %s
                Average Latency: %s
                Peak Latency: %s
                Error Rate Records: %s
                Average Error Rate: %s
                Peak Error Rate: %s
                Recommendations: %s
                """.formatted(
                analysis.resourceId(),
                analysis.totalRecords(),
                analysis.cpuRecords(),
                analysis.averageCpuPercent(),
                analysis.peakCpuPercent(),
                analysis.memoryPercentRecords(),
                analysis.averageMemoryPercent(),
                analysis.peakMemoryPercent(),
                analysis.memoryRecords(),
                analysis.averageMemoryGiB(),
                analysis.peakMemoryGiB(),
                analysis.networkRecords(),
                analysis.averageNetworkUtilization(),
                analysis.peakNetworkUtilization(),
                analysis.requestRecords(),
                analysis.averageRequestCount(),
                analysis.peakRequestCount(),
                analysis.latencyRecords(),
                analysis.averageLatencyMs(),
                analysis.peakLatencyMs(),
                analysis.errorRateRecords(),
                analysis.averageErrorRatePercent(),
                analysis.peakErrorRatePercent(),
                analysis.recommendations()
        );
    }
    public record AIExplanationResponse(
            Long resourceId,
            String status,
            String explanation
    ) {
    }
}
