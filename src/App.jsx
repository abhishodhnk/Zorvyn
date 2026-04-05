import { lazy, Suspense } from "react";
import { useDashboard } from "./context/DashboardContext";
import { HeaderBar } from "./components/HeaderBar";
import { HeroLanding } from "./components/HeroLanding";
import { StatsBanner } from "./components/StatsBanner";
import { SummaryCards } from "./components/SummaryCards";
import { InsightsPanel } from "./components/InsightsPanel";
import { TransactionsPanel } from "./components/TransactionsPanel";

const ChartsSection = lazy(() =>
  import("./components/ChartsSection.jsx").then((m) => ({
    default: m.ChartsSection,
  }))
);

function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        
        <div className="footer-logo">
          FIN<span>TRACK</span>
        </div>

        <div className="footer-actions">
          <a href="https://github.com/abhishodhnk">GitHub</a>
        </div>

      </div>

      <p className="footer-note">
        © Abhishodh N K - 2026 · Built for Zorvyn FinTech 
      </p>
    </footer>
  );
}

export default function App() {
  return (
    <div className="app">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <HeaderBar />
      <main id="main-content" className="app-main">
        <div className="shell shell-wide">
          <HeroLanding />
          <StatsBanner />
          <SummaryCards />
          <Suspense
            fallback={
              <div className="chart-suspense" role="status">
                Loading charts…
              </div>
            }
          >
            <ChartsSection />
          </Suspense>
          <TransactionsPanel />
          <InsightsPanel />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
