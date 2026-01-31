# MERIDIAN – Multi-Source AI Decision Assistant  
_MERN + TypeScript · Agentic Orchestration · Multi-DB Reasoning_

MERIDIAN is an advanced, production-grade chatbot system that connects to multiple heterogeneous data sources (Jira, MongoDB, ATS, Slack, etc.), unifies entities across them, and answers high-stakes decision queries with **ranked, explainable recommendations** instead of simple Q&A.

Think of it as an **intelligent data fabric + reasoning layer** you query via chat.

---

## 1. Problem & Motivation

Modern teams run on fragmented tools:

- Hiring: ATS, Excel, email, Slack.
- Engineering: Jira, Git, CI logs, incident docs.
- Ops: CRMs, sheets, ticketing tools.

To answer a non-trivial question like:

> “Who is the best developer to lead the new authentication project, with >3 years of relevant experience, good team feedback, and no critical open bugs?”

Someone has to:
- Manually query multiple tools.
- Stitch context in their head.
- Justify the final choice without a clear audit trail.

Existing chatbots:
- Work over a **single** vector store or DB.
- Don’t resolve entities across systems.
- Don’t keep a **decision context** or log outcomes.
- Don’t explain *why* one option is ranked over another.

**MERIDIAN** solves this.

---

## 2. What MERIDIAN Does

High-level capabilities:

- **Multi-source orchestration**  
  One natural language question → parallel queries over multiple data sources (MongoDB, Jira, REST APIs, etc.).

- **Entity resolution**  
  Unifies “John Smith” from ATS, `john.smith` from Jira, and `john_s` from Slack into a single canonical entity with confidence scores.

- **Constraint-aware reasoning**  
  Applies constraints like “salary < 80k” or “>3 years experience” across *all* relevant sources and re-plans queries when constraints change.

- **Explainable ranking**  
  Returns a ranked list of options (e.g., candidates, engineers, vendors) with an evidence trail: which data source contributed what, and how it affected the score.

- **Decision logging & learning**  
  Logs decisions and later outcomes (“we hired John; performance excellent”), so the system can learn which signals predict good decisions.

This is not a ChatGPT wrapper; it is a **system for reasoning over messy, distributed operational data.**

---

## 3. Why It’s Novel / Patent-Worthy

MERIDIAN’s novelty is in **how** it reasons across heterogeneous sources, not in using an LLM per se.

Key innovations:

1. **Entity-agnostic multi-database orchestration**
   - Dynamic query planning over multiple, schema-divergent sources.
   - No rigid ETL; uses adapters and schemas discovered at runtime.

2. **Fuzzy entity deduplication with feedback loop**
   - Uses name similarity (e.g., Levenshtein), email/phone, and other metadata to map entities that represent the same person/object.
   - Incorporates user corrections to improve future mappings.

3. **Cross-source constraint propagation**
   - A single constraint (e.g., “salary < 80k”) is propagated across all relevant sources and only re-queries what actually changed when constraints are edited.

4. **Explainability trace-back**
   - Every ranked option has a provenance breakdown: which fields from which source contributed to which criterion and by how much.

5. **Outcome-driven learning**
   - Decisions and outcomes are logged; over time, the ranking weights can be adapted to the patterns that predict successful outcomes in that specific org.

These form the core of what could underpin a patent claim.

---

## 4. High-Level Architecture

```text
User (Chat UI)
    │
    ▼
[NLP Layer]
  - Intent recognition (search / compare / recommend / analyze)
  - Entity and constraint extraction
    │
    ▼
[Query Planner]
  - Maps intent + constraints → execution plan over sources
  - Chooses which adapters to call, with what queries
    │
    ▼
[Query Executor]
  - Parallel execution across source adapters
  - Handles partial failures, timeouts
    │
    ▼
[Entity Resolution]
  - Deduplicates entities from different sources
  - Builds/uses canonical IDs
    │
    ▼
[Ranking & Explanation]
  - Scores each option against criteria
  - Builds evidence trail (provenance)
    │
    ▼
Chat UI (React)
  - Shows ranked options
  - Interactive filters & “what-if” tweaks
  - Evidence drill-down
```

Tech stack:

- **Frontend**: React + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **DB**: MongoDB
- **AI/LLM**: Abstracted behind an “AI Service” (can be OpenAI, local model, etc.)

---

## 5. Core Features (MVP Scope)

### 5.1 Source Configuration & Adapters

Each external system (Jira, internal Mongo, Airtable, generic REST) is represented as a **DataSource** with:

```ts
type SourceType = 'jira' | 'mongodb' | 'airtable' | 'rest' | 'slack';
```

For each `DataSource`, an adapter implements a common interface:

- `connect() / disconnect()`
- `getSchema()`
- `queryEntity(constraints, fields)`
- `search(term, fields)`
- `getEntity(id)`

This makes the AI layer **source-agnostic**.

### 5.2 Entity Resolution

Goal: unify records like:

- Jira user: `{ name: "John Smith", email: "john@company.com" }`
- ATS candidate: `{ full_name: "John A. Smith", email: "john@company.com" }`
- Slack user: `{ handle: "john_s", display_name: "john_s" }`

Approach:

- Compute similarity using:
  - Levenshtein similarity on names.
  - Exact match on email/phone when available.
- If similarity > threshold → same canonical entity.
- Persist mappings:

```json
{
  "canonicalId": "person:john.smith@company.com",
  "mappings": {
    "jira-prod": "user-123",
    "ats": "cand-456",
    "slack": "U789"
  },
  "metadata": {
    "email": "john.smith@company.com",
    "name": "John Smith"
  },
  "confidence": 0.95
}
```

