# HaqPath status

## Summary
HaqPath is a local-demo companion for Baiga, Bharia and Sahariya households in Madhya Pradesh. It is independent and is not a government portal. The journey works in the browser: typed description, fact confirmation, follow-up questions, results, plan, and self-reported progress. No scheme is published yet, so results show "No scheme is confirmed yet."

## Done and verified
- Scaffold: Vite, React, TypeScript (strict), Tailwind, Zod, Vitest, Playwright, ESLint. Commit 'chore: scaffold HaqPath and source ledger'.
- Phase B, eligibility engine (commit 707c4cd): pure three-valued evaluator (pass, fail, unknown; source review), AND, OR groups, exclusions, effective-date gating, decisive follow-up questions, date helpers, synthetic test households. 50 unit tests passed at that commit.
- Phase C, citizen journey (commit 606ae32): typed intake with deterministic parser, confirm-before-use facts, follow-ups with 'why we ask', results and plan empty states, local progress saving labelled as self-reported. 62 unit and component tests passed.
- Privacy route fix: /privacy was returning 'Page not found'. Route added in src/App.tsx.
- Phase D, local mode: reminders (official deadline only when a verified date exists; personal follow-up with timezone), reminder storage in browser, Supabase config check that stays in local demo mode. Supabase migration written as a placeholder, NOT applied. .env.example lists variable names only.
- Phase E, reviewer panel: read-only /review page. No editing, no publishing, no Hindi translation.
- Phase F, end-to-end: Playwright suite in e2e/journey.spec.ts covering intake and confirmation, empty results and plan, privacy and review pages, 360px overflow, and console errors.
- Checks at last full run: typecheck, lint, production build, 85 unit tests, and the Playwright suite.

## Verified in a real browser (headless Chromium, fresh profile)
- Typed example produced four proposed facts (Baiga, Dindori, kutcha, dairy intent), each marked 'Not confirmed yet' until confirmed.
- /results and /plan show 'No scheme is confirmed yet'.
- No console or page errors on intake; no horizontal overflow at 360px on /intake.

## Not verified or not done
- Saved-progress button and reminder form have not been exercised in a browser.
- Publishing: no scheme is published. The official pages gave one readable exclusion rule only. Beneficiary unit, geography, full rules, documents, steps, and deadlines are unverified for every scheme.
- Source ledger: all five official sources are unverified. HTTP 200 only; content not reviewed.
- Parser: 'pakka' is stored as 'pucca' and 'kachcha' as 'kutcha'. Not checked against any rule.
- Supabase: no credentials. Migration not applied. Owner isolation, RLS tests and account deletion are untested.
- Reviewer publishing: no server-side reviewer role, no audit trail, no way to publish a new rule version.
- Hindi: no reviewed translation. The Privacy page says so.
- Adversarial QA: prompt injection, stale or contradictory sources, duplicate schemes, no-network and failed-save states are not tested.
- Hosting: no Vercel deployment. Access not checked.
- README: current-state and PS5 mapping not yet updated for Phases D to F.
- Git: .codebenders/ and .vscode/ are untracked and not committed on purpose.

## Next actions, in order
1. Verify official sources for one scheme (read eligibility text, documents, route, deadline). Publish only if fully verified.
2. Run adversarial QA tests and fix findings.
3. Browser-test saved progress and the reminder form.
4. Update README current state and PS5 mapping.
5. Deploy to Vercel if access is granted.
6. Add Supabase with real credentials; apply the migration; test RLS and owner isolation.
7. Build reviewer publishing with server-side role and audit trail.
8. Review and add reviewed Hindi.

## Credentials
Supabase URL and anon key are not configured. Only variable names are in .env.example. No secret is stored in the repository.

## Phase 0 audit (recorded 2026-11-22, SevaKrit main @ 9c2ca0c)

Status tags: VERIFIED (read in code or run), REFUTED, UNCLEAR, BLOCKED.

### Baseline (VERIFIED, run this phase)
- Typecheck, lint, unit tests (85/85 in 11 files), and build all passed.
- npm audit: 4 advisories. zod <4.6.6 (high) is a RUNTIME dependency. tinypool (critical) and vitest-chain packages (critical, moderate) are devDependencies, not shipped in the browser bundle. Fixing requires breaking upgrades; not applied.
- Playwright E2E: not run in Phase 0.

### Repo state (VERIFIED)
- Branch main, HEAD 9c2ca0c. Modified: STATUS.md. Untracked: .codebenders/, .vscode/, supabase/migrations/002_product_schema.sql.

