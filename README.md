
# BankInsight – Conversational Data Analyst

## Project Overview

BankInsight is a full-stack conversational analytics application that allows users to ask questions about synthetic banking data using natural language.

The application processes supported questions, identifies the relevant analytics query, retrieves results from a relational SQLite database, and displays the results using charts and tables.

## Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Recharts

### Backend
- Node.js
- Express.js
- TypeScript
- SQLite
- better-sqlite3
- Zod

### Testing
- Vitest

## Features

- Natural-language question input.
- Banking analytics using predefined and validated SQL queries.
- Monthly onboarding applications by customer segment.
- Branch rejection rate analysis.
- Retail vs SME onboarding comparison.
- Top five customers by transaction value.
- Interactive bar and line charts.
- Detailed results in tabular format.
- Copy results functionality.
- Error handling for unsupported questions and backend failures.
- Synthetic banking datasets.

## Database Design

The application uses SQLite with four tables:

1. Customers
2. Branches
3. Applications
4. Transactions

Synthetic sample data is provided through the database seed script.

## Project Structure

```text
conversational-data-analyst/
│
├── client/
│   └── src/
│       ├── App.tsx
│       └── App.css
│
├── server/
│   ├── src/
│   │   ├── database/
│   │   ├── query-planner/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.ts
│   │
│   ├── tests/
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js
- npm

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd conversational-data-analyst
```

### 2. Install frontend dependencies

```bash
cd client
npm install
npm install recharts lucide-react
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd server
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the server folder using `.env.example`.

Example:

```env
PORT=5000
```

### 5. Seed the database

From the server folder, run:

```bash
npx tsx src/database/seed.ts
```

### 6. Start the backend

```bash
npm run dev
```

Backend URL:

http://localhost:5000

### 7. Start the frontend

In a separate terminal:

```bash
cd client
npm run dev
```

Frontend URL:

http://localhost:5173

## API Endpoints

### Health Check

GET `/api/health`

Checks whether the backend server is running.

### Analytics Query

POST `/api/analytics/query`

Example request:

```json
{
  "question": "Show monthly onboarding applications by customer segment"
}
```

## Testing

Run backend automated tests:

```bash
cd server
npm test
```

The test suite validates:
- Monthly onboarding query identification.
- Branch rejection query identification.
- Retail and SME comparison query identification.
- Top five customer query identification.
- Unsupported question handling.

## Architecture and Design Decisions

- The frontend and backend are maintained separately.
- SQLite is used as the relational database for this demonstration.
- The query planner maps supported natural-language questions to predefined SQL templates.
- User input is validated before query processing.
- Arbitrary user-generated SQL is not executed.
- Synthetic banking data is used instead of real customer information.
- The application uses a mock/rule-based query planner rather than a live LLM integration.

## Assumptions and Limitations

- Only the four supported banking analytics questions are implemented.
- Results are based on synthetic sample data.
- The application does not connect to a live banking system.
- The query planner uses predefined rules rather than a production LLM.
- Authentication and role-based access control are not implemented.

## Production Improvements

- Integrate a real LLM with controlled query planning.
- Add authentication and authorization.
- Add database access controls and audit logging.
- Improve monitoring and application logging.
- Add additional banking datasets and analytics queries.
- Deploy the application using a production hosting environment.

## AI Tool Disclosure

AI assistance was used during development for coding guidance, debugging, and documentation support.

The developer reviewed and tested the implementation and is responsible for the final architecture, code, and submission.
