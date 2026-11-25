
function firstValue(object, keys, fallback = null) {
  for (const key of keys) {
    if (object?.[key] !== undefined && object?.[key] !== null) {
      return object[key];
    }
  }

  return fallback;
}

function cpuValue(metric) {
  return firstValue(metric, [
    "cpuUtilization",
    "cpuUsage",
    "cpu",
    "cpuPercent",
  ]);
}

function number(value, digits = 1) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed.toFixed(digits) : "—";
}

function CpuTrendChart({ metrics = [] }) {
  const readings = metrics
    .filter((metric) => {
      const cpu = cpuValue(metric);

      return (
        cpu !== null &&
        cpu !== undefined &&
        String(cpu).trim() !== "" &&
        Number.isFinite(Number(cpu)) &&
        Number(cpu) >= 0 &&
        Number(cpu) <= 100
      );
    })
    .sort((a, b) => {
      const timeA = new Date(
        firstValue(a, ["recordedAt", "timestamp", "createdAt"], 0)
      ).getTime();

      const timeB = new Date(
        firstValue(b, ["recordedAt", "timestamp", "createdAt"], 0)
      ).getTime();

      return timeA - timeB;
    });

  if (!readings.length) {
    return (
      <div className="empty-state">
        No CPU history is available for this resource.
      </div>
    );
  }

  const width = 900;
  const height = 300;

  const padding = {
    top: 24,
    right: 24,
    bottom: 42,
    left: 58,
  };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const points = readings.map((metric, index) => {
    const cpu = Number(cpuValue(metric));

    const x =
      padding.left +
      (readings.length === 1
        ? chartWidth / 2
        : (index / (readings.length - 1)) * chartWidth);

    const y = padding.top + ((100 - cpu) / 100) * chartHeight;

    return {
      x,
      y,
      cpu,
      metric,
      index,
    };
  });

  const markerInterval = Math.max(
    1,
    Math.ceil(points.length / 35)
  );

  const visiblePoints = points.filter(
    (point, index) =>
      index === 0 ||
      index === points.length - 1 ||
      index % markerInterval === 0
  );

  const pointString = points
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  const firstPoint = points[0];
  const latestPoint = points[points.length - 1];

  function readingTime(metric) {
    const value = firstValue(
      metric,
      ["recordedAt", "timestamp", "createdAt"],
      null
    );

    if (value === null) {
      return "Timestamp unavailable";
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? String(value)
      : date.toLocaleString();
  }

  return (
    <div className="cpu-chart">
      <div className="line-row">
        <span>Historical CPU utilization</span>

        <b>
          {number(firstPoint.cpu)}% → {number(latestPoint.cpu)}%
        </b>
      </div>

      <div className="cpu-chart-scroll">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`Historical CPU utilization chart with ${points.length} recorded readings`}
          style={{
            width: "100%",
            minWidth: "500px",
            height: "auto",
            display: "block",
          }}
        >
          {[0, 25, 50, 75, 100].map((value) => {
            const y =
              padding.top + ((100 - value) / 100) * chartHeight;

            return (
              <g key={value}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="currentColor"
                  opacity="0.14"
                />

                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="currentColor"
                  fontSize="12"
                >
                  {value}%
                </text>
              </g>
            );
          })}

          <polyline
            points={pointString}
            fill="none"
            stroke="#5685f5"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {visiblePoints.map((point) => (
            <circle
              key={point.metric.id ?? point.index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#5685f5"
              stroke="#ffffff"
              strokeWidth="1.2"
            >
              <title>
                CPU: {number(point.cpu)}%
                {"\n"}
                Recorded at: {readingTime(point.metric)}
                {"\n"}
                Reading: {point.index + 1} of {points.length}
              </title>
            </circle>
          ))}

          <text
            x={padding.left}
            y={height - 12}
            fill="currentColor"
            fontSize="12"
          >
            First reading
          </text>

          <text
            x={width - padding.right}
            y={height - 12}
            textAnchor="end"
            fill="currentColor"
            fontSize="12"
          >
            Latest reading
          </text>
        </svg>
      </div>

      <div className="cpu-chart-legend">
        <span>
          <span
            className="cpu-legend-dot"
            aria-hidden="true"
          />
          CPU utilization
        </span>

        <span>{points.length} historical readings</span>
      </div>

      <p className="smalltext">
        Historical readings from the CloudSage backend. Hover over a
        marker to inspect its recorded CPU value and timestamp. This
        chart shows historical data, not a future prediction.
      </p>
    </div>
  );
}

export default CpuTrendChart;