### Functional defects (VERIFIED in code)
- Follow-up answers are stored as strings. Numeric and boolean operators return "undecided" on strings, so those rules can never decide.
- Evaluation order: a failed condition returns before the source status is checked, and any fail maps to likely_mismatch. Source problems do not override a mismatch.
- Outcome names in code are likely_fit, needs_information, likely_mismatch, source_review_needed. source_under_review and unverified do not exist as names.
- OR is supported. There is no NOT operator; negation exists only as an exclusion flag.
- The evaluator takes "today" as a parameter and does not read the system clock.
- Plan page lists every published scheme and never reads the user's profile. No scheme is currently published, so the empty state always shows.
- Progress is written from the Plan page and never read back into any UI. Clearing has no production caller.
- Narrative and confirmed facts exist only in React state and are lost on reload. localStorage holds only progress and reminders.
- Privacy page says answers are stored in the browser. Answers are not persisted, so the copy is inaccurate.
- Narrative parser: 4 fact keys, 10 districts, no Devanagari handling, no Aadhaar or account-number detection beyond a UI warning.
- Reviewer page is read-only: no auth, no writes, no Supabase use.
- Supabase: no client, @supabase/supabase-js is not a dependency, and the config helper has no production caller (tests only).
- Routes: /, /intake, /results, /plan, /privacy, /review, plus catch-all. Home is defined in two places; the home file is imported only by a smoke test. AppShell (src/components/AppShell.tsx:10) has no importer.
- Data: 3 schemes, all draft, zero rules, zero rule versions. Repository uses a placeholder effective date 1970-01-01. Scheme data has no URLs. 5 source URLs, all checkedAt "not-yet-checked", no human-verification date field.
- Tests: src/tests evaluate.test.ts 27, dates.test.ts 12, questions.test.ts 5, reminderRepository.test.ts 6 (other src/tests files not counted). e2e/journey.spec.ts has 6 tests.
- No sessionStorage, indexedDB or import.meta.env use under src/.

### Refuted or corrected earlier claims (VERIFIED)
- The rule-version function returns an empty array. The "<schemeId>:no-rules" id comes from a separate helper, not that function.

### Unresolved (UNCLEAR)
- Official hackathon PDF (Problem Statement 5): not present in the workspace and not accessible here. Reuse rules and feature deadline NOT CONFIRMED. Treat as BLOCKED for any hackathon-compliance claim.
- Parent folder contents: not checked (path rejected by the shell policy).

### Nagarakshak reference (VERIFIED at commit a440c99, read-only, cloned outside this repo)
- Voice-note to text: NOT FOUND. Speech-to-text is deferred in the project's own verification script; the voice-note setter has no callers.
- AI triage: partial. Client-side Gemini call with keyword fallback; edge-function bodies not read.
- Photo evidence upload: VERIFIED. Stored in Supabase Storage, MIME prefixes image/ and audio/ accepted at ingest.
- Roles: two generations of role enums; one page still checks the old value "city". 29 RLS policies, not executed.
- Case status: four separate enums (complaints, submissions, proposals, development).
- Rules: no citations, no effective dates; eligibility still "awaiting confirmation" in a migration note.
- Civic map and billboard modules exist. No police or security module found.
- Security: a Gemini API key is read from a VITE_ variable, so it is compiled into the browser bundle. Photos are sent to Gemini from the browser. Do NOT reuse this pattern.
- Licence: no LICENSE, COPYING or NOTICE file; no reuse terms in README or docs. Reuse is NOT permitted by default.
- Tests: no automated test script, no CI configuration. 16 manual verification scripts and one RLS policy document; none run.

### Adopt / avoid decision (Phase 0 result)
- Adopt concepts only: source citations per rule, explicit reviewer status, versioned rules, RLS per child table.
- Avoid: copying code (no licence), client-side API keys, civic complaint/map/billboard modules, unexecuted RLS claims, the duplicated four-enum status model.

### Phase 0 gate
- Baseline: PASS (typecheck, lint, tests, build).
- Defect inventory: PASS (every claim above has a verdict).
- Reference inventory: PASS for reading; no reuse decision made because no licence exists.
- Hackathon reuse rules: BLOCKED (PDF not accessible).
- Phase 1 may start only after the user confirms the hackathon reuse position and the scope of two schemes.

## Phase 1 — Foundation and UI verification (2026-11-22, parent SHA 9c2ca0c)

