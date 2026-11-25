function Simulator({
  pageInfo,
  currentMonthlyCost,
  setCurrentMonthlyCost,
  costChange,
  setCostChange,
  simulatedResources,
  setSimulatedResources,
  simulatedNewCost,
  totalCost,
  resources = [],
}) {
  const safeResources = Array.isArray(resources) ? resources : [];

  const baselineCost = Number(currentMonthlyCost) || 0;
  const projectedCost = Number(simulatedNewCost) || 0;
  const changeAmount = projectedCost - baselineCost;

  const changePercentage =
    baselineCost > 0
      ? (changeAmount / baselineCost) * 100
      : 0;

  const currency = "USD";

  function money(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(Number(value) || 0);
  }

  function resetSimulator() {
    setCurrentMonthlyCost(265.5);
    setCostChange(15);
    setSimulatedResources(safeResources.length || 3);
  }

  return (
    <section className="page-section">
      <div className="intro">
        <div>
          <span className="eyebrow">WHAT-IF ANALYSIS</span>

          <h2>{pageInfo?.title || "Cost Simulator"}</h2>

          <p>
            {pageInfo?.description ||
              "Explore illustrative cost changes by adjusting your simulation assumptions."}
          </p>
        </div>

        <button
          type="button"
          className="button secondary"
          onClick={resetSimulator}
        >
          Reset simulation
        </button>
      </div>

      <div className="metrics-grid three">
        <article className="metric-card">
          <div className="metric-icon">$</div>

          <div className="metric-copy">
            <small>Baseline Monthly Cost</small>
            <strong>{money(baselineCost)}</strong>
            <p>Current simulation baseline</p>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-icon">↗</div>

          <div className="metric-copy">
            <small>Simulated Monthly Cost</small>
            <strong>{money(projectedCost)}</strong>
            <p>Based on the selected cost change</p>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-icon">◈</div>

          <div className="metric-copy">
            <small>Cost Difference</small>
            <strong>{money(changeAmount)}</strong>

            <p>
              {changeAmount > 0
                ? "Illustrative cost increase"
                : changeAmount < 0
                  ? "Illustrative cost decrease"
                  : "No simulated cost change"}
            </p>
          </div>
        </article>
      </div>

      <div className="two-columns">
        <article className="panel simulator-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">SIMULATION INPUTS</span>
              <h3>Adjust assumptions</h3>
            </div>
          </div>

          <div className="simulator-control">
            <div className="control-heading">
              <label htmlFor="baseline-cost">
                Baseline monthly cost
              </label>

              <strong>{money(baselineCost)}</strong>
            </div>

            <div className="cost-input-wrapper">
              <span className="currency-symbol">$</span>

              <input
                id="baseline-cost"
                type="number"
                min="0"
                step="0.01"
                value={currentMonthlyCost}
                onChange={(event) =>
                  setCurrentMonthlyCost(
                    Math.max(
                      0,
                      Number(event.target.value) || 0
                    )
                  )
                }
              />
            </div>
          </div>

          <div className="simulator-control range-control">
            <div className="control-heading">
              <label htmlFor="cost-change">
                Cost change assumption
              </label>

              <strong>
                {costChange > 0 ? "+" : ""}
                {costChange}%
              </strong>
            </div>

            <div className="range-slider">
              <input
                id="cost-change"
                type="range"
                min="-50"
                max="50"
                step="5"
                value={costChange}
                style={{
                  "--range-progress": `${((costChange + 50) / 100) * 100}%`,
                }}
                onChange={(event) =>
                setCostChange(Number(event.target.value))
              }
            />
            </div>

            <div className="range-labels">
              <span>-50%</span>
              <span>0%</span>
              <span>+50%</span>
            </div>
          </div>

          <div className="simulator-control range-control">
            <div className="control-heading">
              <label htmlFor="resource-count">
                Simulated resource count
              </label>

              <strong>
                {simulatedResources}{" "}
                {simulatedResources === 1
                  ? "resource"
                  : "resources"}
              </strong>
            </div>

            <div className="range-slider">
              <input
                id="resource-count"
                type="range"
                min="1"
                max="20"
                step="1"
                value={simulatedResources}
                onChange={(event) =>
                  setSimulatedResources(
                    Number(event.target.value)
                  )
                }
              />
            </div>

            <div className="range-labels">
              <span>1 resource</span>
              <span>20 resources</span>
            </div>
          </div>
        </article>

        <article className="panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">SIMULATION RESULT</span>
              <h3>Projected cost impact</h3>
            </div>
          </div>

          <div className="simulation-result">
            <span className="insight-label">
              Estimated monthly cost
            </span>

            <strong className="simulation-total">
              {money(projectedCost)}
            </strong>

            <span
              className={`status ${
                changeAmount > 0
                  ? "warning"
                  : changeAmount < 0
                    ? "healthy"
                    : ""
              }`}
            >
              {changePercentage > 0
                ? `+${changePercentage.toFixed(1)}%`
                : `${changePercentage.toFixed(1)}%`}
            </span>
          </div>

          <div className="simulation-comparison">
            <div>
              <span>Baseline</span>
              <strong>{money(baselineCost)}</strong>
            </div>

            <div>
              <span>Projected</span>
              <strong>{money(projectedCost)}</strong>
            </div>
          </div>

          <div className="note">
            <strong>Simulation assumptions</strong>

            <p>
              The projected amount applies the selected
              percentage change to the baseline cost. The
              resource count is an independent scenario input
              and does not currently recalculate the cost.
            </p>
          </div>
        </article>
      </div>

      <article className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">SCENARIO SUMMARY</span>
            <h3>Current simulation assumptions</h3>
          </div>
        </div>

        <div className="cost-insight-list">
          <div className="cost-insight">
            <span className="insight-label">
              Resource count
            </span>

            <strong>{simulatedResources}</strong>

            <small>
              Resources in the illustrative scenario
            </small>
          </div>

          <div className="cost-insight">
            <span className="insight-label">
              Cost adjustment
            </span>

            <strong>
              {costChange > 0 ? "+" : ""}
              {costChange}%
            </strong>

            <small>
              Applied to the baseline monthly cost
            </small>
          </div>

          <div className="cost-insight">
            <span className="insight-label">
              Backend cost records
            </span>

            <strong>{safeResources.length}</strong>

            <small>
              Available resources from the backend
            </small>
          </div>
        </div>
      </article>

      <div className="note">
        <strong>Important</strong>

        <p>
          This is an illustrative what-if simulator, not a
          verified cloud billing forecast. It does not modify
          AWS resources, change infrastructure, or guarantee
          cost savings.
        </p>
      </div>
    </section>
  );
}

export default Simulator;