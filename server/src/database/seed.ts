
import db from "./db.js";

// Insert sample branches
const insertBranch = db.prepare(`
  INSERT INTO branches (branch_name, location)
  VALUES (?, ?)
`);

const branches = [
  ["Bangalore Main", "Bangalore"],
  ["Mumbai Central", "Mumbai"],
  ["Chennai South", "Chennai"],
  ["Hyderabad Branch", "Hyderabad"]
];

// Insert sample customers
const insertCustomer = db.prepare(`
  INSERT INTO customers (name, segment)
  VALUES (?, ?)
`);

const customers = [
  ["Arun Kumar", "Retail"],
  ["Priya Sharma", "Retail"],
  ["Rahul Mehta", "SME"],
  ["Sneha Rao", "Retail"],
  ["Vikram Patel", "SME"],
  ["Ananya Das", "Retail"],
  ["Kiran Reddy", "SME"],
  ["Meera Nair", "Retail"],
  ["Rohit Shah", "SME"],
  ["Divya Iyer", "Retail"]
];

// Insert sample applications
const insertApplication = db.prepare(`
  INSERT INTO applications
  (customer_id, branch_id, application_date, status)
  VALUES (?, ?, ?, ?)
`);

const applications = [
  [1, 1, "2026-01-10", "Approved"],
  [2, 2, "2026-01-15", "Rejected"],
  [3, 1, "2026-02-05", "Approved"],
  [4, 3, "2026-02-12", "Rejected"],
  [5, 4, "2026-03-08", "Approved"],
  [6, 2, "2026-03-18", "Approved"],
  [7, 3, "2026-04-02", "Rejected"],
  [8, 1, "2026-04-15", "Approved"],
  [9, 4, "2026-05-11", "Rejected"],
  [10, 2, "2026-05-20", "Approved"],
  [1, 3, "2026-06-01", "Approved"],
  [3, 1, "2026-06-10", "Rejected"],
  [5, 4, "2026-07-05", "Approved"],
  [7, 2, "2026-07-14", "Approved"],
  [9, 3, "2026-08-09", "Rejected"]
];

// Insert sample transactions
const insertTransaction = db.prepare(`
  INSERT INTO transactions
  (customer_id, amount, transaction_date)
  VALUES (?, ?, ?)
`);

const transactions = [
  [1, 50000, "2026-01-05"],
  [2, 25000, "2026-01-10"],
  [3, 150000, "2026-01-15"],
  [4, 30000, "2026-02-01"],
  [5, 200000, "2026-02-12"],
  [6, 45000, "2026-02-20"],
  [7, 175000, "2026-03-01"],
  [8, 35000, "2026-03-10"],
  [9, 225000, "2026-03-15"],
  [10, 40000, "2026-04-01"],
  [1, 60000, "2026-04-10"],
  [3, 125000, "2026-04-15"],
  [5, 180000, "2026-05-01"],
  [7, 95000, "2026-05-10"],
  [9, 250000, "2026-05-20"],
  [2, 55000, "2026-06-01"],
  [4, 65000, "2026-06-10"],
  [6, 85000, "2026-06-15"],
  [8, 75000, "2026-07-01"],
  [10, 110000, "2026-07-10"]
];

// Run all inserts as one transaction
const seedDatabase = db.transaction(() => {
  for (const branch of branches) insertBranch.run(...branch);
  for (const customer of customers) insertCustomer.run(...customer);
  for (const application of applications) insertApplication.run(...application);
  for (const transaction of transactions) insertTransaction.run(...transaction);
});

seedDatabase();

console.log("Banking sample data inserted successfully!");
console.log("Branches:", db.prepare("SELECT COUNT(*) AS count FROM branches").get());
console.log("Customers:", db.prepare("SELECT COUNT(*) AS count FROM customers").get());
console.log("Applications:", db.prepare("SELECT COUNT(*) AS count FROM applications").get());
console.log("Transactions:", db.prepare("SELECT COUNT(*) AS count FROM transactions").get());
