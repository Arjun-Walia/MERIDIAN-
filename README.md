# MERIDIAN

![MERIDIAN Logo](logo/logo.png)

## Multi-Source AI Decision Assistant

MERN + TypeScript · Agentic Orchestration · Multi-DB Reasoning

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

---

**MERIDIAN** is an advanced, production-grade chatbot system that connects to multiple heterogeneous data sources (Jira, MongoDB, ATS, Slack, etc.), unifies entities across them, and answers high-stakes decision queries with **ranked, explainable recommendations** instead of simple Q&A.

> Think of it as an _intelligent data fabric + reasoning layer_ you query via chat.

---

## Table of Contents

- [Problem and Motivation](#problem-and-motivation)
- [What MERIDIAN Does](#what-meridian-does)
- [High-Level Architecture](#high-level-architecture)
- [Core Features](#core-features)
- [Data Model](#data-model)
- [Backend Responsibilities](#backend-responsibilities)
- [Frontend Responsibilities](#frontend-responsibilities)
- [Setup](#setup)
- [License](#license)

---

## Problem and Motivation

Modern teams run on **fragmented tools**:

```mermaid
graph LR
    subgraph "Modern Organization"
        A["Hiring"] --> A1[ATS]
        A --> A2[Excel]
        A --> A3[Email]
        A --> A4[Slack]
        
        B["Engineering"] --> B1[Jira]
        B --> B2[Git]
        B --> B3[CI Logs]
        B --> B4[Incident Docs]
        
        C["Operations"] --> C1[CRMs]
        C --> C2[Sheets]
        C --> C3[Ticketing]
    end
    
    style A fill:#e1f5fe
    style B fill:#fff3e0
    style C fill:#e8f5e9
```

### Example Complex Query

> _"Who is the best developer to lead the new authentication project, with >3 years of relevant experience, good team feedback, and no critical open bugs?"_

**To answer this manually, someone must:**

1. Query multiple tools one by one
2. Stitch context together in their head
3. Justify the final choice without clear evidence

### The Problem with Current Solutions

**Current Pain Points:**

| Challenge | Description |
| --------- | ----------- |
| Manual Queries | Query multiple tools one by one |
| Mental Stitching | Stitch context in your head |
| No Audit Trail | Justify choices without evidence |

**Existing Chatbot Limitations:**

| Limitation | Impact |
| ---------- | ------ |
| Single DB only | Can't aggregate across tools |
| No entity resolution | Same person = different records |
| No decision context | Forgets past interactions |
| No explainability | Black-box answers |

### MERIDIAN Solves This

---

## What MERIDIAN Does

### Multi-Source Orchestration

One natural language question → parallel queries over multiple data sources (MongoDB, Jira, REST APIs, etc.).

### Entity Resolution

Unifies "John Smith" from ATS, `john.smith` from Jira, and `john_s` from Slack into a single canonical entity with confidence scores.

### Constraint-Aware Reasoning

Applies constraints like "salary < 80k" or ">3 years experience" across _all_ relevant sources and re-plans queries when constraints change.

### Explainable Ranking

Returns a ranked list of options with an evidence trail: which data source contributed what, and how it affected the score.

### Decision Logging and Learning

Logs decisions and later outcomes ("we hired John; performance excellent"), so the system can learn which signals predict good decisions.

> **This is not a ChatGPT wrapper** — it is a _system for reasoning over messy, distributed operational data._

### Data Flow Overview

```mermaid
flowchart LR
    Q["Natural Language Query"] --> M["MERIDIAN Engine"]
    
    M --> S1[("Jira")]
    M --> S2[("MongoDB")]
    M --> S3[("Slack")]
    M --> S4[("ATS")]
    
    S1 --> ER["Entity Resolution"]
    S2 --> ER
    S3 --> ER
    S4 --> ER
    
    ER --> R["Ranked Results + Explanations"]
    
    style M fill:#4fc3f7,stroke:#0288d1,stroke-width:2px
    style R fill:#81c784,stroke:#388e3c,stroke-width:2px
```

---

## High-Level Architecture

```mermaid
flowchart TB
    subgraph "User Layer"
        UI["Chat UI (React + TypeScript)"]
    end
    
    subgraph "Intelligence Layer"
        NLP["NLP Layer - Intent Recognition, Entity Extraction"]
        QP["Query Planner - Maps intent to execution plan"]
        QE["Query Executor - Parallel execution, Handles failures"]
    end
    
    subgraph "Integration Layer"
        ER["Entity Resolution - Deduplication, Canonical IDs"]
        RE["Ranking Engine - Scoring and Evidence"]
    end
    
    subgraph "Adapters"
        AD1["Jira Adapter"]
        AD2["MongoDB Adapter"]
        AD3["Slack Adapter"]
        AD4["REST Adapter"]
    end
    
    subgraph "Data Sources"
        DS1[("Jira")]
        DS2[("MongoDB")]
        DS3[("Slack")]
        DS4[("REST APIs")]
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

### Tech Stack

| Component | Technology |
| --------- | ---------- |
| Frontend | React |
| Language | TypeScript |
| Backend | Node.js |
| API | Express |
| Database | MongoDB |
| AI/LLM | Abstracted |

---

## Core Features

### Source Configuration and Adapters

Each external system (Jira, internal Mongo, Airtable, generic REST) is represented as a **DataSource**:

```typescript
type SourceType = 'jira' | 'mongodb' | 'airtable' | 'rest' | 'slack';
```

**Adapter Interface:**

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

> This makes the AI layer **source-agnostic**.

---

### Entity Resolution

**Goal:** Unify records across systems representing the same entity.

```mermaid
flowchart LR
    subgraph "Jira"
        J["name: 'John Smith', email: john@company.com"]
    end
    
    subgraph "ATS"
        A["full_name: 'John A. Smith', email: john@company.com"]
    end
    
    subgraph "Slack"
        S["handle: 'john_s', display: 'john_s'"]
    end
    
    J --> ER["Entity Resolution"]
    A --> ER
    S --> ER
    
    ER --> C["Canonical Entity - ID: person:john.smith@company.com, Confidence: 95%"]
    
    style C fill:#c8e6c9,stroke:#388e3c,stroke-width:2px
```

**Approach:**

- Levenshtein similarity on names
- Exact match on email/phone when available
- Threshold-based matching
- Persistent mappings with confidence scores

**Entity Mapping Schema:**

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

---

### Multi-Source Query Orchestration

**Example Query:**

> "Show me developers who worked on authentication in the last 3 months, have no open P1 bugs, and salary < 80k."

```mermaid
sequenceDiagram
    participant U as User
    participant P as Query Planner
    participant E as Executor
    participant J as Jira
    participant B as Bug Tracker
    participant H as HR DB
    
    U->>P: Natural language query
    P->>P: Parse constraints and sources
    
    par Parallel Execution
        P->>E: Execute plan
        E->>J: Query auth issues (3 months)
        E->>B: Query P1 bugs
        E->>H: Query salary < 80k
    end
    
    J-->>E: Developer list
    B-->>E: Bug assignments
    H-->>E: Salary data
    
    E->>E: Normalize and merge results
    E->>U: Ranked candidates + evidence
```

**Key Capabilities:**

| Feature | Description |
| ------- | ----------- |
| Smart Planning | Determines relevant sources per constraint |
| Parallel Execution | Queries all sources simultaneously |
| Fault Tolerance | Handles partial failures gracefully |

---

### Ranking and Explanation

Each option is scored across multiple criteria:

```mermaid
graph TD
    subgraph "Scoring Engine"
        C1["Experience - Weight: 30%"]
        C2["Salary Fit - Weight: 25%"]
        C3["Bug Count - Weight: 25%"]
        C4["Team Sentiment - Weight: 20%"]
    end
    
    C1 --> S["Total Score: 87%"]
    C2 --> S
    C3 --> S
    C4 --> S
    
    S --> E["Evidence Panel: Data fields from each source, Impact on score, Constraints satisfied"]
    
    style S fill:#fff59d,stroke:#f9a825,stroke-width:2px
    style E fill:#e1f5fe,stroke:#0288d1,stroke-width:2px
```

---

### Decision Logging and Learning

```mermaid
flowchart LR
    subgraph "Decision Capture"
        D1["Query/Context"]
        D2["Constraints"]
        D3["Ranked Options"]
        D4["Chosen Option"]
        D5["Reasoning"]
    end
    
    D1 & D2 & D3 & D4 & D5 --> LOG[("Decision Log")]
    
    LOG --> O["Outcome Tracking: 'John shipped 3 features', 'Team feedback: excellent'"]
    
    O --> L["Learning: Adjust ranking weights, Improve predictions"]
    
    L -.->|Feedback Loop| D1
    
    style LOG fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    style L fill:#fff3e0,stroke:#f57c00,stroke-width:2px
```

---

## Data Model

MongoDB Schema (Sketch):

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

## Backend Responsibilities

**Node.js + Express + TypeScript**

### API Endpoints

| Endpoint | Method | Description |
| -------- | ------ | ----------- |
| `/api/sources` | GET, POST, PUT, DELETE | CRUD for data sources |
| `/api/chat/query` | POST | Main chat endpoint |
| `/api/decisions` | GET, POST | Decision logging |
| `/api/entities` | GET | Entity resolution info |

### Core Services

```mermaid
graph TD
    subgraph "Backend Services"
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

### Security and Infrastructure

| Feature | Implementation |
| ------- | -------------- |
| Authentication | JWT-based auth |
| API Keys | Encrypted storage |
| Rate Limiting | Express middleware |
| Observability | Logging and metrics |

---

## Frontend Responsibilities

**React + TypeScript**

### UI Components

```mermaid
graph TB
    subgraph "Frontend Architecture"
        A["Chat Pane - Conversation view, Quick suggestions"]
        B["Context Sidebar - Active constraints, Data source status"]
        C["Results Viewer - Ranked cards, Sort and filter"]
        D["Evidence Panel - Source breakdown, Confidence viz"]
        E["Decision Log - History view, Outcome tracking"]
    end
    
    A <--> B
    A --> C
    C --> D
    A --> E
    
    style A fill:#e3f2fd
    style C fill:#e8f5e9
    style D fill:#fff3e0
```

### UI/UX Goals

| Goal | Description |
| ---- | ----------- |
| Glassmorphism | Modern, translucent UI elements |
| Smooth Transitions | Fluid animations between states |
| Motion Feedback | Subtle loading indicators during queries |
| Responsive | Works across desktop and tablet |

---

## Setup

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

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

**Backend Structure:**

```text
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

### Frontend Setup

```bash
# Create React app with TypeScript
npx create-react-app frontend --template typescript

# Navigate to frontend
cd frontend

# Install dependencies
npm install axios
```

**Frontend Structure:**

```text
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

### Quick Start

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm start
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with love for intelligent decision-making

[Back to Top](#meridian)
