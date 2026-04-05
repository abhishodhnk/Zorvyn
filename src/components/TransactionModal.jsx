import { useState, useEffect } from "react";
import { CATEGORIES } from "../data/mockData";
import { newId } from "../utils/aggregates";

const emptyForm = {
  date: "",
  amount: "",
  category: "Food",
  type: "expense",
  note: "",
};

export function TransactionModal({ open, mode, initial, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setError("");
    if (mode === "edit" && initial) {
      setForm({
        date: initial.date,
        amount: String(initial.amount),
        category: initial.category,
        type: initial.type,
        note: initial.note || "",
      });
    } else {
      const today = new Date().toISOString().slice(0, 10);
      setForm({ ...emptyForm, date: today, category: "Food" });
    }
  }, [open, mode, initial]);

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!form.date) {
      setError("Pick a date.");
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a positive amount.");
      return;
    }
    const payload =
      mode === "edit" && initial
        ? {
            id: initial.id,
            date: form.date,
            amount,
            category: form.category,
            type: form.type,
            note: form.note.trim(),
          }
        : {
            id: newId(),
            date: form.date,
            amount,
            category: form.category,
            type: form.type,
            note: form.note.trim(),
          };
    onSave(payload);
    onClose();
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <h2 id="modal-title" className="modal-title">
            {mode === "edit" ? "Edit transaction" : "Add transaction"}
          </h2>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <label className="form-field">
            Date
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              required
            />
          </label>
          <label className="form-field">
            Amount (INR)
            <input
              type="number"
              min="1"
              step="1"
              value={form.amount}
              onChange={(e) =>
                setForm((f) => ({ ...f, amount: e.target.value }))
              }
              required
            />
          </label>
          <label className="form-field">
            Category
            <select
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value }))
              }
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <fieldset className="form-field fieldset-plain">
            <legend>Type</legend>
            <label className="radio-label">
              <input
                type="radio"
                name="type"
                value="income"
                checked={form.type === "income"}
                onChange={() => setForm((f) => ({ ...f, type: "income" }))}
              />
              Income
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="type"
                value="expense"
                checked={form.type === "expense"}
                onChange={() => setForm((f) => ({ ...f, type: "expense" }))}
              />
              Expense
            </label>
          </fieldset>
          <label className="form-field">
            Note
            <input
              type="text"
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              placeholder="Optional"
            />
          </label>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {mode === "edit" ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
