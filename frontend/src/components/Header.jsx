function Header({
  pageInfo,
  connection,
  isDark,
  setTheme,
  refreshData,
  loading,
}) {
  return (
    <header className="topbar">
      <div className="topbar-heading">
        <div className="breadcrumb">
          <span>CloudSage</span>
          <span className="breadcrumb-separator">/</span>
          <span>{pageInfo?.label || "Overview"}</span>
        </div>

        <h1>{pageInfo?.title || "Overview"}</h1>

        <p>{pageInfo?.description || "Your cloud resource intelligence workspace."}</p>
      </div>

      <div className="topbar-actions">
        <div className="connection-indicator">
          <span
            className={`dot ${connection === "Connected" ? "ok" : ""}`}
          />
          <span>{connection}</span>
        </div>

        <button
          type="button"
          className="icon-button"
          onClick={refreshData}
          disabled={loading}
          title="Refresh data"
          aria-label="Refresh data"
        >
          ↻
        </button>

        <button
          type="button"
          className="icon-button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? "☀" : "☾"}
        </button>
      </div>
    </header>
  );
}

export default Header;