### Changes
- Wired unused `AppShell.tsx` into `App.tsx` (header nav + footer). Skip link kept; `main#main-content` moved onto AppShell with `tabIndex={-1}`.
- Canonical home remains `src/pages/Home.tsx`.
- CSS `:root` tokens mapped into `@theme` / body / focus / skip-link so computed styles use them (not declaration-only).
- Added `e2e/phase1-verification.spec.ts` (routes, DOM, viewports 320/360/768/1024/1440, skip link, focus ring, token audit). Screenshots under `e2e-artifacts/phase1/` (local artifacts, not committed).
- `MASTER_BUILD_PROMPT.md`: verified on disk at **697 lines** with Sections **I, J, K** present (not truncated).

### Checks A–D
- **A static/contracts: PASS** — `npm run typecheck`, `lint`, `test` (then 97 after Phase 2), `build` all exit 0. Diff reviewed; no secrets.
- **B DOM/behavior: PASS** — Playwright Chromium: all routes `/`, `/intake`, `/results`, `/plan`, `/privacy`, `/review`; zero overflow nodes; zero console/page errors; zero HTTP ≥400; CTAs and main nav reach intended routes. Artifacts: `e2e-artifacts/phase1/dom-audit.json`.
- **C responsive/a11y: PASS** — Viewports 320, 360, 768, 1024, 1440: no horizontal overflow. Skip link: Tab focuses it, becomes visible, Enter focuses `#main-content`. Focus-visible outline uses `--brand` `#173B35` / `rgb(23,59,53)` ≥2px. Token audit: 25 `:root` tokens declared; body bg `rgb(247,245,240)` and text `rgb(85,100,95)` resolve from tokens.
- **D source/security: PASS (Phase 1 scope)** — Routes truthful; privacy footer copy corrected (session answers vs browser progress). No new secrets. Production hosting still **BLOCKED** (not deployed).

### AppShell decision
- **Reuse** AppShell: provided persistent header/nav/footer that App.tsx lacked. Removed duplicate per-route `<main>` wrappers.

### Outstanding after Phase 1
- None blocking Phase 2.

## Phase 2 — PM-JANMAN housing evidence + engine (2026-11-22)

### Scheme selected
- **PM-JANMAN rural housing (Madhya Pradesh)** (`pm-janman-housing-mp`).
- Primary source (fetched 2026-11-22): https://cmhelpline.mp.gov.in/KnowYourEntitleDetail.aspx?Schemeid=974&pointvalue=2&status=byschemefor
- Effective start on page: **2023-11-15**. Human/source check recorded: `checkedAt` / `lastVerified` / `reviewedAt` = **2026-11-22**.
- Secondary union portal https://tribal.nic.in/PM-JANMAN.aspx : **HTTP 500** this session → kept `unverified`, not used in rules.

### Encoded only from CM Helpline page
- Target communities: Baiga, Bharia, Sahariya.
- 24 listed MP districts.
- Area: Rural.
- Exclusions: pucca house; any member Government employee.
- Process notes (not auto-eligibility): Gram Panchayat; Awas+ Gram Sabha approval; CEO Janpad; appeal District Appellate Committee; online link `pmayg.nic.in`; grant amount 200000 listed.
- **Missing / not invented:** document checklist (explicitly “not stated”), application deadline (`null`), live Awas+/Gram Sabha membership.

### Engine fixes
- Source problems now block **both** pass and fail (`source_review_needed`).
- Source status includes `conflicting`.
- Follow-up answers coerced to typed facts (`coerceFact.ts`); “I don’t know” → `unknownFacts`, not a fake boolean.
- `getRuleVersions()` loads `data/ruleVersions.json`. Scheme published in `src/data/schemes.json`.

### Regression tests (unit)
- Positive fit, pucca mismatch, missing govt-employee → needs_information, stale-source → source_review_needed, conflicting-source → source_review_needed (`pmJanmanHousing.test.ts`).
- Engine: unverified/stale/conflicting fail paths no longer mismatch (`evaluate.test.ts`).
- Coercion tests for yes/no/unknown.

### Checks A–D (Phase 2)
- **A: PASS** — typecheck, lint, **97/97** unit tests, build.
- **B: PASS** — Playwright **12/12** including citizen path to **Likely fit** + rule trace; results no longer show empty catalogue.
- **C: PASS** — Phase 1 viewport/skip/focus suite still green after shell + results content.
- **D: PASS (partial)** — Results cite CM Helpline URL via SourceBadge; no confident result without verified source. RLS/backend still **BLOCKED** (no Supabase credentials). Union MoTA page still unverified (500).

### Outstanding P0/P1
- Document requirements not on source → honest “not stated” only.
- Reviewer publish/auth still absent.
- Aahar Anudan / dairy remain draft/unverified.

## Phase 3 — Citizen intake / results / scheme detail (2026-11-22)

