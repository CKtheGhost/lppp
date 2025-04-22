export default function Loading() {
  return (
    <div id="loading-overlay" className="loading-overlay active">
      <div className="loading-content">
        <div className="logo-pulse">
          <img src="/images/logo.svg" alt="PROSPERA" width="80" height="80" />
        </div>
        <p className="loading-text">Initializing quantum environment...</p>
        <div className="loading-progress">
          <div className="loading-bar"></div>
        </div>
      </div>
    </div>
  )
}