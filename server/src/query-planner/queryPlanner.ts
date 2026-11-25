
export type VisualizationType = "bar" | "line" | "table";

export interface QueryPlan {
  intent: string;
  sql: string;
  visualizationType: VisualizationType;
  title: string;
}

const queryPlans: Record<string, QueryPlan> = {
  monthly_onboarding: {
    intent: "monthly_onboarding",
    title: "Monthly Onboarding Applications by Customer Segment",
    visualizationType: "line",
    sql: `
      SELECT
        strftime('%Y-%m', a.application_date) AS month,
        c.segment,
        COUNT(a.id) AS total_applications
      FROM applications a
      JOIN customers c ON a.customer_id = c.id
      GROUP BY month, c.segment
      ORDER BY month
    `
  },

  branch_rejection: {
    intent: "branch_rejection",
    title: "Branch Rejection Rates",
    visualizationType: "bar",
    sql: `
      SELECT
        b.branch_name,
        COUNT(a.id) AS total_applications,
        SUM(CASE WHEN a.status = 'Rejected' THEN 1 ELSE 0 END)
          AS rejected_applications,
        ROUND(
          100.0 * SUM(CASE WHEN a.status = 'Rejected' THEN 1 ELSE 0 END)
          / COUNT(a.id), 2
        ) AS rejection_rate
      FROM applications a
      JOIN branches b ON a.branch_id = b.id
      GROUP BY b.id, b.branch_name
      ORDER BY rejection_rate DESC
    `
  },

  segment_comparison: {
    intent: "segment_comparison",
    title: "Retail vs SME Onboarding Volumes",
    visualizationType: "bar",
    sql: `
      SELECT
        c.segment,
        COUNT(a.id) AS total_applications
      FROM applications a
      JOIN customers c ON a.customer_id = c.id
      GROUP BY c.segment
    `
  },

  top_customers: {
    intent: "top_customers",
    title: "Top Five Customers by Transaction Value",
    visualizationType: "bar",
    sql: `
      SELECT
        c.name AS customer_name,
        SUM(t.amount) AS total_transaction_value
      FROM transactions t
      JOIN customers c ON t.customer_id = c.id
      GROUP BY c.id, c.name
      ORDER BY total_transaction_value DESC
      LIMIT 5
    `
  }
};

export function planQuery(question: string): QueryPlan | null {
  const normalizedQuestion = question.toLowerCase().trim();

  if (
    normalizedQuestion.includes("monthly") &&
    (normalizedQuestion.includes("onboarding") ||
      normalizedQuestion.includes("applications")) &&
    (normalizedQuestion.includes("segment") ||
      normalizedQuestion.includes("customer"))
  ) {
    return queryPlans.monthly_onboarding;
  }

  if (
    normalizedQuestion.includes("branch") &&
    (normalizedQuestion.includes("rejection") ||
      normalizedQuestion.includes("reject"))
  ) {
    return queryPlans.branch_rejection;
  }

  if (
    normalizedQuestion.includes("retail") &&
    normalizedQuestion.includes("sme")
  ) {
    return queryPlans.segment_comparison;
  }

  if (
    normalizedQuestion.includes("top") &&
    normalizedQuestion.includes("customer") &&
    (normalizedQuestion.includes("transaction") ||
      normalizedQuestion.includes("value"))
  ) {
    return queryPlans.top_customers;
  }

  return null;
}
