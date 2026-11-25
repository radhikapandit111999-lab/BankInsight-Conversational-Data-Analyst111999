
import { describe, it, expect } from "vitest";
import { planQuery } from "../src/query-planner/queryPlanner.js";

describe("Banking Analytics Query Planner", () => {
  it("should identify monthly onboarding questions", () => {
    const result = planQuery(
      "Show monthly onboarding applications by customer segment"
    );

    expect(result).not.toBeNull();
    expect(result?.intent).toBe("monthly_onboarding");
    expect(result?.visualizationType).toBe("line");
  });

  it("should identify branch rejection questions", () => {
    const result = planQuery(
      "Which branches have the highest rejection rate?"
    );

    expect(result?.intent).toBe("branch_rejection");
    expect(result?.visualizationType).toBe("bar");
  });

  it("should identify retail and SME comparison questions", () => {
    const result = planQuery(
      "Compare retail and SME onboarding volumes"
    );

    expect(result?.intent).toBe("segment_comparison");
    expect(result?.visualizationType).toBe("bar");
  });

  it("should identify top five customer questions", () => {
    const result = planQuery(
      "Show the top five customers by transaction value"
    );

    expect(result?.intent).toBe("top_customers");
    expect(result?.visualizationType).toBe("bar");
  });

  it("should reject unsupported questions", () => {
    const result = planQuery(
      "What is the weather today?"
    );

    expect(result).toBeNull();
  });
});
