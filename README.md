# Finance Dashboard UI — Zorvyn Assignment

**Candidate:** Abhishodh N K  
**Email:** abhishodhnk@gmail.com  
**Role applied:** Frontend Developer Intern  
**Stack:** React (JavaScript only), Vite, CSS, Recharts  

## Overview

A single-page **finance dashboard** (**FINTRACK** presentation) with a **black + chartreuse** neo-brutalist marketing shell: hero with **outline + solid display type** (Bebas Neue), **stats strip**, **bento overview** (balance / income / expense + horizontal category bars + savings ring + **Admin / Viewer toggle**), then **charts**, **transactions**, and **insights**. All behavior is still **mock data** and **client-side state** (no backend).

## Setup

```bash
cd zorvyn-finance-dashboard
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

**Production build:**

```bash
npm run build
npm run preview
```

## How requirements are met

| Requirement | Implementation |
|-------------|----------------|
| **Dashboard overview** | Cards: Total balance, Income, Expenses (derived from all transactions). |
| **Time-based visualization** | Area chart: **cumulative balance** at end of each month (`balanceTrendByMonth`). |
| **Categorical visualization** | Donut-style **pie chart**: expense totals **by category**. |
| **Transactions** | Table with **date**, **amount**, **category**, **type** (income/expense), optional **note**. |
| **Filtering / search / sort** | Category + type filters, **search** (category, note, amount), **sort** by date or amount (toggle direction). |
| **Role-based UI** | **Viewer:** read-only (no add/edit/delete). **Admin:** add, edit, delete + reset mock data. Switch via **Admin / Viewer** pills in the overview **role card**. |
| **Insights** | Highest spending category, **month-over-month** expense comparison (with fallback to last two months in data if current month is empty), **savings rate** (net vs income). |
| **State management** | **React Context** + **`useReducer`** for transactions, role, filters, sort; derived metrics via `useMemo` in components / `aggregates.js`. |
| **UI/UX** | FINTRACK-style layout (Inter + Bebas Neue + JetBrains Mono), responsive grids, **empty states** (no data / no filter matches). |
| **Optional extras** | **localStorage** persistence (transactions + role), **CSV export** of the **currently filtered** list, modal transitions (`prefers-reduced-motion` respected). |

## Project structure

```
src/
  App.jsx                 # Page layout + footer (reset mock data)
  App.css                 # FINTRACK black + chartreuse system
  main.jsx                # React entry
  context/
    DashboardContext.jsx  # useReducer + localStorage persistence
  data/
    mockData.js           # Seed transactions + category list
  components/
    HeaderBar.jsx         # FINTRACK nav + CTA
    HeroLanding.jsx       # Outline/solid hero + preview column
    StatsBanner.jsx       # Live metrics strip
    CategorySpendBars.jsx # Horizontal category bars
    SavingsRateCard.jsx     # Lime card + conic ring
    RoleAccessCard.jsx    # Admin / Viewer toggles + feature list
    SummaryCards.jsx
    ChartsSection.jsx     # Recharts area + pie
    TransactionsPanel.jsx # Toolbar, table, export, modal trigger
    TransactionModal.jsx  # Add / edit form
    InsightsPanel.jsx
  utils/
    aggregates.js         # Totals, trends, filters, insights
    exportCsv.js          # CSV download helper
```

## Assumptions

- Currency display uses **INR** (`en-IN`) for a realistic India FinTech context.
- Dates are stored as **ISO strings** (`YYYY-MM-DD`).
- **Admin** actions are intentionally client-only for the assignment demo.

## Deployment

Build with `npm run build` and deploy to any static host (Netlify, Vercel, GitHub Pages, etc.).

---

© Submission for Zorvyn — original work by Abhishodh N K.