### Changes
- `/discover` is the canonical intake route; `/intake` redirects. Home CTA and AppShell nav updated.
- Follow-ups use Yes/No/I don’t know (and Rural/Urban, Kutcha/Pucca) choice buttons; “I don’t know” stays in `unknownFacts`.
- Answered follow-ups remain visible for review; confirmed details list includes follow-up and unknown answers.
- `/schemes/:slug` scheme detail with rule traces, sources, documents, steps.
- Results link to scheme detail; Plan uses `planSchemes()` → **likely_fit only** (not the catalogue).
- Unit: `evaluatePublished.test.ts`; intake Y/N/K coverage. E2E journey + phase1 routes updated.

### Checks A–D
- **A: PASS** — typecheck, lint, **102/102** unit tests, build.
- **B: PASS** — Playwright **13/13**: discover redirect, incomplete → plan empty, citizen path → likely fit → scheme detail → plan with likely-fit only.
- **C: PASS** — Phase 1 viewport/skip/focus suite green with `/discover` + scheme detail route.
- **D: PASS (partial)** — No new secrets; scheme detail cites sources. Backend/RLS still **BLOCKED**.

### Next permitted action
- Phase 4+ per MASTER_BUILD_PROMPT (do not start Phase 6 landing polish until earlier gates clear), or adversarial QA / second scheme evidence.

## Checkpoint — readiness, reminders, print, persistence (HEAD after this commit)

Started from `db18866` (matches `origin/main`). PS5 PDF not in the workspace. Nagarakshak not re-cloned this session.

### Shipped in this slice
- Confirmed answers persist in `localStorage` (`haqpath.household.v1`). Narrative is not stored.
- Sensitive-looking ID / account / OTP text is refused before parsing and is not saved.
- Plan: likely-fit only; document rows say verify-with-department when the source did not list documents; self-reported step + undo; personal `.ics` download distinct from an official deadline (still `null` on PM-JANMAN housing).
- `/plan/print` action sheet, `/assisted` reset, `/help`, `/how-it-works`, translated shell (en/hi) with a non-certified-translation note, privacy clear-data button.
- Smoke assertion updated to the live Home H1. Stale “Met:” and old Home CTA selectors updated to the current UI.

### Checks run this session
- typecheck PASS, lint PASS (`.codebenders` ignored), unit **136/136** PASS.
- Playwright after a fresh preview build: journey + phase1 + phase2 scheme-detail **19/19** PASS (one earlier route failure was a stale preview on port 4173, then a stale CTA name; both fixed and re-run).

### Still blocked or partial
- **BLOCKED:** Supabase CLI not installed, no `.env`, migrations `001–003` not applied. Docker is installed but `003` depends on `auth.users`, so RLS was not executed. Reviewer UI remains read-only. Do not treat SQL files as a working backend.
- **PARTIAL:** Hindi covers the shell and 404, not every chapter or scheme sentence. Assisted mode reuses the same intake; it is not a separate engine.
- **Not deployed.** No hosting config or credentials in the repo.
- Aahar Anudan and dairy remain draft. No new scheme rules invented.

## Checkpoint — production completion push (2026-11-22 evening)

Parent HEAD before this work: `01786be` on `main` (matched origin).

### Implemented this session (code on disk; commit pending if disk recovers)
- Migrations: `001` neutralized (UUID conflict archived); `002`/`003` grants + conflicting-source publish block + `current_reviewer_role()`.
- SQL RLS harness `scripts/pg-rls-sql.mjs` against disposable Postgres **16** on port **54432**: migrations applied; anon sees published / not draft; citizen insert denied; publisher publish + audit — **PASS** (full Supabase stack BLOCKED: competing project on 5432x, `postgres-meta` exec-format error, then host **ENOSPC / OOM**).
- Reviewer: `ReviewSession` real Supabase Auth sign-in when env set; no fake local admin.
- Assisted: consent → answers → finish/print/reset.
- Hindi: expanded message catalogue + Home/Intake/Results/shell; glossary + samples routes.
- Features: ConnectionBadge, SafeSummary copy, conflicting house-word parser, vercel.json SPA + headers, README with mermaid diagrams.
- Unit: **140/140** PASS + production **build** PASS before disk filled.
- Playwright / Vercel deploy: **NOT re-run** after disk filled (ENOSPC).

### Honest blockers
1. Free disk space and stop other Docker Supabase stacks before full `supabase start` + `npm run test:rls` + Playwright + `vercel --prod`.
2. Hosted Supabase project credentials still required for a live reviewer against the internet.
3. Do not claim production-ready backend until PostgREST+Auth RLS suite passes on a healthy machine.
