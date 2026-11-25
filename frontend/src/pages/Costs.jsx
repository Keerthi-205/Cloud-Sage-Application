import MetricCard from "../components/MetricCard";

function firstValue(object, keys, fallback = null) {
  if (!object) return fallback;

  for (const key of keys) {
    const value = object[key];

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return fallback;
}

function number(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function money(value, currency = "USD") {
  const amount = number(value);

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function costValue(item) {
  return number(
    firstValue(
      item,
      ["amount", "cost", "monthlyCost", "totalCost"],
      0
    )
  );
}

function getResourceName(item, resources) {
  const directName = firstValue(
    item,
    ["resourceName", "resource", "name"],
    null
  );

  if (typeof directName === "string" && directName.trim()) {
    return directName;
  }

  const id = firstValue(
    item,
    ["resourceId", "resource_id"],
    null
  );

  const matchedResource = resources.find(
    (resource) =>
      String(
        firstValue(
          resource,
          ["id", "resourceId", "resource_id"],
          ""
        )
      ) === String(id)
  );

  return (
    firstValue(
      matchedResource,
      ["name", "resourceName", "resource_name"],
      null
    ) ||
    (id !== null ? `Resource ${id}` : "Unassigned resource")
  );
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString();
}

function Costs({
  pageInfo,
  costs = [],
  resources = [],
  totalCost = 0,
}) {
  const safeCosts = Array.isArray(costs) ? costs : [];
  const safeResources = Array.isArray(resources) ? resources : [];

  const currency = firstValue(
    safeCosts[0],
    ["currency"],
    "USD"
  );

  const recordCount = safeCosts.length;

  const groupedCosts = safeCosts.reduce((groups, item) => {
    const name = getResourceName(item, safeResources);

    if (!groups[name]) {
      groups[name] = 0;
    }

    groups[name] += costValue(item);

    return groups;
  }, {});

  const costGroups = Object.entries(groupedCosts)
    .map(([name, amount]) => ({
      name,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount);

  const highestCost = Math.max(
    ...costGroups.map((item) => item.amount),
    0
  );

  const averageCost = recordCount
    ? number(totalCost) / recordCount
    : 0;

  const highestResource = costGroups[0] || null;

  const costShare =
    highestResource && number(totalCost) > 0
      ? (highestResource.amount / number(totalCost)) * 100
      : 0;

  return (
    <section className="page-section">
      <div className="intro">
        <div>
          <span className="eyebrow">FINANCIAL OVERVIEW</span>

          <h2>
            {pageInfo?.title || "Cost Analysis"}
          </h2>

          <p>
            {pageInfo?.description ||
              "Understand cloud spending patterns and resource-level cost distribution."}
          </p>
        </div>
      </div>

      <div className="metrics-grid three">
        <MetricCard
          icon="$"
          label="Total Recorded Cost"
          value={money(totalCost, currency)}
          detail="Based on available backend cost records"
        />

        <MetricCard
          icon="▤"
          label="Cost Records"
          value={recordCount.toLocaleString()}
          detail="Records returned by the backend"
        />

        <MetricCard
          icon="◈"
          label="Average Record Cost"
          value={money(averageCost, currency)}
          detail="Average across available records"
        />
      </div>

      <div className="two-columns">
        <article className="panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">
                RESOURCE BREAKDOWN
              </span>

              <h3>Cost Distribution</h3>
            </div>

            <span className="panel-count">
              {costGroups.length} resources
            </span>
          </div>

          {costGroups.length > 0 ? (
            <div className="cost-breakdown">
              {costGroups.map((item) => {
                const percentage =
                  number(totalCost) > 0
                    ? (item.amount / number(totalCost)) * 100
                    : 0;

                const barWidth =
                  highestCost > 0
                    ? (item.amount / highestCost) * 100
                    : 0;

                return (
                  <div
                    className="bar-row"
                    key={item.name}
                  >
                    <div className="bar-label">
                      <span>{item.name}</span>

                      <strong>
                        {money(item.amount, currency)}
                      </strong>
                    </div>

                    <div
                      className="bar-track"
                      role="progressbar"
                      aria-valuenow={Math.round(percentage)}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-label={`${item.name} cost share`}
                      style={{
                        width: "100%",
                        height: "10px",
                        background:
                          "rgba(37, 99, 235, 0.10)",
                        borderRadius: "999px",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <div
                        className="bar-fill"
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(barWidth, 100)
                          )}%`,
                          height: "100%",
                          minWidth:
                            barWidth > 0 ? "6px" : "0",
                          background:
                            "linear-gradient(90deg, #2563eb 0%, #3b82f6 55%, #60a5fa 100%)",
                          borderRadius: "999px",
                          display: "block",
                          transition:
                            "width 0.45s ease",
                          boxShadow:
                            "0 0 10px rgba(59, 130, 246, 0.28)",
                        }}
                      />
                    </div>

                    <small>
                      {percentage.toFixed(1)}% of total
                    </small>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <h3>
                No cost distribution available
              </h3>

              <p>
                Cost distribution will appear when
                the backend returns cost records.
              </p>
            </div>
          )}
        </article>

        <article className="panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">
                COST INSIGHTS
              </span>

              <h3>Cost Interpretation</h3>
            </div>
          </div>

          <div className="cost-insight-list">
            <div className="cost-insight">
              <span className="insight-label">
                Highest recorded resource cost
              </span>

              <strong>
                {highestResource
                  ? highestResource.name
                  : "Not available"}
              </strong>

              <small>
                {highestResource
                  ? money(
                      highestResource.amount,
                      currency
                    )
                  : "No resource-level cost data"}
              </small>
            </div>

            <div className="cost-insight">
              <span className="insight-label">
                Highest resource cost share
              </span>

              <strong>
                {highestResource
                  ? `${costShare.toFixed(1)}%`
                  : "—"}
              </strong>

              <small>
                Share of the total recorded cost
              </small>
            </div>

            <div className="cost-insight">
              <span className="insight-label">
                Available resources
              </span>

              <strong>
                {safeResources.length}
              </strong>

              <small>
                Resources returned by the backend
              </small>
            </div>
          </div>

          <div className="note">
            <strong>Data interpretation</strong>

            <p>
              These values represent the cost records
              currently available from the CloudSage
              backend. They should not be interpreted as
              verified real-time cloud billing or confirmed
              savings.
            </p>
          </div>
        </article>
      </div>

      <article className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">
              BACKEND RECORDS
            </span>

            <h3>Cost Records</h3>

            <p>
              Cost entries retrieved from the CloudSage
              API.
            </p>
          </div>

          <span className="panel-count">
            {recordCount} records
          </span>
        </div>

        {safeCosts.length > 0 ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Record ID</th>
                  <th>Resource</th>
                  <th>Cost</th>
                  <th>Billing Period</th>
                  <th>Cost Type</th>
                  <th>Recorded At</th>
                </tr>
              </thead>

              <tbody>
                {safeCosts.map((item, index) => {
                  const id = firstValue(
                    item,
                    [
                      "id",
                      "costId",
                      "cost_id",
                    ],
                    index + 1
                  );

                  const period = firstValue(
                    item,
                    [
                      "billingPeriod",
                      "period",
                      "month",
                    ],
                    "—"
                  );

                  const type = firstValue(
                    item,
                    [
                      "costType",
                      "type",
                    ],
                    "—"
                  );

                  const recordedAt =
                    firstValue(
                      item,
                      [
                        "recordedAt",
                        "createdAt",
                        "timestamp",
                      ],
                      null
                    );

                  const itemCurrency =
                    firstValue(
                      item,
                      ["currency"],
                      currency
                    );

                  return (
                    <tr key={id}>
                      <td>{id}</td>

                      <td>
                        {getResourceName(
                          item,
                          safeResources
                        )}
                      </td>

                      <td>
                        <strong>
                          {money(
                            costValue(item),
                            itemCurrency
                          )}
                        </strong>
                      </td>

                      <td>
                        {String(period)}
                      </td>

                      <td>
                        {String(type)}
                      </td>

                      <td>
                        {formatDate(
                          recordedAt
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <h3>No cost records found</h3>

            <p>
              The backend has not returned any cost
              records yet.
            </p>
          </div>
        )}
      </article>
    </section>
  );
}

export default Costs;