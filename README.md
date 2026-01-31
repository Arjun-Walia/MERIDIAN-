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
