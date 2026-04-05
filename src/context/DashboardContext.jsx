import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
} from "react";
import { initialTransactions } from "../data/mockData";

const STORAGE_KEY = "zorvyn-finance-dashboard-v1";

const defaultState = {
  transactions: initialTransactions,
  role: "viewer",
  filterCategory: "all",
  filterType: "all",
  searchQuery: "",
  sortBy: "date",
  sortDir: "desc",
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const { theme: _legacyTheme, ...rest } = parsed;
    return {
      ...defaultState,
      ...rest,
      transactions: Array.isArray(parsed.transactions)
        ? parsed.transactions
        : defaultState.transactions,
    };
  } catch {
    return null;
  }
}

function dashboardReducer(state, action) {
  switch (action.type) {
    case "SET_ROLE":
      return { ...state, role: action.payload };
    case "SET_FILTER_CATEGORY":
      return { ...state, filterCategory: action.payload };
    case "SET_FILTER_TYPE":
      return { ...state, filterType: action.payload };
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "SET_SORT":
      return {
        ...state,
        sortBy: action.sortBy,
        sortDir: action.sortDir,
      };
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };
    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case "RESET_DATA":
      return { ...state, transactions: [...initialTransactions] };
    default:
      return state;
  }
}

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(
    dashboardReducer,
    defaultState,
    (base) => loadState() || base
  );

  useEffect(() => {
    const { transactions, role } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ transactions, role }));
  }, [state.transactions, state.role]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return ctx;
}
