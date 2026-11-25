import { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Overview from "./pages/Overview";
import Resources from "./pages/Resources";
import Costs from "./pages/Costs";
import Decisions from "./pages/Decisions";
import Simulator from "./pages/Simulator";
import Outcomes from "./pages/Outcomes";
import Settings from "./pages/Settings";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const NAV_ITEMS = [
  { id: "overview", icon: "⌂", label: "Cloud Intelligence Dashboard" },
  { id: "resources", icon: "▤", label: "Resource Intelligence" },
  { id: "costs", icon: "↗", label: "Cost & Efficiency" },
  { id: "decisions", icon: "✦", label: "AI Decision Center", tag: "RULES" },
  { id: "simulator", icon: "⇄", label: "What-If Simulator" },
  { id: "outcomes", icon: "▥", label: "Outcomes & Evaluation" },
  { id: "settings", icon: "⚙", label: "Policies, Data & Settings" },
];

export const PAGE_INFO = {
  overview: {
    title: "Cloud Intelligence Dashboard",
    subtitle: "Your cloud at a glance",
    description:
      "A clear view of recorded resources, costs, and operational signals.",
  },
  resources: {
    title: "Resource Intelligence",
    subtitle: "Understand your resources",
    description:
      "Inspect recorded cloud resources and their latest available metrics.",
  },
  costs: {
    title: "Cost & Efficiency",
    subtitle: "Understand recorded costs",
    description: "Explore cost records returned by your CloudSage backend.",
  },
  decisions: {
    title: "AI Decision Center",
    subtitle: "Review resource signals",
    description:
      "Transparent threshold-based screening. These are not trained ML predictions.",
  },
  simulator: {
    title: "What-If Simulator",
    subtitle: "Explore a hypothetical scenario",
    description:
      "Adjust assumptions to see illustrative cost changes. Results are not live cloud quotes.",
  },
  outcomes: {
    title: "Outcomes & Evaluation",
    subtitle: "Measure before claiming improvement",
    description:
      "Review what must be measured before CloudSage can claim predictive or cost-saving benefits.",
  },
  settings: {
    title: "Policies, Data & Settings",
    subtitle: "Configure review thresholds",
    description:
      "Set local screening preferences and inspect the current integration status.",
  },
};

export function unwrapResponse(response) {
  if (response && response.data !== undefined) return response.data;
  return response;
}

export function money(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "—";
  return parsed.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function number(value, digits = 1) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed.toFixed(digits) : "—";
}

export function firstValue(object, keys, fallback = null) {
  for (const key of keys) {
    if (object?.[key] !== undefined && object?.[key] !== null) {
      return object[key];
    }
  }
  return fallback;
}

export function resourceId(resource) {
  return firstValue(resource, ["id", "resourceId"]);
}

export function resourceName(resource) {
  return firstValue(
    resource,
    ["resourceName", "name", "resourceId", "instanceId"],
    "Unnamed resource"
  );
}

export function cpuValue(metric) {
  return firstValue(metric, [
    "cpuUtilization",
    "cpuUsage",
    "cpu",
    "cpuPercent",
  ]);
}

export function memoryValue(metric) {
  return firstValue(metric, [
    "memoryUsedGiB",
    "memoryUtilization",
    "memoryUsage",
    "memory",
    "memoryPercent",
  ]);
}

export function memoryDisplay(metric) {
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

export function costValue(record) {
  return Number(
    firstValue(record, ["amount", "cost", "monthlyCost", "totalCost"], 0)
  );
}

export function resourceType(resource) {
  return firstValue(
    resource,
    ["resourceType", "type", "serviceType"],
    "Cloud resource"
  );
}

export function resourceStatus(resource) {
  return String(firstValue(resource, ["status", "state"], "Unknown"));
}

export function normalizeBackendDecision(analysis) {
  if (!analysis) {
    return {
      title: "Analysis unavailable",
      reason: "No backend decision is currently available for this resource.",
      level: "Review",
      kind: "review",
      decision: "ANALYSIS_UNAVAILABLE",
      recommendation: "Review available resource evidence",
      confidence: "INSUFFICIENT",
      evidence: [],
    };
  }

  const decision = String(
    firstValue(analysis, ["decision", "decisionStatus"], "ANALYSIS_UNAVAILABLE")
  ).toUpperCase();

  const recommendation = String(
    firstValue(
      analysis,
      ["recommendation", "recommendedAction"],
      "Review available resource evidence"
    )
  );

  const reason = String(
    firstValue(
      analysis,
      ["reason", "decisionReason"],
      "The backend did not provide a decision reason."
    )
  );

  const severity = String(
    firstValue(analysis, ["severity", "riskLevel"], "INFO")
  ).toUpperCase();

  const confidence = String(
    firstValue(
      analysis,
      ["confidence", "dataQuality", "confidenceLevel"],
      "INSUFFICIENT"
    )
  ).toUpperCase();

  let level = "Normal";
  let kind = "healthy";

  if (
    decision === "REVIEW_RESOURCE" ||
    severity === "WARNING" ||
    severity === "HIGH" ||
    severity === "CRITICAL"
  ) {
    level = severity === "CRITICAL" || severity === "HIGH" ? "High" : "Review";
    kind = "attention";
  }

  if (decision === "DO_NOT_RECOMMEND") {
    level = "Review";
    kind = "review";
  }

  if (decision === "NO_ACTION") {
    level = "Normal";
    kind = "healthy";
  }

  return {
    title: recommendation,
    reason,
    level,
    kind,
    decision,
    recommendation,
    confidence,
    evidence: Array.isArray(analysis.evidence) ? analysis.evidence : [],
  };
}

function App() {
  const [page, setPage] = useState("overview");
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("cloudsage-theme") || "light";
  });
  const isDark = theme === "dark";
  const pageInfo = PAGE_INFO[page] || PAGE_INFO.overview;
  const [resources, setResources] = useState([]);
  const [costs, setCosts] = useState([]);
  const [metricsByResource, setMetricsByResource] = useState({});
  const [analysisByResource, setAnalysisByResource] = useState({});
  const [connection, setConnection] = useState("Connecting");
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedResource, setSelectedResource] = useState("");
  const [cpuThreshold, setCpuThreshold] = useState(80);
  const [uptimeTarget, setUptimeTarget] = useState(99.5);
  const [reviews, setReviews] = useState({});
  const [simulatedResources, setSimulatedResources] = useState(3);
  const [currentMonthlyCost, setCurrentMonthlyCost] = useState(265.5);
  const [costChange, setCostChange] = useState(15);

  useEffect(() => {
    try {
      localStorage.setItem("cloudsage-theme", theme);
    } catch {}
  }, [theme]);

  const refreshData = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    try {
      const healthResponse = await fetch(`${API_BASE}/system/health`);

      if (!healthResponse.ok) {
        throw new Error(
          `Backend health endpoint returned ${healthResponse.status}`
        );
      }

      const healthJson = await healthResponse.json();
      const healthData = unwrapResponse(healthJson);
      const healthStatus = String(
        firstValue(healthData, ["status"], "UP")
      ).toUpperCase();

      const [resourceResponse, costResponse] = await Promise.all([
        fetch(`${API_BASE}/resources`),
        fetch(`${API_BASE}/costs`),
      ]);

      if (!resourceResponse.ok) {
        throw new Error(
          `Resources endpoint returned ${resourceResponse.status}`
        );
      }

      if (!costResponse.ok) {
        throw new Error(`Costs endpoint returned ${costResponse.status}`);
      }

      const resourceJson = await resourceResponse.json();
      const costJson = await costResponse.json();
      const resourceData = unwrapResponse(resourceJson);
      const costData = unwrapResponse(costJson);

      const resourceList = Array.isArray(resourceData)
        ? resourceData
        : firstValue(resourceData, ["resources", "content", "items"], []);

      const costList = Array.isArray(costData)
        ? costData
        : firstValue(costData, ["costs", "records", "content", "items"], []);

      if (!Array.isArray(resourceList) || !Array.isArray(costList)) {
        throw new Error("The backend returned an unexpected data format.");
      }

      const metricsEntries = await Promise.all(
        resourceList.map(async (resource) => {
          const id = resourceId(resource);

          if (id === null || id === undefined) {
            return [String(resourceName(resource)), []];
          }

          try {
            const response = await fetch(
              `${API_BASE}/resources/${id}/metrics`
            );

            if (!response.ok) return [String(id), []];

            const json = await response.json();
            const data = unwrapResponse(json);
            const metricList = Array.isArray(data)
              ? data
              : firstValue(
                  data,
                  ["metrics", "readings", "content", "items"],
                  []
                );

            return [
              String(id),
              Array.isArray(metricList) ? metricList : [],
            ];
          } catch {
            return [String(id), []];
          }
        })
      );

      const metricMap = Object.fromEntries(metricsEntries);

      const analysisEntries = await Promise.all(
        resourceList.map(async (resource) => {
          const id = resourceId(resource);

          if (id === null || id === undefined) {
            return [String(resourceName(resource)), null];
          }

          try {
            const response = await fetch(
              `${API_BASE}/analysis/resources/${id}`
            );

            if (!response.ok) return [String(id), null];

            const json = await response.json();
            return [String(id), unwrapResponse(json)];
          } catch {
            return [String(id), null];
          }
        })
      );

      const analysisMap = Object.fromEntries(analysisEntries);

      setResources(resourceList);
      setCosts(costList);
      setMetricsByResource(metricMap);
      setAnalysisByResource(analysisMap);
      setConnection(
        healthStatus === "UP" || healthStatus === "OK"
          ? "Connected"
          : "Partially connected"
      );
      setLastRefreshed(new Date());
      setCurrentMonthlyCost(
        costList.reduce((sum, item) => sum + costValue(item), 0)
      );
      setSimulatedResources(resourceList.length || 1);
    } catch (error) {
      setConnection("Disconnected");
      setLoadError(
        error instanceof Error
          ? error.message
          : "Could not connect to the backend."
      );
      setResources([]);
      setCosts([]);
      setMetricsByResource({});
      setAnalysisByResource({});
      setLastRefreshed(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const resourceMetric = useCallback(
    (resource) => {
      const id = resourceId(resource);
      const list = metricsByResource[String(id)] || [];

      if (!list.length) return null;

      return list.reduce((latest, current) => {
        const latestTime = new Date(
          firstValue(latest, ["recordedAt", "timestamp", "createdAt"], 0)
        ).getTime();

        const currentTime = new Date(
          firstValue(current, ["recordedAt", "timestamp", "createdAt"], 0)
        ).getTime();

        return currentTime >= latestTime ? current : latest;
      });
    },
    [metricsByResource]
  );

  const resourceSummaries = useMemo(
    () =>
      resources.map((resource) => {
        const id = resourceId(resource);
        const metric = resourceMetric(resource);
        const backendAnalysis = analysisByResource[String(id)];

        return {
          resource,
          metric,
          analysis: backendAnalysis,
          cpu: metric ? Number(cpuValue(metric)) : NaN,
          memory: metric ? Number(memoryValue(metric)) : NaN,
          decision: normalizeBackendDecision(backendAnalysis),
        };
      }),
    [resources, resourceMetric, analysisByResource]
  );

  const cpuSummaries = resourceSummaries.filter((item) =>
    Number.isFinite(item.cpu)
  );

  const averageCpu = cpuSummaries.length
    ? cpuSummaries.reduce((sum, item) => sum + item.cpu, 0) /
      cpuSummaries.length
    : null;

  const attentionCount = resourceSummaries.filter(
    (item) => item.decision.kind === "attention"
  ).length;

  const totalCost = costs.reduce((sum, item) => sum + costValue(item), 0);

  const filteredResources = resourceSummaries.filter(({ resource }) => {
    const text = [
      resourceName(resource),
      resourceType(resource),
      resourceStatus(resource),
      firstValue(resource, ["provider", "cloudProvider", "cloud"], ""),
      firstValue(resource, ["region", "regionName"], ""),
    ]
      .join(" ")
      .toLowerCase();

    return text.includes(search.toLowerCase());
  });

  function goTo(nextPage) {
    setPage(nextPage);
    setSearch("");
  }

  function currentMetricRows() {
    if (!selectedResource) return [];

    const resource = resources.find(
      (item) => String(resourceId(item)) === String(selectedResource)
    );

    if (!resource) return [];

    return metricsByResource[String(resourceId(resource))] || [];
  }

  const selectedResourceObject = resources.find(
    (item) => String(resourceId(item)) === String(selectedResource)
  );

  const selectedMetrics = currentMetricRows();

  const selectedLatestMetric = selectedResourceObject
    ? resourceMetric(selectedResourceObject)
    : null;

  const selectedAnalysis = selectedResourceObject
    ? analysisByResource[String(resourceId(selectedResourceObject))]
    : null;

  const simulatedNewCost =
    currentMonthlyCost * (1 + Number(costChange || 0) / 100);

  function exportData() {
    const data = {
      exportedAt: new Date().toISOString(),
      source: "CloudSage backend API",
      resources,
      costs,
      metricsByResource,
      analysisByResource,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "cloudsage-data.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const sharedPageProps = {
    pageInfo,
    resources,
    costs,
    metricsByResource,
    analysisByResource,
    resourceSummaries,
    cpuSummaries,
    averageCpu,
    attentionCount,
    totalCost,
    filteredResources,
    selectedResource,
    setSelectedResource,
    selectedResourceObject,
    selectedMetrics,
    selectedLatestMetric,
    selectedAnalysis,
    resourceMetric,
    search,
    setSearch,
    cpuThreshold,
    setCpuThreshold,
    reviews,
    setReviews,
    currentMonthlyCost,
    setCurrentMonthlyCost,
    costChange,
    setCostChange,
    simulatedNewCost,
    simulatedResources,
    setSimulatedResources,
    uptimeTarget,
    setUptimeTarget,
    refreshData,
    loading,
    exportData,
    loadError,
    connection,
    API_BASE,
    goTo,
  };

  function renderCurrentPage() {
    switch (page) {
      case "resources":
        return <Resources {...sharedPageProps} />;
      case "costs":
        return <Costs {...sharedPageProps} />;
      case "decisions":
        return <Decisions {...sharedPageProps} />;
      case "simulator":
        return <Simulator {...sharedPageProps} />;
      case "outcomes":
        return <Outcomes {...sharedPageProps} />;
      case "settings":
        return <Settings {...sharedPageProps} />;
      default:
        return <Overview {...sharedPageProps} />;
    }
  }

  return (
    <div className={`app ${isDark ? "dark" : "light"}`}>
      <Sidebar
        page={page}
        goTo={goTo}
        connection={connection}
        loading={loading}
        refreshData={refreshData}
        isDark={isDark}
        navItems={NAV_ITEMS}
      />
      <main className="main">
        <Header
          pageInfo={pageInfo}
          connection={connection}
          isDark={isDark}
          setTheme={setTheme}
          refreshData={refreshData}
          loading={loading}
        />
        <div className="content">
          <div className="context-row">
            <span>
              Data source: {loadError ? "Unavailable" : "CloudSage API"}
            </span>
            <span>
              Last refreshed:{" "}
              {lastRefreshed
                ? lastRefreshed.toLocaleTimeString()
                : "Not yet"}
            </span>
          </div>
          {loadError && (
            <div className="alert" role="alert">
              <b>Backend connection issue</b>
              <p>{loadError}</p>
              <button
                className="button secondary"
                onClick={refreshData}
                disabled={loading}
              >
                Retry connection
              </button>
              <small>
                Backend data is unavailable; no fallback values are presented
                as live readings. Check that Spring Boot is running on port
                8080.
              </small>
            </div>
          )}
          {renderCurrentPage()}
          <footer className="footer">
            <span>CloudSage · Smarter Cloud. Lower Costs.</span>
            <span>Decision support · Human review required</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;