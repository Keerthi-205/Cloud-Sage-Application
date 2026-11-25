import MetricCard from "../components/MetricCard";
import CpuTrendChart from "../components/CpuTrendChart";

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

function cpuValue(metric) {
  return firstValue(metric, [
    "cpuUtilization",
    "cpuUsage",
    "cpu",
    "cpuPercent",
  ]);
}

function memoryDisplay(metric) {
  if (!metric) return "—";

  const memoryGiB = firstValue(metric, ["memoryUsedGiB"]);

  if (
    memoryGiB !== null &&
    memoryGiB !== undefined &&
    Number.isFinite(Number(memoryGiB))
  ) {
    return `${number(memoryGiB)} GiB`;
  }

  const memoryPercent = firstValue(metric, [
    "memoryUtilization",
    "memoryUsage",
    "memory",
    "memoryPercent",
  ]);

  if (
    memoryPercent !== null &&
    memoryPercent !== undefined &&
    Number.isFinite(Number(memoryPercent))
  ) {
    return `${number(memoryPercent)}%`;
  }

  return "—";
}

function Resources({
  pageInfo,
  resources,
  filteredResources,
  search,
  setSearch,
  setSelectedResource,
  selectedResourceObject,
  selectedMetrics,
  selectedLatestMetric,
}) {
  return (
    <>
      <div className="intro">
        <span className="eyebrow">RESOURCE INVENTORY</span>
        <h2>{pageInfo.subtitle}</h2>
        <p>{pageInfo.description}</p>
      </div>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h3>Recorded resources</h3>
            <p>
              {resources.length} resources returned by the backend
            </p>
          </div>

          <input
            className="search-input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search resources..."
            aria-label="Search resources"
          />
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Resource</th>
                <th>Type</th>
                <th>Provider / Region</th>
                <th>Status</th>
                <th>CPU</th>
                <th>Memory</th>
                <th>Details</th>
              </tr>
            </thead>

            <tbody>
              {filteredResources.map(
                ({ resource, metric, cpu }) => (
                  <tr
                    key={
                      resourceId(resource) ?? resourceName(resource)
                    }
                  >
                    <td>
                      <b>{resourceName(resource)}</b>
                    </td>

                    <td>{resourceType(resource)}</td>

                    <td>
                      {firstValue(
                        resource,
                        ["provider", "cloudProvider", "cloud"],
                        "—"
                      )}

                      <small>
                        {firstValue(
                          resource,
                          ["region", "regionName"],
                          "Region unavailable"
                        )}
                      </small>
                    </td>

                    <td>
                      <span className="badge">
                        {resourceStatus(resource)}
                      </span>
                    </td>

                    <td>
                      {Number.isFinite(cpu)
                        ? `${number(cpu)}%`
                        : "—"}
                    </td>

                    <td>{memoryDisplay(metric)}</td>

                    <td>
                      <button
                        className="text-button"
                        onClick={() =>
                          setSelectedResource(
                            String(resourceId(resource))
                          )
                        }
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                )
              )}

              {!filteredResources.length && (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      No matching resources.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedResourceObject && (
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>
                {resourceName(selectedResourceObject)} — metric history
              </h3>
              <p>Recorded metric rows returned by the backend</p>
            </div>

            <button
              className="button secondary"
              onClick={() => setSelectedResource("")}
            >
              Close
            </button>
          </div>

          {selectedLatestMetric && (
            <div className="metrics-grid three">
              <MetricCard
                icon="◉"
                label="Latest CPU"
                value={
                  Number.isFinite(
                    Number(cpuValue(selectedLatestMetric))
                  )
                    ? `${number(cpuValue(selectedLatestMetric))}%`
                    : "—"
                }
                detail="Recorded reading"
              />

              <MetricCard
                icon="▥"
                label="Latest memory"
                value={memoryDisplay(selectedLatestMetric)}
                detail="Recorded reading"
              />

              <MetricCard
                icon="◷"
                label="Metric records"
                value={selectedMetrics.length}
                detail="Returned by backend"
              />
            </div>
          )}

          <div className="panel">
            <div className="panel-heading">
              <div>
                <h3>CPU performance trend</h3>
                <p>
                  {resourceName(selectedResourceObject)} · Historical
                  readings
                </p>
              </div>
            </div>

            <CpuTrendChart metrics={selectedMetrics} />
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Recorded at</th>
                  <th>CPU</th>
                  <th>Memory</th>
                  <th>Latency</th>
                  <th>Requests</th>
                </tr>
              </thead>

              <tbody>
                {selectedMetrics.map((metric, index) => (
                  <tr key={firstValue(metric, ["id"], index)}>
                    <td>
                      {String(
                        firstValue(
                          metric,
                          ["recordedAt", "timestamp", "createdAt"],
                          "—"
                        )
                      )}
                    </td>

                    <td>
                      {cpuValue(metric) == null
                        ? "—"
                        : `${number(cpuValue(metric))}%`}
                    </td>

                    <td>{memoryDisplay(metric)}</td>

                    <td>
                      {firstValue(
                        metric,
                        ["latencyMs", "latency", "responseTime"],
                        "—"
                      )}
                    </td>

                    <td>
                      {firstValue(
                        metric,
                        ["requestCount", "requests", "requestRate"],
                        "—"
                      )}
                    </td>
                  </tr>
                ))}

                {!selectedMetrics.length && (
                  <tr>
                    <td colSpan="5">
                      <div className="empty-state">
                        No metrics available for this resource.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}

export default Resources;