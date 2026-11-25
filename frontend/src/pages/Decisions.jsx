import React from "react";
const decisionLabel = decision => {
    if (decision === "REVIEW_RESOURCE") return "Review required";
    if (decision === "NO_ACTION") return "No immediate action";
    if (decision === "DO_NOT_RECOMMEND") return "Insufficient evidence";
    return decision || "Decision unavailable";
};
const statusClass = severity => {
    if (severity === "WARNING") return "warning";
    if (severity === "HIGH") return "danger";
    return "info";
};
const formatValue = (value, unit) => {
    if (value === null || value === undefined || value === "") return "N/A";
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return `${value}${unit ? ` ${unit}` : ""}`;
    return `${numeric % 1 === 0 ? numeric : numeric.toFixed(2)}${unit ? ` ${unit}` : ""}`;
};
const reviewValue = (reviews, resourceId) => reviews?.[resourceId] || "Pending";
export default function Decisions({
    resources = [],
    analysisByResource = {},
    reviews = {},
    setReviews,
    refreshData,
    loading,
    goTo,
    setSelectedResource
}) {
    const decisions = resources.map(resource => {
        const analysis = analysisByResource[resource.id];
        return {
            resource,
            analysis,
            decision: analysis?.decision
        };
    });
    const reviewRequired = decisions.filter(item => item.decision?.decision === "REVIEW_RESOURCE").length;
    const noAction = decisions.filter(item => item.decision?.decision === "NO_ACTION").length;
    const insufficient = decisions.filter(item => item.decision?.decision === "DO_NOT_RECOMMEND").length;
    const updateReview = (resourceId, value) => {
        if (setReviews) {
            setReviews(previous => ({
                ...previous,
                [resourceId]: value
            }));
        }
    };
    const viewResource = resourceId => {
        if (setSelectedResource) setSelectedResource(resourceId);
        if (goTo) goTo("resources");
    };
    return (
        <main className="decision-center-page">
            <header className="decision-center-header">
                <div>
                    <p className="decision-center-eyebrow">Decision Intelligence</p>
                    <h1 className="decision-center-title">AI Decision Center</h1>
                    <p className="decision-center-description">
                        Review resource-level decisions generated from CloudSage analysis and supporting evidence.
                    </p>
                </div>
                <div className="decision-center-refresh">
                    <button type="button" onClick={refreshData} disabled={loading}>
                        {loading ? "Refreshing..." : "Refresh analysis"}
                    </button>
                </div>
            </header>
            <section className="decision-center-summary">
                <div className="decision-center-summary-card">
                    <p className="decision-center-summary-label">Resources Requiring Review</p>
                    <p className="decision-center-summary-value">{reviewRequired}</p>
                    <p className="decision-center-summary-detail">Backend decisions requiring human attention</p>
                </div>
                <div className="decision-center-summary-card">
                    <p className="decision-center-summary-label">No Immediate Action</p>
                    <p className="decision-center-summary-value">{noAction}</p>
                    <p className="decision-center-summary-detail">Current evidence does not indicate action</p>
                </div>
                <div className="decision-center-summary-card">
                    <p className="decision-center-summary-label">Insufficient Evidence</p>
                    <p className="decision-center-summary-value">{insufficient}</p>
                    <p className="decision-center-summary-detail">Additional observations may be required</p>
                </div>
            </section>
            <section className="decision-center-workflow">
                <h2 className="decision-center-section-title">Decision workflow</h2>
                <p className="decision-center-section-description">
                    CloudSage separates data collection, analysis, decision logic, and human review.
                </p>
                <div className="decision-center-workflow-row">
                    <div className="decision-center-workflow-step">
                        <span className="decision-center-workflow-number">01</span>
                        <span className="decision-center-workflow-label">Data Collection</span>
                        <span className="decision-center-workflow-detail">Resource telemetry and observations</span>
                    </div>
                    <span className="decision-center-workflow-arrow">→</span>
                    <div className="decision-center-workflow-step">
                        <span className="decision-center-workflow-number">02</span>
                        <span className="decision-center-workflow-label">Analysis</span>
                        <span className="decision-center-workflow-detail">Performance and reliability signals</span>
                    </div>
                    <span className="decision-center-workflow-arrow">→</span>
                    <div className="decision-center-workflow-step">
                        <span className="decision-center-workflow-number">03</span>
                        <span className="decision-center-workflow-label">Decision</span>
                        <span className="decision-center-workflow-detail">Deterministic evidence-based screening</span>
                    </div>
                    <span className="decision-center-workflow-arrow">→</span>
                    <div className="decision-center-workflow-step">
                        <span className="decision-center-workflow-number">04</span>
                        <span className="decision-center-workflow-label">Human Review</span>
                        <span className="decision-center-workflow-detail">Approve, reject, or request evidence</span>
                    </div>
                </div>
            </section>
            <section>
                <h2 className="decision-center-section-title">Resource Decisions</h2>
                <p className="decision-center-section-description">
                    Each resource is evaluated independently using the available analysis evidence.
                </p>
                <div className="decision-center-decisions">
                    {decisions.length === 0 ? (
                        <div className="decision-center-empty">
                            <h3 className="decision-center-empty-title">No resource decisions available</h3>
                            <p className="decision-center-empty-text">
                                Resource analysis results are not currently available.
                            </p>
                        </div>
                    ) : (
                        decisions.map(({ resource, analysis, decision }) => {
                            const evidence = decision?.evidence || [];
                            return (
                                <article className="decision-center-card" key={resource.id}>
                                    <div className="decision-center-card-header">
                                        <div className="decision-center-resource">
                                            <h3 className="decision-center-resource-name">{resource.resourceName}</h3>
                                            <div className="decision-center-resource-meta">
                                                <span>{resource.resourceType}</span>
                                                <span>{resource.provider}</span>
                                                <span>{resource.region}</span>
                                                <span>{resource.status}</span>
                                            </div>
                                        </div>
                                        <span className={`decision-center-status ${statusClass(decision?.severity)}`}>
                                            {decisionLabel(decision?.decision)}
                                        </span>
                                    </div>
                                    <div className="decision-center-card-body">
                                        {!decision ? (
                                            <div className="decision-center-empty">
                                                <h3 className="decision-center-empty-title">Analysis unavailable</h3>
                                                <p className="decision-center-empty-text">
                                                    A decision has not been generated for this resource.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="decision-center-decision-row">
                                                <div>
                                                    <p className="decision-center-recommendation-label">Recommendation</p>
                                                    <p className="decision-center-recommendation">{decision.recommendation}</p>
                                                    <p className="decision-center-reason">{decision.reason}</p>
                                                    <span className="decision-center-confidence">
                                                        Evidence confidence: {decision.confidence || "Unavailable"}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="decision-center-evidence-label">Supporting Evidence</p>
                                                    {evidence.length === 0 ? (
                                                        <div className="decision-center-empty">
                                                            <p className="decision-center-empty-text">Evidence unavailable.</p>
                                                        </div>
                                                    ) : (
                                                        <div className="decision-center-evidence">
                                                            {evidence.map((item, index) => (
                                                                <div className="decision-center-evidence-item" key={`${resource.id}-${item.metric}-${index}`}>
                                                                    <span className="decision-center-evidence-metric">{item.metric}</span>
                                                                    <span className="decision-center-evidence-value">
                                                                        {formatValue(item.value, item.unit)}
                                                                    </span>
                                                                    <span className="decision-center-evidence-interpretation">
                                                                        {item.interpretation}
                                                                    </span>
                                                                    <span className="decision-center-evidence-quality">
                                                                        {item.dataQuality}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="decision-center-card-footer">
                                        <div className="decision-center-review">
                                            <p className="decision-center-review-label">Human Review</p>
                                            <select
                                                value={reviewValue(reviews, resource.id)}
                                                onChange={event => updateReview(resource.id, event.target.value)}
                                            >
                                                <option value="Pending">Pending review</option>
                                                <option value="Approved">Approved</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>
                                        </div>
                                        <button
                                            type="button"
                                            className="decision-center-view"
                                            onClick={() => viewResource(resource.id)}
                                        >
                                            View Resource
                                        </button>
                                    </div>
                                </article>
                            );
                        })
                    )}
                </div>
            </section>
        </main>
    );
}