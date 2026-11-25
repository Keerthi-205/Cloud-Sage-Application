function Outcomes({
  pageInfo,
  resources = [],
  costs = [],
  cpuSummaries = [],
}) {
  const safeResources = Array.isArray(resources) ? resources : [];
  const safeCosts = Array.isArray(costs) ? costs : [];
  const safeCpuSummaries = Array.isArray(cpuSummaries)
    ? cpuSummaries
    : [];

  const averageCpu = safeCpuSummaries.length
    ? safeCpuSummaries.reduce(
        (sum, item) => sum + item.cpu,
        0
      ) / safeCpuSummaries.length
    : null;

  const checklist = [
    {
      title: "Backend connectivity",
      description: "Spring Boot API provides application data.",
      complete: true,
    },
    {
      title: "Resource inventory",
      description: "Resource records are available for analysis.",
      complete: safeResources.length > 0,
    },
    {
      title: "Cost data integration",
      description: "Cost records are available from the backend.",
      complete: safeCosts.length > 0,
    },
    {
      title: "Resource metric analysis",
      description: "CPU metric summaries are available.",
      complete: safeCpuSummaries.length > 0,
    },
    {
      title: "Decision recommendations",
      description:
        "Backend analysis provides recommendations for review.",
      complete: false,
    },
    {
      title: "Verified cloud savings",
      description:
        "Measured savings confirmed against actual billing data.",
      complete: false,
    },
  ];

  const completedCount = checklist.filter(
    (item) => item.complete
  ).length;

  const completionPercentage =
    (completedCount / checklist.length) * 100;

  return (
    <section className="page-section">
      {/* Page introduction */}

      <div className="intro">
        <div>
          <span className="eyebrow">
            PROJECT EVALUATION
          </span>

          <h2>
            {pageInfo?.title || "Outcomes & Evaluation"}
          </h2>

          <p>
            {pageInfo?.description ||
              "Review the current implementation status and available evaluation indicators."}
          </p>
        </div>
      </div>

      {/* Evaluation summary */}

      <div className="metrics-grid three">
        <article className="metric-card">
          <div className="metric-icon">◈</div>

          <div className="metric-copy">
            <small>Resources Analyzed</small>

            <strong>
              {safeResources.length}
            </strong>

            <p>
              Resource records currently available
            </p>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-icon">$</div>

          <div className="metric-copy">
            <small>Cost Records</small>

            <strong>
              {safeCosts.length}
            </strong>

            <p>
              Backend cost entries available
            </p>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-icon">%</div>

          <div className="metric-copy">
            <small>Average CPU Utilization</small>

            <strong>
              {averageCpu !== null
                ? `${averageCpu.toFixed(1)}%`
                : "—"}
            </strong>

            <p>
              {averageCpu !== null
                ? "Across resources with available CPU metrics"
                : "CPU metrics unavailable"}
            </p>
          </div>
        </article>
      </div>

      {/* Implementation status */}

      <article className="panel evaluation-panel">
        <div className="panel-heading evaluation-heading">
          <div>
            <span className="eyebrow">
              IMPLEMENTATION STATUS
            </span>

            <h3>
              Project Evaluation Checklist
            </h3>

            <p>
              A snapshot of the capabilities currently
              represented by the available application data.
            </p>
          </div>

          <div className="evaluation-score">
            <strong>
              {completedCount}/{checklist.length}
            </strong>

            <span>
              completed
            </span>
          </div>
        </div>

        {/* Completion progress */}

        <div className="evaluation-progress">
          <div className="evaluation-progress-header">
            <span>
              Implementation coverage
            </span>

            <strong>
              {completionPercentage.toFixed(0)}%
            </strong>
          </div>

          <div
            className="evaluation-progress-track"
            role="progressbar"
            aria-valuenow={Math.round(
              completionPercentage
            )}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label="Implementation checklist completion"
          >
            <div
              className="evaluation-progress-fill"
              style={{
                width: `${completionPercentage}%`,
              }}
            />
          </div>
        </div>

        {/* Checklist */}

        <div className="evaluation-list">
          {checklist.map((item, index) => (
            <div
              className={`evaluation-item ${
                item.complete
                  ? "is-complete"
                  : "is-pending"
              }`}
              key={item.title}
            >
              <div className="evaluation-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div
                className={`evaluation-status ${
                  item.complete
                    ? "complete"
                    : "pending"
                }`}
                aria-label={
                  item.complete
                    ? "Complete"
                    : "Pending"
                }
              >
                {item.complete ? "✓" : "○"}
              </div>

              <div className="evaluation-content">
                <div className="evaluation-title-row">
                  <strong>
                    {item.title}
                  </strong>

                  <span
                    className={`evaluation-badge ${
                      item.complete
                        ? "available"
                        : "not-verified"
                    }`}
                  >
                    {item.complete
                      ? "Available"
                      : "Not verified"}
                  </span>
                </div>

                <p>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </article>

      {/* Current data coverage */}

      <article className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">
              DATA COVERAGE
            </span>

            <h3>
              Available Evaluation Inputs
            </h3>
          </div>
        </div>

        <div className="cost-insight-list">
          <div className="cost-insight">
            <span className="insight-label">
              Resource records
            </span>

            <strong>
              {safeResources.length}
            </strong>

            <small>
              Returned by the backend API
            </small>
          </div>

          <div className="cost-insight">
            <span className="insight-label">
              Cost records
            </span>

            <strong>
              {safeCosts.length}
            </strong>

            <small>
              Returned by the backend API
            </small>
          </div>

          <div className="cost-insight">
            <span className="insight-label">
              CPU metric summaries
            </span>

            <strong>
              {safeCpuSummaries.length}
            </strong>

            <small>
              Resources with available CPU values
            </small>
          </div>
        </div>
      </article>

      {/* Evaluation limitations */}

      <div className="note">
        <strong>
          Evaluation limitations
        </strong>

        <p>
          The current evaluation uses the records available
          in the CloudSage backend. Historical or sample data
          does not establish live cloud monitoring. A verified
          savings claim requires a measured comparison against
          actual billing and performance data over a defined
          period.
        </p>
      </div>
    </section>
  );
}

export default Outcomes;