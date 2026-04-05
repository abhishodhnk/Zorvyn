export function HeaderBar() {
  return (
    <header className="header-bar">
      <a href="#" className="header-logo" aria-label="FINTRACK home">
        FINTRACK
      </a>
      <nav className="header-nav" aria-label="Sections">
        <a href="#viz">Features</a>
        <a href="#signals">Insights</a>
        <a href="#ledger">Transactions</a>
      </nav>
      <div className="header-actions">
        <a className="btn btn-lime btn-header-cta" href="#overview">
          Open dashboard →
        </a>
      </div>
    </header>
  );
}
