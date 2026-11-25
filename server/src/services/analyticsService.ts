
import db from "../database/db.js";
import { planQuery } from "../query-planner/queryPlanner.js";

export function processAnalyticsQuestion(question: string) {
  const plan = planQuery(question);

  if (!plan) {
    return {
      success: false,
      question,
      answer:
        "Sorry, I couldn't understand this question. Please try one of the supported banking analytics questions.",
      data: [],
      visualizationType: null,
      error: "UNSUPPORTED_QUESTION"
    };
  }

  try {
    const data = db
      .prepare(plan.sql)
      .all() as Record<string, unknown>[];

    return {
      success: true,
      question,
      answer: `Here are the results for: ${plan.title}`,
      data,
      visualizationType: plan.visualizationType,
      title: plan.title
    };
  } catch (error) {
    console.error("Analytics query error:", error);

    return {
      success: false,
      question,
      answer: "Something went wrong while retrieving banking data.",
      data: [],
      visualizationType: null,
      error: "DATABASE_ERROR"
    };
  }
}
