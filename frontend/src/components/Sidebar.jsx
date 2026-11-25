function Sidebar({
  navItems,
  page,
  goTo,
  connection,
  loading,
  refreshData,
  isDark,
}) {
  return (
    <aside className="sidebar">
      <button
        className="brand"
        onClick={() => goTo("overview")}
        aria-label="CloudSage home"
      >
        <img
          className="brand-logo"
          src={
            isDark
              ? "/darkmode%20logo.png"
              : "/lightmode%20logo.png"
          }
          alt="CloudSage"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
        <span className="brand-fallback">CloudSage</span>
      </button>

      <div className="nav-label">WORKSPACE</div>

      <nav className="navigation" aria-label="Main navigation">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${page === item.id ? "active" : ""}`}
            onClick={() => goTo(item.id)}
            aria-current={page === item.id ? "page" : undefined}
          >
            <span className="nav-icon" aria-hidden="true">
              {item.icon}
            </span>

            <span className="nav-text">{item.label}</span>

            {item.tag && <span className="ai-tag">{item.tag}</span>}
          </button>
        ))}
      </nav>

      <div className="side-status">
        <span className={`dot ${connection === "Connected" ? "ok" : ""}`} />

        <div className="side-status-copy">
          <b>{connection}</b>
          <small>Spring Boot API</small>
        </div>

        <button
          className="icon-button"
          onClick={refreshData}
          disabled={loading}
          title="Retry backend connection"
          aria-label="Retry backend connection"
        >
          ↻
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
