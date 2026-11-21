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
