# Architecture Decision Records

## ADR-001: NestJS over Express for Backend
**Date:** June 2026
**Status:** Decided

**Context:** Need a Node.js backend that scales to enterprise complexity.

**Decision:** NestJS with TypeScript.

**Reasons:**
- Built-in DI, modular architecture — easy to add quiz, interview, market-intel modules independently
- TypeScript-native — no separate type setup
- Decorators align with team's Java/Spring background
- Strong Azure ecosystem examples available

**Alternatives considered:** Express (too bare), Fastify (less ecosystem), Hono (too new)

---

## ADR-002: Azure AI Search over Elasticsearch
**Date:** June 2026
**Status:** Decided

**Context:** Need full-text search for modules, interview questions, and job listings.

**Decision:** Azure AI Search (formerly Cognitive Search).

**Reasons:**
- Fully managed — no Elasticsearch cluster to operate
- Native Azure integration — RBAC, Private Endpoint, Key Vault
- Semantic search built-in for "find modules similar to AKS networking"
- Simpler pricing for early-stage SaaS

**Alternatives considered:** Elasticsearch on AKS (operational overhead), OpenSearch (same problem)

---

## ADR-003: LangGraph for AI Agents
**Date:** June 2026
**Status:** Decided

**Context:** AI mentor needs stateful multi-turn interview sessions and multi-step JD analysis.

**Decision:** LangGraph (Python) for all agent workflows.

**Reasons:**
- Vikram already uses LangGraph in SevaFirst project — reuse patterns
- Stateful graph model maps directly to interview state machine
- Stream support for WebSocket responses
- Azure OpenAI compatible

**Alternatives considered:** LangChain chains (no state), AutoGen (overkill), plain API calls (no retry/routing)

---

## ADR-004: PostgreSQL over Cosmos DB
**Date:** June 2026
**Status:** Decided

**Context:** Primary data store choice.

**Decision:** Azure Database for PostgreSQL Flexible Server.

**Reasons:**
- User progress, modules, quiz scores — relational data, JOINs matter
- JSONB for flexible fields (skills arrays, interview transcripts)
- Lower cost than Cosmos DB for early stage
- Azure Flexible Server = managed, private VNET, zone-redundant

**Alternatives considered:** Cosmos DB (overkill cost, eventual consistency for scores), MongoDB (less native Azure integration)

---

## ADR-005: Playwright over Puppeteer for Crawlers
**Date:** June 2026
**Status:** Decided

**Context:** Need to crawl LinkedIn which requires JavaScript rendering.

**Decision:** Playwright (Chromium headless).

**Reasons:**
- Auto-wait for dynamic content — no manual `waitForSelector` everywhere
- Better stealth options vs Puppeteer
- TypeScript-native
- Same library supports Chrome/Firefox/WebKit for fallback

---

## ADR-006: Key Vault CSI Driver over Pod Environment Variables
**Date:** June 2026
**Status:** Decided

**Context:** How to inject secrets into AKS pods.

**Decision:** Azure Key Vault CSI driver with system-assigned kubelet identity.

**Reasons:**
- Vikram's existing KodeKloud CI/CD kit already uses this pattern
- No user-assigned managed identity (blocked in KodeKloud sandbox)
- Secrets rotate without pod restart
- No secrets in K8s Secret objects — avoids base64 false security

**KodeKloud caveat:** Tested with system-assigned kubelet identity — confirmed working.
