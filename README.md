# HaqPath

## Overview

HaqPath is an independent, plain-language guide for households in Madhya Pradesh (Baiga, Bharia and Sahariya households). It helps a household describe its situation in plain words, see which benefit schemes may fit and why, learn which documents to gather, and find the official office or portal to use.

HaqPath is **not** a government portal, does not make eligibility decisions, and does not submit applications. Results are "likely" guidance only.

HaqPath never asks for Aadhaar, bank account numbers, OTPs or document scans.

Demo mode: answers and progress are stored only in this browser. Nothing is sent to a server.

## Setup

```bash
npm install
npm run dev        # local development server
npm run build      # production build
npm run typecheck  # TypeScript check
npm run lint       # ESLint
npm run test       # unit and component tests (Vitest)
npm run test:e2e   # end-to-end tests — arrives in Phase C
```

## Architecture map

- `src/domain/` — pure logic and Zod schemas (`types.ts`); no UI or I/O.
- `src/data/` — catalogue JSON (`schemes.json`).
- `src/services/` — adapters for storage and other I/O (added in later phases).
- `src/pages/` — route-level screens.
- `src/components/` — shared UI (app shell, source badge).
- `src/tests/` — test setup and smoke tests.
- `data/sources.json` — source ledger: every official source HaqPath relies on, with publisher, URL, check date and status.

## Source limits

- Every source in `data/sources.json` is currently `unverified` with `checkedAt` set to `not-yet-checked`.
- Schemes in `src/data/schemes.json` have status `draft`, empty rules and null deadlines.
- The organizer's Problem Statement 5 PDF was **not** verified in this phase.
- No scheme is shown as confirmed.

## Requirement-to-phase mapping

| Requirement | Phase |
| --- | --- |
| PS5 typed input | C |
| Eligibility reasoning | B |
| Document checklist and steps | C |
| Reminders and tracking | D |
| Official links and `last_verified` | A / C |
| Editable, versioned rules | E |
| Public data and synthetic tests | B / F |
| No ID collection | A / F |

## Design tokens

| Token | Hex | Use |
| --- | --- | --- |
| `canvas` | `#F7F5EF` | Page background |
| `ink` | `#173B35` | Headings and primary button |
| `terracotta` | `#B85F3C` | Decorative elements only |
| `terracotta-text` | `#8F4426` | Text and links (contrast choice) |
| `sage` | `#E6EEE8` | Panels and footer |
| `body` | `#26332F` | Body text |

Contrast choice: `#B85F3C` is too light for body-sized text on the canvas, so text and links use the darker `#8F4426` (6.4:1 on `#F7F5EF`, WCAG AA). `#B85F3C` is reserved for decorative elements.

## Environment

- Developed on a Windows host.
- No git remote yet. Local repository only; do not push.

## Current state

Phase A scaffold: app shell, placeholder pages, source badge, test setup and a smoke test are written. Install and checks have not yet been verified.

## Next action

Verify install and checks (`npm install`, typecheck, lint, build, test), commit locally, then start Phase B (deterministic sourced eligibility engine).

