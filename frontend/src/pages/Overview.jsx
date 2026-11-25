import MetricCard from "../components/MetricCard";
function firstValue(object, keys, fallback = null) {
  for (const key of keys) {
    if (object?.[key] !== undefined && object?.[key] !== null) {
      return object[key];
    }
  }

  return fallback;
}

function number(value, digits = 1) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed.toFixed(digits) : "—";
}

function money(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) return "—";

  return parsed.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function resourceId(resource) {
  return firstValue(resource, ["id", "resourceId"]);
}

function resourceName(resource) {
  return firstValue(
    resource,
    ["resourceName", "name", "resourceId", "instanceId"],
    "Unnamed resource"
  );
}

function resourceType(resource) {
  return firstValue(
    resource,
    ["resourceType", "type", "serviceType"],
    "Cloud resource"
  );
}

function resourceStatus(resource) {
  return String(firstValue(resource, ["status", "state"], "Unknown"));
}
function Overview({
  pageInfo,
  resources,
  costs,
  resourceSummaries,
  averageCpu,
  cpuSummaries,
  attentionCount,
  totalCost,
  cpuThreshold,
  reviews,
  setReviews,
  setSelectedResource,
  goTo,
  loadError,
}) {
  /* Resource list */

  function renderResourceRows(items) {
    if (!items.length) {
      return (
        <div className="empty-state">
          {loadError
            ? "Resource data is unavailable until the backend connection is restored."
            : "No resources match this search or have been returned by the backend."}
        </div>
      );
    }

    return (
      <div className="resource-list">
        {items.map(({ resource, cpu, metric, decision }) => {
          const id = resourceId(resource);

          return (
            <div
              className="resource-row"
              key={id ?? resourceName(resource)}
            >
              <div className="resource-symbol" aria-hidden="true">
                ☁
              </div>

              <div className="grow">
                <b>{resourceName(resource)}</b>

                <small>
                  {firstValue(
                    resource,
                    ["provider", "cloudProvider", "cloud"],
                    "Cloud"
                  )}
                  {" · "}
                  {resourceType(resource)}
                  {" · "}
                  {firstValue(
                    resource,
                    ["region", "regionName"],
                    "Region unavailable"
                  )}
                </small>
              </div>

              <div className="resource-cpu">
                {Number.isFinite(cpu)
                  ? `${number(cpu)}% CPU`
                  : "No CPU reading"}
              </div>

              <span
                className={`badge ${
                  decision.kind === "attention"
                    ? "bad"
                    : decision.kind === "healthy"
                      ? "good"
                      : ""
                }`}
              >
                {decision.level === "Normal"
                  ? "Healthy"
                  : decision.level === "High"
                    ? "Attention"
                    : "Review"}
              </span>

              <button
                className="text-button"
                onClick={() => {
                  setSelectedResource(String(id));
                  goTo("resources");
                }}
              >
                Details →
              </button>

              {!metric && (
                <span className="smalltext">No metrics</span>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  /* Decision preview */

  function renderDecisionRows(items) {
    if (!items.length) {
      return (
        <div className="empty-state">
          No resource decisions to review yet.
        </div>
      );
    }

    return (
      <div className="resource-list">
        {items.map(({ resource, decision }) => {
          const id = resourceId(resource);
          const reviewKey = String(id ?? resourceName(resource));
          const reviewed = Boolean(reviews[reviewKey]);

          return (
            <div
              className="resource-row decision-row"
              key={reviewKey}
            >
              <div
                className="resource-symbol sparkle"
                aria-hidden="true"
              >
                ✦
              </div>

              <div className="grow">
                <b>{decision.title}</b>
                <small>{resourceName(resource)}</small>
                <small>{decision.reason}</small>
              </div>

              <span
                className={`badge ${
                  decision.kind === "attention"
                    ? "bad"
                    : decision.kind === "healthy"
                      ? "good"
                      : ""
                }`}
              >
                {reviewed ? "Reviewed" : decision.level}
              </span>

              <button
                className="button secondary"
                onClick={() =>
                  setReviews((previous) => ({
                    ...previous,
                    [reviewKey]: !previous[reviewKey],
                  }))
                }
              >
                {reviewed ? "Undo review" : "Mark reviewed"}
              </button>
            </div>
          );
        })}
      </div>
    );
  }

  /* Main dashboard */

  return (
    <>
      <div className="intro">
        <span className="eyebrow">CLOUDSAGE WORKSPACE</span>
        <h2>{pageInfo.subtitle}</h2>
        <p>{pageInfo.description}</p>
      </div>

      <div className="metrics-grid">
        <MetricCard
          icon="▤"
          label="Resources"
          value={resources.length}
          detail="Returned by backend"
        />

        <MetricCard
          icon="$"
          label="Recorded cost total"
          value={money(totalCost)}
          detail={`${costs.length} cost records`}
        />

        <MetricCard
          icon="◉"
          label="Latest average CPU"
          value={averageCpu === null ? "—" : `${number(averageCpu)}%`}
          detail={`${cpuSummaries.length} resources with readings`}
        />

        <MetricCard
          icon="!"
          label="Need attention"
          value={attentionCount}
          detail={`Using the ${cpuThreshold}% CPU review threshold`}
        />
      </div>

      <div className="two-columns">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Resource health</h3>
              <p>Latest available reading per resource</p>
            </div>

            <button
              className="text-button"
              onClick={() => goTo("resources")}
            >
              View all →
            </button>
          </div>

          {renderResourceRows(resourceSummaries)}
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Decision preview</h3>
              <p>
                Local threshold screening; backend analysis is shown in the
                Decision Center
              </p>
            </div>

            <button
              className="text-button"
              onClick={() => goTo("decisions")}
            >
              Open decision center →
            </button>
          </div>

          {renderDecisionRows(resourceSummaries)}

          <div className="note blue">
            <b>AI/ML integration status</b>
            <p>
              Forecasting and LLM explanations are not connected yet.
              CloudSage does not claim predictive results from this screening.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

export default Overview;
