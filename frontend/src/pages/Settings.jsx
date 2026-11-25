function Settings({
  pageInfo,
  cpuThreshold,
  setCpuThreshold,
  uptimeTarget,
  setUptimeTarget,
  connection,
  loadError,
  refreshData,
  loading,
  exportData,
  API_BASE,
}) {
  const cpuPercentage =
    ((Number(cpuThreshold) - 50) / (95 - 50)) * 100;

  const uptimePercentage =
    ((Number(uptimeTarget) - 95) / (99.99 - 95)) * 100;

  return (
    <section className="page-section settings-page">

      {/* -------------------------------------------------
          PAGE HEADER
      ------------------------------------------------- */}

      <div className="settings-header">
        <div>
          <span className="eyebrow">SETTINGS</span>

          <h2>
            {pageInfo?.title || "Settings"}
          </h2>

          <p>
            {pageInfo?.description ||
              "Manage how CloudSage evaluates resources and handles your data."}
          </p>
        </div>
      </div>


      {/* -------------------------------------------------
          ANALYSIS PREFERENCES
      ------------------------------------------------- */}

      <article className="settings-card">

        <div className="settings-card-header">
          <div>
            <span className="settings-section-label">
              ANALYSIS PREFERENCES
            </span>

            <h3>Decision thresholds</h3>

            <p>
              Configure the thresholds used by CloudSage when
              evaluating resource conditions.
            </p>
          </div>
        </div>


        {/* CPU THRESHOLD */}

        <div className="slider-setting">

          <div className="slider-setting-header">
            <label htmlFor="settings-cpu">
              CPU attention threshold
            </label>

            <strong>
              {cpuThreshold}%
            </strong>
          </div>

          <div className="slider-wrapper">

            <input
              id="settings-cpu"
              type="range"
              min="50"
              max="95"
              step="5"
              value={cpuThreshold}
              onChange={(event) =>
                setCpuThreshold(
                  Number(event.target.value)
                )
              }
              style={{
                "--slider-value": `${cpuPercentage}%`,
              }}
            />

          </div>

          <div className="slider-labels">
            <span>50%</span>
            <span>70%</span>
            <span>95%</span>
          </div>

        </div>


        {/* TARGET AVAILABILITY */}

        <div className="slider-setting">

          <div className="slider-setting-header">
            <label htmlFor="settings-uptime">
              Target availability
            </label>

            <strong>
              {uptimeTarget}%
            </strong>
          </div>

          <div className="slider-wrapper">

            <input
              id="settings-uptime"
              type="range"
              min="95"
              max="99.99"
              step="0.01"
              value={uptimeTarget}
              onChange={(event) =>
                setUptimeTarget(
                  Number(event.target.value)
                )
              }
              style={{
                "--slider-value": `${uptimePercentage}%`,
              }}
            />

          </div>

          <div className="slider-labels">
            <span>95%</span>
            <span>97.5%</span>
            <span>99.99%</span>
          </div>

        </div>

      </article>


      {/* -------------------------------------------------
          DATA
      ------------------------------------------------- */}

      <article className="settings-card settings-data-card">

        <div className="settings-card-header">
          <div>
            <span className="settings-section-label">
              DATA
            </span>

            <h3>Export CloudSage data</h3>

            <p>
              Download the currently loaded analysis data
              for review or reference.
            </p>
          </div>
        </div>

        <div className="settings-action-row">

          <div className="settings-action-info">
            <span>Export format</span>

            <strong>
              JSON
            </strong>
          </div>

          <button
            type="button"
            className="button secondary"
            onClick={exportData}
          >
            Export data
          </button>

        </div>

      </article>


      {/* -------------------------------------------------
          CONNECTION
      ------------------------------------------------- */}

      <article className="settings-card">

        <div className="settings-card-header">

          <div>
            <span className="settings-section-label">
              CONNECTION
            </span>

            <h3>Backend connection</h3>

            <p>
              Current connection status for the CloudSage
              Spring Boot backend.
            </p>
          </div>

          <div
            className={`connection-status ${
              connection === "Connected"
                ? "connected"
                : "disconnected"
            }`}
          >
            <span className="connection-dot"></span>

            <span>
              {connection}
            </span>
          </div>

        </div>


        <div className="connection-details">

          <div className="connection-detail">

            <span>
              Backend API
            </span>

            <strong>
              {API_BASE}
            </strong>

          </div>


          <div className="connection-detail">

            <span>
              Data availability
            </span>

            <strong>
              {loadError
                ? "Unavailable"
                : connection === "Connected"
                  ? "Available"
                  : "Not confirmed"}
            </strong>

          </div>

        </div>


        {loadError && (
          <div className="settings-alert">
            <strong>
              Connection issue
            </strong>

            <p>
              {loadError}
            </p>
          </div>
        )}


        <div className="settings-footer">

          <button
            type="button"
            className="button primary"
            onClick={refreshData}
            disabled={loading}
          >
            {loading
              ? "Checking connection..."
              : "Check connection"}
          </button>

        </div>

      </article>

    </section>
  );
}

export default Settings;