### 5.3 Multi-Source Query Orchestration

Example query:

> “Show me developers who worked on authentication in the last 3 months, have no open P1 bugs, and salary < 80k.”

Planner:

- Determines relevant sources: Jira (issues), Bug tracker, HR DB.
- Builds per-source constraint sets.
- Creates an execution plan: which sources, in which priority, with what constraints.

Executor:

- Executes all critical source queries in parallel.
- Collects raw results and normalizes them.
- Handles partial failures (e.g., HR DB down → still show partial insights with warnings).

### 5.4 Ranking & Explanation

Each potential option (e.g., candidate) has:

- A set of criteria (experience, salary, bug count, sentiment).
- A score per criterion.
- A weighted total score.

UI shows:

- Top N results with overall score.
- On click, an **evidence panel**:
  - Data fields from each source.
  - How they impacted the score.
  - Which constraints they satisfied/violated.

### 5.5 Decision Logging & Learning

When the user “commits” a decision (e.g., “Hire John Smith”):

- Store:
  - Question/context
  - Constraints at that time
  - Ranked options
  - Chosen option
  - Reasoning summary

Later, the user can log outcomes (“John shipped 3 features; team feedback excellent”), enabling:

- Retrospective analysis.
- Adjusting ranking weights in the future.

---

## 6. Data Model (MongoDB – Sketch)

Collections:

- `data_sources` – connection info + schemas.
- `entity_mappings` – canonical IDs and mappings.
- `queries` – past user queries + plans + raw results (for debugging).
- `decisions` – logged decisions + outcomes.
- `interaction_logs` – conversation history (for learning/analytics).

(You can flesh out exact schemas as you implement.)

---

## 7. Backend Responsibilities

**Node.js + Express + TypeScript**

- Expose a clean REST API (or GraphQL, if you prefer) for:
  - `/api/sources` – CRUD for data sources.
  - `/api/chat/query` – main chat endpoint.
  - `/api/decisions` – decision logging.
- Implement:
  - Adapter layer per source.
  - Query planner & executor.
  - Entity deduplicator (Levenshtein + rule-based logic).
  - Ranking engine and explanation builder.
- Abstract AI provider:
  - `aiService.generatePlan(...)`
  - `aiService.summarizeExplanation(...)`
  so you can swap LLMs easily.

Security & infra (for production polish):

- JWT-based auth.
- Encrypted storage for API keys.
- Rate limiting, logging, basic observability.

---

## 8. Frontend Responsibilities

**React + TypeScript**

Core pieces:

1. **Chat / Conversation pane**
   - Shows conversation with the assistant.
   - Displays quick suggestions (“Do you want to filter by salary?”).
   - Sends messages to `/api/chat/query`.

2. **Context sidebar**
   - Active constraints as removable “chips.”
   - Connected data sources & their status.
   - Summary of current decision context.

3. **Results viewer**
   - Card/list view of ranked options.
   - Sort by score / name / custom criteria.

4. **Evidence / Explainability panel**
   - Source breakdown for each result.
   - Constraint match indicators (✓ / ✗).
   - Confidence visualization (e.g., circular progress).

5. **Decision log**
   - List of past decisions.
   - Filter by status or outcome.
   - Click to see the context in which the decision was made.

The UI should feel **futuristic and premium**: think glassmorphism, smooth transitions, subtle motion when queries execute.

---

## 9. Feature Breakdown (Student / MVP Scope)

You can scope phases roughly as:

**Phase 1 (Weeks 1–2): Foundations**
- Basic Express API.
- MongoDB connection.
- Simple Jira + Mongo adapter.
- Hard-coded example query orchestrated across two sources.

**Phase 2 (Week 3): Entity Resolution**
- Implement entity mapping & deduplication.
- Store canonical IDs.
- Show merged entities in API responses.

**Phase 3 (Week 4): Conversational Layer**
- Simple intent detection (regex / heuristic).
- Constraint extraction (e.g., “>3 years”, “<80k”).
- Chat UI in React wired to backend.

**Phase 4 (Week 5): Ranking & Explainability**
- Criterion-based scoring.
- Evidence panel in UI.
- Confidence display.

**Phase 5 (Week 6): Decision Logging & Polish**
- Decision log API and UI.
- Outcome capture.
- Small UX refinements and performance tweaks.

---

## 10. What’s Patentable Here?

If you wanted to argue for IP/patentability, your focus would be on:

1. **Protocol for multi-source orchestration**
   - How user intent is decomposed into per-source query plans and recomposed into a coherent answer.

2. **Entity resolution + constraint propagation**
   - Same canonical entity across systems.
   - Constraints that span sources and trigger partial re-plans.

3. **Explainability trace-back**
   - A consistent mechanism to map final ranked decisions back to per-source evidence with confidence.

4. **Outcome-driven model adaptation**
   - System that tunes its own ranking criteria based on historical decision outcomes in a particular org context.

Even if you don’t file anything, this is **excellent interview and portfolio material**.

---

## 11. Setup (Skeleton Instructions)

You can adapt this to your own preference; here’s a quick outline.

### Backend

```bash
mkdir backend && cd backend
npm init -y
npm install express cors mongoose dotenv
npm install typescript ts-node-dev @types/node @types/express --save-dev

npx tsc --init
```

Structure:

```text
backend/
  src/
    index.ts
    routes/
    services/
    models/
    types/
```

### Frontend

```bash
npx create-react-app frontend --template typescript
cd frontend
npm install axios
```

Structure:

```text
frontend/
  src/
    components/
    hooks/
    services/
    types/
```

Wire `/api/chat/query` from frontend to backend and iterate.

---
