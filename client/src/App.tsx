
import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import "./App.css";

interface AnalyticsResponse {
  success: boolean;
  question: string;
  answer: string;
  data: Record<string, unknown>[];
  visualizationType: "bar" | "line" | "table" | null;
  title?: string;
  error?: string;
}

const examples = [
  "Show monthly onboarding applications by customer segment",
  "Which branches have the highest rejection rate?",
  "Compare retail and SME onboarding volumes",
  "Show the top five customers by transaction value"
];

function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function askQuestion(value = question) {
    if (!value.trim()) return;

    setQuestion(value);
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        "http://localhost:5000/api/analytics/query",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ question: value })
        }
      );

      const data: AnalyticsResponse = await response.json();

      if (!response.ok || !data.success) {
        setError(data.answer || "Unable to process your question.");
        return;
      }

      setResult(data);
    } catch {
      setError(
        "Unable to connect to the backend. Please check whether the server is running."
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyAnswer() {
    if (!result) return;

    const output = [
      result.title || result.answer,
      JSON.stringify(result.data, null, 2)
    ].join("\n\n");

    try {
      await navigator.clipboard.writeText(output);
    } catch {
      setError("Unable to copy results. Please check clipboard permissions.");
    }
  }

  // Prepare chart data
  const chartData: Record<string, unknown>[] = (() => {
    if (!result) return [];

    // Group monthly onboarding data by month.
    // Retail and SME become separate chart series.
    if (
      result.visualizationType === "line" &&
      result.data.length > 0 &&
      "month" in result.data[0] &&
      "segment" in result.data[0]
    ) {
      const monthlyData: Record<string, unknown>[] = [];

      for (const row of result.data) {
        let monthRow = monthlyData.find(
          (item) => item.month === row.month
        );

        if (!monthRow) {
          monthRow = { month: row.month };
          monthlyData.push(monthRow);
        }

        monthRow[String(row.segment)] = Number(
          row.total_applications
        );
      }

      return monthlyData;
    }

    return result.data.map((item) => ({ ...item }));
  })();

  // Identify chart series across ALL rows, not only the first row.
  const chartKeys = Array.from(
    new Set(chartData.flatMap((row) => Object.keys(row)))
  ).filter(
    (key) =>
      key !== "month" &&
      key !== "segment" &&
      key !== "branch_name" &&
      key !== "customer_name"
  );

  const labelKey = chartData[0]
    ? Object.keys(chartData[0]).find((key) =>
        [
          "month",
          "segment",
          "branch_name",
          "customer_name"
        ].includes(key)
      )
    : undefined;

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="brand-icon">B</div>
          <div>
            <h2>BankInsight</h2>
            <span>Conversational Data Analyst</span>
          </div>
        </div>

        <div className="status">
          <span className="status-dot"></span> Analytics ready
        </div>
      </header>

      <main className="main">
        <section className="welcome">
          <span className="eyebrow">BANKING ANALYTICS</span>
          <h1>Ask your banking data anything.</h1>
          <p>
            Explore onboarding trends, branch performance and customer
            transactions using natural language.
          </p>
        </section>

        <section className="workspace">
          <div className="question-box">
            <label htmlFor="question">Your question</label>

            <textarea
              id="question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask a question about your banking data..."
              rows={3}
            />

            <div className="input-footer">
              <span>Ask a banking analytics question</span>

              <button
                onClick={() => askQuestion()}
                disabled={loading || !question.trim()}
              >
                {loading ? "Analyzing..." : "Analyze →"}
              </button>
            </div>
          </div>

          <div className="examples">
            <h3>Try these questions</h3>

            <div className="example-list">
              {examples.map((example) => (
                <button
                  className="example-button"
                  key={example}
                  onClick={() => askQuestion(example)}
                  disabled={loading}
                >
                  {example} <span>↗</span>
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="message">
              Analyzing your question and retrieving banking data...
            </div>
          )}

          {error && <div className="error">{error}</div>}

          {result && (
            <section className="results">
              <div className="result-heading">
                <div>
                  <span className="eyebrow">ANALYSIS RESULT</span>
                  <h2>{result.title}</h2>
                  <p>{result.answer}</p>
                </div>

                <button className="copy-button" onClick={copyAnswer}>
                  Copy results
                </button>
              </div>

              {result.visualizationType !== "table" &&
                chartData.length > 0 &&
                chartKeys.length > 0 && (
                  <div className="chart">
                    <ResponsiveContainer width="100%" height={300}>
                      {result.visualizationType === "line" ? (
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />

                          <XAxis
                            dataKey={labelKey}
                            angle={-15}
                            textAnchor="end"
                            height={65}
                          />

                          <YAxis />
                          <Tooltip />
                          <Legend />

                          {chartKeys.map((key, index) => (
                            <Line
                              key={key}
                              type="monotone"
                              dataKey={key}
                              name={key}
                              stroke={
                                ["#2563eb", "#16a34a", "#f59e0b"][
                                  index % 3
                                ]
                              }
                              strokeWidth={2}
                              connectNulls
                            />
                          ))}
                        </LineChart>
                      ) : (
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />

                          <XAxis dataKey={labelKey} />
                          <YAxis />
                          <Tooltip />
                          <Legend />

                          {chartKeys.map((key, index) => (
                            <Bar
                              key={key}
                              dataKey={key}
                              name={key.replaceAll("_", " ")}
                              fill={
                                ["#2563eb", "#16a34a", "#f59e0b"][
                                  index % 3
                                ]
                              }
                              radius={[5, 5, 0, 0]}
                            />
                          ))}
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                )}

              <h3>Detailed data</h3>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      {result.data.length > 0 &&
                        Object.keys(result.data[0]).map((key) => (
                          <th key={key}>
                            {key.replaceAll("_", " ")}
                          </th>
                        ))}
                    </tr>
                  </thead>

                  <tbody>
                    {result.data.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, cellIndex) => (
                          <td key={cellIndex}>
                            {String(value ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </section>
      </main>

      <footer>
        BankInsight · Synthetic banking data for demonstration
      </footer>
    </div>
  );
}

export default App;
