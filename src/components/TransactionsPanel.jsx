import { useMemo, useState } from "react";
import { useDashboard } from "../context/DashboardContext";
import {
  filterAndSortTransactions,
  formatCurrency,
  formatShortDate,
} from "../utils/aggregates";
import { CATEGORIES } from "../data/mockData";
import { transactionsToCsv, downloadTextFile } from "../utils/exportCsv";
import { TransactionModal } from "./TransactionModal";

export function TransactionsPanel() {
  const { state, dispatch } = useDashboard();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(
    () =>
      filterAndSortTransactions(state.transactions, {
        filterCategory: state.filterCategory,
        filterType: state.filterType,
        searchQuery: state.searchQuery,
        sortBy: state.sortBy,
        sortDir: state.sortDir,
      }),
    [
      state.transactions,
      state.filterCategory,
      state.filterType,
      state.searchQuery,
      state.sortBy,
      state.sortDir,
    ]
  );

  const isAdmin = state.role === "admin";

  function openAdd() {
    setModalMode("add");
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(row) {
    setModalMode("edit");
    setEditing(row);
    setModalOpen(true);
  }

  function handleSave(payload) {
    if (modalMode === "edit") {
      dispatch({ type: "UPDATE_TRANSACTION", payload });
    } else {
      dispatch({ type: "ADD_TRANSACTION", payload });
    }
  }

  function handleExport() {
    const csv = transactionsToCsv(filtered);
    downloadTextFile("transactions.csv", csv);
  }

  function toggleSortAmount() {
    if (state.sortBy === "amount") {
      dispatch({
        type: "SET_SORT",
        sortBy: "amount",
        sortDir: state.sortDir === "asc" ? "desc" : "asc",
      });
    } else {
      dispatch({ type: "SET_SORT", sortBy: "amount", sortDir: "desc" });
    }
  }

  function toggleSortDate() {
    if (state.sortBy === "date") {
      dispatch({
        type: "SET_SORT",
        sortBy: "date",
        sortDir: state.sortDir === "asc" ? "desc" : "asc",
      });
    } else {
      dispatch({ type: "SET_SORT", sortBy: "date", sortDir: "desc" });
    }
  }

  return (
    <section id="ledger" className="section section-tx" aria-labelledby="tx-heading">
      <div className="tx-feature-grid">
        <div className="tx-feature-copy">
          <p className="section-tag">Transactions</p>
          <h2 id="tx-heading" className="mega-section-title">
            Search, filter &amp; sort
          </h2>
          <p className="section-lede section-lede-tight">
            Everything below is live state: filters persist while you browse.
          </p>
        </div>
        <div className="tx-feature-actions">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleExport}
          >
            Export CSV
          </button>
          {isAdmin && (
            <button
              type="button"
              className="btn btn-lime btn-sm"
              onClick={openAdd}
            >
              Add transaction
            </button>
          )}
        </div>
      </div>

      <div className="toolbar">
        <label className="field-inline grow">
          <span className="sr-only">Search</span>
          <input
            type="search"
            className="text-input"
            placeholder="Search category, note, amount…"
            value={state.searchQuery}
            onChange={(e) =>
              dispatch({ type: "SET_SEARCH", payload: e.target.value })
            }
            aria-label="Search transactions"
          />
        </label>
        <label className="field-inline">
          <span className="field-label-visible">Category</span>
          <select
            className="select-input"
            value={state.filterCategory}
            onChange={(e) =>
              dispatch({ type: "SET_FILTER_CATEGORY", payload: e.target.value })
            }
            aria-label="Filter by category"
          >
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="field-inline">
          <span className="field-label-visible">Type</span>
          <select
            className="select-input"
            value={state.filterType}
            onChange={(e) =>
              dispatch({ type: "SET_FILTER_TYPE", payload: e.target.value })
            }
            aria-label="Filter by type"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>
      </div>

      <p className="role-hint" role="status">
        {isAdmin
          ? "Admin: you can add, edit, and delete rows."
          : "Viewer: data is read-only. Switch role to Admin to edit."}
      </p>

      {state.transactions.length === 0 ? (
        <div className="empty-state">
          <p className="empty-title">No transactions yet</p>
          <p className="empty-text">
            {isAdmin
              ? "Add your first transaction to populate the dashboard."
              : "Switch to Admin to add data, or reset mock data from the footer if cleared."}
          </p>
          {isAdmin && (
            <button type="button" className="btn btn-primary" onClick={openAdd}>
              Add transaction
            </button>
          )}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p className="empty-title">No matches</p>
          <p className="empty-text">
            Try clearing search or filters to see all {state.transactions.length}{" "}
            transactions.
          </p>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              dispatch({ type: "SET_SEARCH", payload: "" });
              dispatch({ type: "SET_FILTER_CATEGORY", payload: "all" });
              dispatch({ type: "SET_FILTER_TYPE", payload: "all" });
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">
                  <button
                    type="button"
                    className="th-btn"
                    onClick={toggleSortDate}
                    aria-label={`Sort by date, currently ${
                      state.sortBy === "date" ? state.sortDir : "default"
                    }`}
                  >
                    Date
                    {state.sortBy === "date" && (
                      <span className="sort-ind">
                        {state.sortDir === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </button>
                </th>
                <th scope="col">Category</th>
                <th scope="col">Type</th>
                <th scope="col" className="num">
                  <button
                    type="button"
                    className="th-btn"
                    onClick={toggleSortAmount}
                    aria-label={`Sort by amount`}
                  >
                    Amount
                    {state.sortBy === "amount" && (
                      <span className="sort-ind">
                        {state.sortDir === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </button>
                </th>
                <th scope="col">Note</th>
                {isAdmin && <th scope="col">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  <td>{formatShortDate(row.date)}</td>
                  <td>{row.category}</td>
                  <td>
                    <span
                      className={
                        row.type === "income" ? "pill pill-in" : "pill pill-out"
                      }
                    >
                      {row.type}
                    </span>
                  </td>
                  <td className="num mono">
                    <span
                      className={
                        row.type === "income" ? "amt-in" : "amt-out"
                      }
                    >
                      {row.type === "income" ? "+" : "−"}
                      {formatCurrency(row.amount)}
                    </span>
                  </td>
                  <td className="muted">{row.note || "—"}</td>
                  {isAdmin && (
                    <td>
                      <div className="row-actions">
                        <button
                          type="button"
                          className="link-btn"
                          onClick={() => openEdit(row)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="link-btn danger"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Delete this transaction?"
                              )
                            ) {
                              dispatch({
                                type: "DELETE_TRANSACTION",
                                payload: row.id,
                              });
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <TransactionModal
        open={modalOpen}
        mode={modalMode}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </section>
  );
}
