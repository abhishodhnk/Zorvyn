/** Initial mock transactions — static data for the assignment */

export const CATEGORIES = [
  "Salary",
  "Freelance",
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Other",
];

function pad(n) {
  return String(n).padStart(2, "0");
}

/** YYYY-MM-DD */
export function isoDate(year, monthIndex, day) {
  return `${year}-${pad(monthIndex + 1)}-${pad(day)}`;
}

export const initialTransactions = [
  {
    id: "t1",
    date: isoDate(2026, 0, 5),
    amount: 5200,
    category: "Salary",
    type: "income",
    note: "Monthly salary",
  },
  {
    id: "t2",
    date: isoDate(2026, 0, 8),
    amount: 420,
    category: "Food",
    type: "expense",
    note: "Groceries",
  },
  {
    id: "t3",
    date: isoDate(2026, 0, 12),
    amount: 800,
    category: "Freelance",
    type: "income",
    note: "UI contract",
  },
  {
    id: "t4",
    date: isoDate(2026, 0, 14),
    amount: 120,
    category: "Transport",
    type: "expense",
    note: "Transit pass",
  },
  {
    id: "t5",
    date: isoDate(2026, 0, 18),
    amount: 280,
    category: "Shopping",
    type: "expense",
    note: "Winter jacket",
  },
  {
    id: "t6",
    date: isoDate(2026, 0, 22),
    amount: 1650,
    category: "Bills",
    type: "expense",
    note: "Rent share",
  },
  {
    id: "t7",
    date: isoDate(2026, 1, 2),
    amount: 5200,
    category: "Salary",
    type: "income",
    note: "Monthly salary",
  },
  {
    id: "t8",
    date: isoDate(2026, 1, 6),
    amount: 95,
    category: "Entertainment",
    type: "expense",
    note: "Concert",
  },
  {
    id: "t9",
    date: isoDate(2026, 1, 9),
    amount: 340,
    category: "Food",
    type: "expense",
    note: "Dining out",
  },
  {
    id: "t10",
    date: isoDate(2026, 1, 11),
    amount: 200,
    category: "Health",
    type: "expense",
    note: "Pharmacy",
  },
  {
    id: "t11",
    date: isoDate(2026, 1, 15),
    amount: 450,
    category: "Freelance",
    type: "income",
    note: "Logo project",
  },
  {
    id: "t12",
    date: isoDate(2026, 1, 20),
    amount: 180,
    category: "Transport",
    type: "expense",
    note: "Fuel",
  },
  {
    id: "t13",
    date: isoDate(2026, 2, 1),
    amount: 5200,
    category: "Salary",
    type: "income",
    note: "Monthly salary",
  },
  {
    id: "t14",
    date: isoDate(2026, 2, 4),
    amount: 890,
    category: "Shopping",
    type: "expense",
    note: "Laptop accessories",
  },
  {
    id: "t15",
    date: isoDate(2026, 2, 8),
    amount: 210,
    category: "Food",
    type: "expense",
    note: "Groceries",
  },
];
