import { useDashboard } from "../context/DashboardContext";

const FEATURES = [
  { id: "v1", label: "View transactions", viewer: true, admin: true },
  { id: "v2", label: "View insights", viewer: true, admin: true },
  { id: "a1", label: "Add transaction", viewer: false, admin: true },
  { id: "a2", label: "Edit / delete rows", viewer: false, admin: true },
];

export function RoleAccessCard() {
  const { state, dispatch } = useDashboard();
  const isAdmin = state.role === "admin";

  return (
    <article className="role-card" aria-labelledby="role-card-title">
      <h3 id="role-card-title" className="role-card-title">
        Admin &amp; viewer modes
      </h3>
      <div className="role-toggle" role="group" aria-label="Demo role">
        <button
          type="button"
          className={`role-pill ${isAdmin ? "is-active" : ""}`}
          aria-pressed={isAdmin}
          onClick={() => dispatch({ type: "SET_ROLE", payload: "admin" })}
        >
          Admin
        </button>
        <button
          type="button"
          className={`role-pill ${!isAdmin ? "is-active" : ""}`}
          aria-pressed={!isAdmin}
          onClick={() => dispatch({ type: "SET_ROLE", payload: "viewer" })}
        >
          Viewer
        </button>
      </div>
      <ul className="role-features">
        {FEATURES.map((f) => {
          const allowed = isAdmin ? f.admin : f.viewer;
          return (
            <li
              key={f.id}
              className={`role-feature-row ${allowed ? "is-on" : "is-off"}`}
            >
              <span className="role-feature-icon" aria-hidden="true">
                {allowed ? "✓" : "·"}
              </span>
              {f.label}
            </li>
          );
        })}
      </ul>
    </article>
  );
}
