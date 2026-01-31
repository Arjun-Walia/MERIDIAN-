<div align="center">

<img src="logo/logo.png" alt="MERIDIAN Logo" width="180"/>

# 🌐 MERIDIAN

### Multi-Source AI Decision Assistant

_MERN + TypeScript · Agentic Orchestration · Multi-DB Reasoning_

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

---

**MERIDIAN** is an advanced, production-grade chatbot system that connects to multiple heterogeneous data sources (Jira, MongoDB, ATS, Slack, etc.), unifies entities across them, and answers high-stakes decision queries with **ranked, explainable recommendations** instead of simple Q&A.

> 💡 Think of it as an **intelligent data fabric + reasoning layer** you query via chat.

[🎯 Problem](#-problem--motivation) • [🚀 Features](#-what-meridian-does) • [🏗️ Architecture](#-high-level-architecture) • [⚙️ Setup](#-setup) • [📍 Roadmap](#-feature-breakdown)

</div>

---

## 📑 Table of Contents

- [🎯 Problem & Motivation](#-problem--motivation)
- [🚀 What MERIDIAN Does](#-what-meridian-does)
- [💡 Why It's Novel](#-why-its-novel--patent-worthy)
- [🏗️ High-Level Architecture](#-high-level-architecture)
- [⭐ Core Features](#-core-features-mvp-scope)
- [🗄️ Data Model](#-data-model-mongodb--sketch)
- [🖥️ Backend Responsibilities](#-backend-responsibilities)
- [🎨 Frontend Responsibilities](#-frontend-responsibilities)
- [📍 Feature Breakdown](#-feature-breakdown-student--mvp-scope)
- [📜 What's Patentable](#-whats-patentable-here)
- [⚙️ Setup](#-setup-skeleton-instructions)

---

## 🎯 Problem & Motivation

Modern teams run on **fragmented tools**:

```mermaid
graph LR
    subgraph "🏢 Modern Organization"
        A["👥 Hiring"] --> A1[ATS]
        A --> A2[Excel]
        A --> A3[Email]
        A --> A4[Slack]
        
        B["💻 Engineering"] --> B1[Jira]
        B --> B2[Git]
        B --> B3[CI Logs]
        B --> B4[Incident Docs]
        
        C["📊 Operations"] --> C1[CRMs]
        C --> C2[Sheets]
        C --> C3[Ticketing]
    end
    
    style A fill:#e1f5fe
    style B fill:#fff3e0
    style C fill:#e8f5e9
```

<details>
<summary>📋 <b>Example Complex Query</b> (click to expand)</summary>

<br/>

> *"Who is the best developer to lead the new authentication project, with >3 years of relevant experience, good team feedback, and no critical open bugs?"*

**To answer this manually, someone must:**
1. Query multiple tools one by one
2. Stitch context together in their head
3. Justify the final choice without clear evidence

</details>

<br/>

### ❌ The Problem with Current Solutions

<table>
<tr>
<th>❌ Current Pain Points</th>
<th>❌ Existing Chatbot Limitations</th>
</tr>
<tr>
<td>

| Challenge | Description |
|-----------|-------------|
| 🔍 Manual Queries | Query multiple tools one by one |
| 🧠 Mental Stitching | Stitch context in your head |
| 📝 No Audit Trail | Justify choices without evidence |

</td>
<td>

| Limitation | Impact |
|------------|--------|
| Single DB only | Can't aggregate across tools |
| No entity resolution | Same person = different records |
| No decision context | Forgets past interactions |
| No explainability | Black-box answers |

</td>
</tr>
</table>

### ✅ MERIDIAN Solves This!

---

## 🚀 What MERIDIAN Does

<table>
<tr>
<td width="50%" valign="top">

### 🔗 Multi-Source Orchestration
One natural language question → parallel queries over multiple data sources (MongoDB, Jira, REST APIs, etc.).

</td>
<td width="50%" valign="top">

### 🆔 Entity Resolution
Unifies "John Smith" from ATS, `john.smith` from Jira, and `john_s` from Slack into a single canonical entity with confidence scores.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🎛️ Constraint-Aware Reasoning
Applies constraints like "salary < 80k" or ">3 years experience" across *all* relevant sources and re-plans queries when constraints change.

</td>
<td width="50%" valign="top">

### 📊 Explainable Ranking
Returns a ranked list of options with an evidence trail: which data source contributed what, and how it affected the score.

</td>
</tr>
<tr>
<td colspan="2" align="center">

### 📚 Decision Logging & Learning
Logs decisions and later outcomes ("we hired John; performance excellent"), so the system can learn which signals predict good decisions.

</td>
</tr>
</table>

> ⚠️ **This is not a ChatGPT wrapper** — it is a **system for reasoning over messy, distributed operational data.**

### 🔄 Data Flow Overview

```mermaid
flowchart LR
    Q["🗣️ Natural Language<br/>Query"] --> M["🌐 MERIDIAN<br/>Engine"]
    
    M --> S1[("📋 Jira")]
    M --> S2[("🗄️ MongoDB")]
    M --> S3[("📧 Slack")]
    M --> S4[("👔 ATS")]
    
    S1 --> ER["🔗 Entity<br/>Resolution"]
    S2 --> ER
    S3 --> ER
    S4 --> ER
    
    ER --> R["📊 Ranked Results<br/>+ Explanations"]
    
    style M fill:#4fc3f7,stroke:#0288d1,stroke-width:2px
    style R fill:#81c784,stroke:#388e3c,stroke-width:2px
```

---

## 💡 Why It's Novel / Patent-Worthy

MERIDIAN's novelty is in **how** it reasons across heterogeneous sources, not in using an LLM per se.

```mermaid
mindmap
  root(("🌐 MERIDIAN<br/>Innovation"))
    🔌 Multi-DB Orchestration
      Dynamic query planning
      Runtime schema discovery
      No rigid ETL
    🆔 Fuzzy Entity Dedup
      Levenshtein similarity
      Email/phone matching
      User feedback loop
    🎯 Constraint Propagation
      Cross-source constraints
      Partial re-planning
      Smart invalidation
    📋 Explainability
      Provenance breakdown
      Per-source evidence
      Confidence scores
    📈 Outcome Learning
      Decision logging
      Pattern recognition
      Adaptive weights
```

### 🏆 Key Innovations

| # | Innovation | Description |
|:-:|------------|-------------|
| 1️⃣ | **Entity-agnostic multi-database orchestration** | Dynamic query planning over multiple, schema-divergent sources. No rigid ETL; uses adapters and schemas discovered at runtime. |
| 2️⃣ | **Fuzzy entity deduplication with feedback loop** | Uses name similarity (Levenshtein), email/phone, and metadata to map entities. Incorporates user corrections to improve future mappings. |
| 3️⃣ | **Cross-source constraint propagation** | A single constraint (e.g., "salary < 80k") propagates across all sources and only re-queries what actually changed. |
| 4️⃣ | **Explainability trace-back** | Every ranked option has a provenance breakdown: which fields from which source contributed to which criterion. |
| 5️⃣ | **Outcome-driven learning** | Decisions and outcomes are logged; ranking weights adapt to patterns that predict successful outcomes. |

> 📜 These innovations form the core of what could underpin a **patent claim**.

---

## 🏗️ High-Level Architecture

```mermaid
flowchart TB
    subgraph "👤 User Layer"
        UI["🖥️ Chat UI<br/>(React + TypeScript)"]
    end
    
    subgraph "🧠 Intelligence Layer"
        NLP["🗣️ NLP Layer<br/>Intent Recognition<br/>Entity Extraction"]
        QP["📋 Query Planner<br/>Maps intent → execution plan"]
        QE["⚡ Query Executor<br/>Parallel execution<br/>Handles failures"]
    end
    
    subgraph "🔗 Integration Layer"
        ER["🆔 Entity Resolution<br/>Deduplication<br/>Canonical IDs"]
        RE["📊 Ranking Engine<br/>Scoring & Evidence"]
    end
    
    subgraph "🔌 Adapters"
        AD1["Jira Adapter"]
        AD2["MongoDB Adapter"]
        AD3["Slack Adapter"]
        AD4["REST Adapter"]
    end
    
    subgraph "💾 Data Sources"
        DS1[("📋 Jira")]
        DS2[("🗄️ MongoDB")]
        DS3[("📧 Slack")]
        DS4[("🌐 REST APIs")]
    end
    
    UI <--> NLP
    NLP --> QP
    QP --> QE
    QE --> AD1 & AD2 & AD3 & AD4
    AD1 <--> DS1
    AD2 <--> DS2
    AD3 <--> DS3
    AD4 <--> DS4
    AD1 & AD2 & AD3 & AD4 --> ER
    ER --> RE
    RE --> UI
    
    style UI fill:#e3f2fd,stroke:#1976d2
    style NLP fill:#fff3e0,stroke:#f57c00
    style QP fill:#fff3e0,stroke:#f57c00
    style QE fill:#fff3e0,stroke:#f57c00
    style ER fill:#e8f5e9,stroke:#388e3c
    style RE fill:#e8f5e9,stroke:#388e3c
```

### 🛠️ Tech Stack

<table>
<tr>
<td align="center"><img src="https://img.icons8.com/color/48/000000/react-native.png" width="40"/><br/><b>React</b><br/>Frontend</td>
<td align="center"><img src="https://img.icons8.com/color/48/000000/typescript.png" width="40"/><br/><b>TypeScript</b><br/>Language</td>
<td align="center"><img src="https://img.icons8.com/color/48/000000/nodejs.png" width="40"/><br/><b>Node.js</b><br/>Backend</td>
<td align="center"><img src="https://img.icons8.com/ios/50/000000/express-js.png" width="40"/><br/><b>Express</b><br/>API</td>
<td align="center"><img src="https://img.icons8.com/color/48/000000/mongodb.png" width="40"/><br/><b>MongoDB</b><br/>Database</td>
<td align="center"><img src="https://img.icons8.com/color/48/000000/artificial-intelligence.png" width="40"/><br/><b>AI/LLM</b><br/>Abstracted</td>
</tr>
</table>

---

## ⭐ Core Features (MVP Scope)

### 📡 5.1 Source Configuration & Adapters

Each external system (Jira, internal Mongo, Airtable, generic REST) is represented as a **DataSource**:

```typescript
type SourceType = 'jira' | 'mongodb' | 'airtable' | 'rest' | 'slack';
```

<details>
<summary>📖 <b>Adapter Interface</b> (click to expand)</summary>

```typescript
interface SourceAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getSchema(): Promise<Schema>;
  queryEntity(constraints: Constraint[], fields: string[]): Promise<Entity[]>;
  search(term: string, fields: string[]): Promise<Entity[]>;
  getEntity(id: string): Promise<Entity>;
}
```

</details>

> 🔌 This makes the AI layer **source-agnostic**.

---

### 🆔 5.2 Entity Resolution

**Goal:** Unify records across systems representing the same entity.

```mermaid
flowchart LR
    subgraph "📋 Jira"
        J["name: 'John Smith'<br/>email: john@company.com"]
    end
    
    subgraph "👔 ATS"
        A["full_name: 'John A. Smith'<br/>email: john@company.com"]
    end
    
    subgraph "📧 Slack"
        S["handle: 'john_s'<br/>display: 'john_s'"]
    end
    
    J --> ER["🔗 Entity<br/>Resolution"]
    A --> ER
    S --> ER
    
    ER --> C["🆔 Canonical Entity<br/>ID: person:john.smith@company.com<br/>Confidence: 95%"]
    
    style C fill:#c8e6c9,stroke:#388e3c,stroke-width:2px
```

**Approach:**
- ✅ Levenshtein similarity on names
- ✅ Exact match on email/phone when available
- ✅ Threshold-based matching
- ✅ Persistent mappings with confidence scores

<details>
<summary>📖 <b>Entity Mapping Schema</b></summary>

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

</details>

---

### 🔄 5.3 Multi-Source Query Orchestration

**Example Query:**
> "Show me developers who worked on authentication in the last 3 months, have no open P1 bugs, and salary < 80k."

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant P as 📋 Query Planner
    participant E as ⚡ Executor
    participant J as 📋 Jira
    participant B as 🐛 Bug Tracker
    participant H as 👔 HR DB
    
    U->>P: Natural language query
    P->>P: Parse constraints & sources
    
    par Parallel Execution
        P->>E: Execute plan
        E->>J: Query auth issues (3 months)
        E->>B: Query P1 bugs
        E->>H: Query salary < 80k
    end
    
    J-->>E: Developer list
    B-->>E: Bug assignments
    H-->>E: Salary data
    
    E->>E: Normalize & merge results
    E->>U: Ranked candidates + evidence
```

**Key Capabilities:**
| Feature | Description |
|---------|-------------|
| 🎯 Smart Planning | Determines relevant sources per constraint |
| ⚡ Parallel Execution | Queries all sources simultaneously |
| 🛡️ Fault Tolerance | Handles partial failures gracefully |

---

### 📊 5.4 Ranking & Explanation

Each option is scored across multiple criteria:

```mermaid
graph TD
    subgraph "📊 Scoring Engine"
        C1["Experience<br/>Weight: 30%"]
        C2["Salary Fit<br/>Weight: 25%"]
        C3["Bug Count<br/>Weight: 25%"]
        C4["Team Sentiment<br/>Weight: 20%"]
    end
    
    C1 --> S["⭐ Total Score: 87%"]
    C2 --> S
    C3 --> S
    C4 --> S
    
    S --> E["📋 Evidence Panel<br/>• Data fields from each source<br/>• Impact on score<br/>• Constraints satisfied ✓/✗"]
    
    style S fill:#fff59d,stroke:#f9a825,stroke-width:2px
    style E fill:#e1f5fe,stroke:#0288d1,stroke-width:2px
```

---

### 📝 5.5 Decision Logging & Learning

```mermaid
flowchart LR
    subgraph "📝 Decision Capture"
        D1["Query/Context"]
        D2["Constraints"]
        D3["Ranked Options"]
        D4["Chosen Option"]
        D5["Reasoning"]
    end
    
    D1 & D2 & D3 & D4 & D5 --> LOG[("💾 Decision Log")]
    
    LOG --> O["📈 Outcome Tracking<br/>'John shipped 3 features'<br/>'Team feedback: excellent'"]
    
    O --> L["🧠 Learning<br/>Adjust ranking weights<br/>Improve predictions"]
    
    L -.->|Feedback Loop| D1
    
    style LOG fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    style L fill:#fff3e0,stroke:#f57c00,stroke-width:2px
```

---

## 🗄️ Data Model (MongoDB – Sketch)

```mermaid
erDiagram
    DATA_SOURCES {
        ObjectId _id
        string name
        string type
        object connectionConfig
        object schema
        datetime lastSync
    }
    
    ENTITY_MAPPINGS {
        ObjectId _id
        string canonicalId
        object mappings
        object metadata
        float confidence
    }
    
    QUERIES {
        ObjectId _id
        string rawQuery
        object parsedIntent
        object executionPlan
        array results
        datetime timestamp
    }
    
    DECISIONS {
        ObjectId _id
        ObjectId queryId
        object constraints
        array rankedOptions
        object chosenOption
        string reasoning
        object outcome
    }
    
    INTERACTION_LOGS {
        ObjectId _id
        string sessionId
        array messages
        datetime createdAt
    }
    
    QUERIES ||--o{ DECISIONS : "leads to"
    DECISIONS }|--|| INTERACTION_LOGS : "part of"
```

---

## 🖥️ Backend Responsibilities

**Node.js + Express + TypeScript**

### 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/sources` | GET, POST, PUT, DELETE | CRUD for data sources |
| `/api/chat/query` | POST | Main chat endpoint |
| `/api/decisions` | GET, POST | Decision logging |
| `/api/entities` | GET | Entity resolution info |

### 🏗️ Core Services

```mermaid
graph TD
    subgraph "🖥️ Backend Services"
        A[Adapter Layer] --> B[Query Planner]
        B --> C[Query Executor]
        C --> D[Entity Deduplicator]
        D --> E[Ranking Engine]
        E --> F[Explanation Builder]
    end
    
    G[AI Service] -.-> B
    G -.-> F
    
    style G fill:#e1f5fe,stroke:#0288d1,stroke-width:2px
```

### 🔐 Security & Infrastructure

| Feature | Implementation |
|---------|----------------|
| 🔑 Authentication | JWT-based auth |
| 🔒 API Keys | Encrypted storage |
| 🛡️ Rate Limiting | Express middleware |
| 📊 Observability | Logging & metrics |

---

## 🎨 Frontend Responsibilities

**React + TypeScript**

### 📐 UI Components

```mermaid
graph TB
    subgraph "🎨 Frontend Architecture"
        A["💬 Chat Pane<br/>Conversation view<br/>Quick suggestions"]
        B["📋 Context Sidebar<br/>Active constraints<br/>Data source status"]
        C["📊 Results Viewer<br/>Ranked cards<br/>Sort & filter"]
        D["🔍 Evidence Panel<br/>Source breakdown<br/>Confidence viz"]
        E["📝 Decision Log<br/>History view<br/>Outcome tracking"]
    end
    
    A <--> B
    A --> C
    C --> D
    A --> E
    
    style A fill:#e3f2fd
    style C fill:#e8f5e9
    style D fill:#fff3e0
```

### 🎯 UI/UX Goals

<table>
<tr>
<td>🎨 <b>Glassmorphism</b></td>
<td>Modern, translucent UI elements</td>
</tr>
<tr>
<td>✨ <b>Smooth Transitions</b></td>
<td>Fluid animations between states</td>
</tr>
<tr>
<td>🔄 <b>Motion Feedback</b></td>
<td>Subtle loading indicators during queries</td>
</tr>
<tr>
<td>📱 <b>Responsive</b></td>
<td>Works across desktop and tablet</td>
</tr>
</table>

---

## 📍 Feature Breakdown (Student / MVP Scope)

```mermaid
gantt
    title 📅 MERIDIAN Development Roadmap
    dateFormat  YYYY-MM-DD
    section Phase 1
    Basic Express API          :p1a, 2025-01-01, 7d
    MongoDB Connection         :p1b, after p1a, 3d
    Jira + Mongo Adapters      :p1c, after p1b, 4d
    section Phase 2
    Entity Mapping             :p2a, after p1c, 4d
    Deduplication Logic        :p2b, after p2a, 3d
    section Phase 3
    Intent Detection           :p3a, after p2b, 3d
    Constraint Extraction      :p3b, after p3a, 2d
    Chat UI (React)            :p3c, after p3b, 2d
    section Phase 4
    Criterion Scoring          :p4a, after p3c, 3d
    Evidence Panel             :p4b, after p4a, 2d
    Confidence Display         :p4c, after p4b, 2d
    section Phase 5
    Decision Log API           :p5a, after p4c, 2d
    Outcome Capture            :p5b, after p5a, 2d
    UX Polish                  :p5c, after p5b, 3d
```

### 📋 Phase Details

<details>
<summary><b>🔹 Phase 1 (Weeks 1–2): Foundations</b></summary>

- ✅ Basic Express API
- ✅ MongoDB connection
- ✅ Simple Jira + Mongo adapter
- ✅ Hard-coded example query orchestrated across two sources

</details>

<details>
<summary><b>🔹 Phase 2 (Week 3): Entity Resolution</b></summary>

- ✅ Implement entity mapping & deduplication
- ✅ Store canonical IDs
- ✅ Show merged entities in API responses

</details>

<details>
<summary><b>🔹 Phase 3 (Week 4): Conversational Layer</b></summary>

- ✅ Simple intent detection (regex / heuristic)
- ✅ Constraint extraction (e.g., ">3 years", "<80k")
- ✅ Chat UI in React wired to backend

</details>

<details>
<summary><b>🔹 Phase 4 (Week 5): Ranking & Explainability</b></summary>

- ✅ Criterion-based scoring
- ✅ Evidence panel in UI
- ✅ Confidence display

</details>

<details>
<summary><b>🔹 Phase 5 (Week 6): Decision Logging & Polish</b></summary>

- ✅ Decision log API and UI
- ✅ Outcome capture
- ✅ Small UX refinements and performance tweaks

</details>

---

## 📜 What's Patentable Here?

<table>
<tr>
<th>Innovation</th>
<th>Description</th>
<th>Patent Relevance</th>
</tr>
<tr>
<td>🔄 <b>Multi-source orchestration protocol</b></td>
<td>How user intent is decomposed into per-source query plans and recomposed into a coherent answer</td>
<td>⭐⭐⭐⭐⭐</td>
</tr>
<tr>
<td>🆔 <b>Entity resolution + constraint propagation</b></td>
<td>Same canonical entity across systems with constraints that span sources</td>
<td>⭐⭐⭐⭐</td>
</tr>
<tr>
<td>📋 <b>Explainability trace-back</b></td>
<td>Consistent mechanism to map final ranked decisions back to per-source evidence with confidence</td>
<td>⭐⭐⭐⭐</td>
</tr>
<tr>
<td>📈 <b>Outcome-driven model adaptation</b></td>
<td>System that tunes its own ranking criteria based on historical decision outcomes</td>
<td>⭐⭐⭐⭐⭐</td>
</tr>
</table>

> 💼 Even if you don't file anything, this is **excellent interview and portfolio material**.

---

## ⚙️ Setup (Skeleton Instructions)

### 📦 Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### 🖥️ Backend Setup

```bash
# Create and navigate to backend directory
mkdir backend && cd backend

# Initialize project
npm init -y

# Install dependencies
npm install express cors mongoose dotenv

# Install dev dependencies
npm install typescript ts-node-dev @types/node @types/express --save-dev

# Initialize TypeScript
npx tsc --init
```

<details>
<summary>📁 <b>Backend Structure</b></summary>

```
backend/
├── src/
│   ├── index.ts
│   ├── routes/
│   │   ├── sources.ts
│   │   ├── chat.ts
│   │   └── decisions.ts
│   ├── services/
│   │   ├── aiService.ts
│   │   ├── queryPlanner.ts
│   │   └── entityResolver.ts
│   ├── adapters/
│   │   ├── jiraAdapter.ts
│   │   ├── mongoAdapter.ts
│   │   └── slackAdapter.ts
│   ├── models/
│   │   └── ...
│   └── types/
│       └── ...
├── package.json
└── tsconfig.json
```

</details>

### 🎨 Frontend Setup

```bash
# Create React app with TypeScript
npx create-react-app frontend --template typescript

# Navigate to frontend
cd frontend

# Install dependencies
npm install axios
```

<details>
<summary>📁 <b>Frontend Structure</b></summary>

```
frontend/
├── src/
│   ├── components/
│   │   ├── ChatPane/
│   │   ├── ContextSidebar/
│   │   ├── ResultsViewer/
│   │   ├── EvidencePanel/
│   │   └── DecisionLog/
│   ├── hooks/
│   │   └── useChat.ts
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── index.tsx
├── package.json
└── tsconfig.json
```

</details>

### 🚀 Quick Start

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm start
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ for intelligent decision-making**

[⬆ Back to Top](#-meridian)

</div>
