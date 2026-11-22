# MASTER BUILD PROMPT — SEVAKRIT / HAQPATH

**EXECUTE INSIDE NEXEN WITH THE CODEBASE OPEN.** Use the companion `SKILL.md` as the permanent design/engineering rules. This document is the sequential execution contract for a relatively small-context coding model. **Read, verify, build, test, then commit. Do not paraphrase this whole prompt back to the user instead of executing.**

> Target: https://github.com/Rehan-2024/SevaKrit  
> Reference: https://github.com/Rehan-2024/nagarakshak  
> Prepared: 2026-11-22.  
> **Important honesty boundary:** the prompt's author could not fetch either GitHub repository directly during this turn. References to existing SevaKrit paths/defects are from the user's provided prior IDE audit and master prompt, **not newly re-executed in this environment**. Your FIRST task is to confirm these facts locally. Likewise the authoritative PS5 PDF and hackathon reuse rules have not been re-opened here. **Never pretend those were directly audited.**

---


**Image kit install check before any landing-page work:** verify `assets/hero-village.webp`, `assets/household-story.webp`, `assets/action-checklist.webp`, `assets/assisted-service.webp` and JPEG counterparts are present with these Markdown files. Move/copy to the project's `public/images/story/` before building visuals. Do not assume Nexen's skill importer transfers sibling files. If the assets are missing, request/locate the zip and mark visual-assets BLOCKED instead of generating replacements and claiming they were supplied.

## A. NON-NEGOTIABLE OUTCOME — THE PRODUCT, NOT A MOODBOARD

Build a complete, independently branded, genuinely useful application called **HaqPath by SevaKrit**: **a multilingual, explainable benefit-discovery, application-readiness and self-tracked follow-through service** for **one MP PVTG household beneficiary cohort**. Focus the **actual demo on a synthetic Baiga household in Dindori** and expand to Bharia/Sahariya only after checking distinctive eligibility rules. Do not expand beyond Madhya Pradesh. Include central schemes only when genuinely applicable within MP.

**Product principle: “Not another scheme search engine. A trustworthy path from confusion to the next action.”**

A successful resident can:
1. Describe their household in ordinary words (with typed workflow definitely functional, Hindi where translated/verified; optional speech only when transcribed and tested).
2. See proposed extracted facts and correct/confirm them, without supplying sensitive identifiers.
3. Answer only important questions, with “why we ask” and an “I don't know” route.
4. Receive rule-grounded results with distinct `likely fit`, `need more information`, `likely mismatch` and `official source under review` outcomes. Every reason cites a versioned active rule and a primary official URL.
5. See scheme-specific document prerequisites and application path, including who/which office initiates steps and what is not known.
6. Save *self-reported* progress, resume after refresh, print a personal action sheet, and export an actual calendar event/reminder for their next check.
7. See the important privacy/independence limitations, plus what happens if a source is stale or contradictory.

An authenticated scheme reviewer can:
1. View official-source evidence and a pending verification queue.
2. Make an editable DRAFT rule change in a safe schema-controlled editor.
3. Compare before/after deterministic results with synthetic profiles.
4. Publish only after evidence, effective dates and server-side authorization pass.
5. Inspect immutable publication history and who approved it.

**Never claim** the product guarantees benefits, uploads government forms, checks the official government's live application status, notifies by SMS/push without a real channel, or is affiliated with the state. **Never copy an existing site's code/design without rights and competition permission.**

### PS5 traceability contract (previous conversation; source PDF still to be reopened)
| Requirement in prior transcript | Where proved in product | Automated / manual evidence |
|---|---|---|
| one group, one state | product scope, filtered catalogue, footer | scope test and source records |
| typed or spoken plain language | `/discover` | type, edit/confirm and optional speech test |
| explainable likely eligibility | `/results`, `/schemes/:slug` | exact rule trace for each outcome |
| personal document checklist + steps | `/journey/:schemeSlug` | persisted checklist and steps |
| reminders and tracking | `/journey`, `.ics` exporter | reload and actual ICS file |
| official link and last verification | all details/review pages | source URL + **human** verification timestamp |
| changing/editable rules | reviewer panel | draft/publish/old-vs-new and RLS denial |
| no sensitive IDs | intake and persistence | reject/avoid outbound payloads |
| sample-profile testing | `/review/simulator` & test suite | positive/negative/unknown fixtures |

Treat any requirement not verified against the actual PDF as `REPORTED-UNRETESTED` until that file is read. Clarify the brief's “one group” wording: the precise cohort is MP PVTG households; if the organizers mean **one tribal community only**, restrict the submission-facing journey to Baiga households. Do not silently widen scope.

---

## B. FIRST COMMANDS — CLONE, FORENSIC AUDIT, LICENCE AND REUSE RULES

### B1. Never overwrite the current checkout
Confirm the IDE project path and remote. If SevaKrit is already open, **DO NOT clone SevaKrit on top of it**. First run in its root:

```bash
pwd
git remote -v
git branch --show-current
git rev-parse HEAD
git status --short
git log -8 --oneline
rg --files -g '!node_modules' -g '!dist' -g '!coverage' -g '!*.lock' | head -180
cat package.json
```

Windows PowerShell: `Get-Location`, `git ...`, `Get-ChildItem -Recurse -File ...`; if `rg` isn't present use `git ls-files` instead. Do not assume bash tools exist. Record branch, commit SHA, modified/untracked paths, root folder and actual package scripts. No resets, clean -fd, force pushes, or destructive changes.

### B2. Clone Nagarakshak **next to** SevaKrit, for source review

```bash
# From SevaKrit's root; the sibling location is intentional.
git clone https://github.com/Rehan-2024/nagarakshak.git ../nagarakshak-reference
git -C ../nagarakshak-reference remote -v
git -C ../nagarakshak-reference rev-parse HEAD
git -C ../nagarakshak-reference status --short
```

If name differs or clone fails, check actual availability/permissions instead of inventing its contents. Never commit the reference repo inside SevaKrit, and do not add it as a package dependency. Look for `LICENSE` and organizer reuse rules before any literal copy. The repo's presence alone is not permission for hackathon reuse.

### B3. Root-cause reference inspection (actually read the code)
For **both** repos, find actual paths for:
- README, architecture docs, handoff notes and dependency manifests;
- entrypoint/router, design tokens, layouts, pages and components;
- text/voice input: captured audio, ASR, language processing, raw text sanitization, user confirmation;
- API clients, authentication, roles and migrations, RLS or equivalent access control;
- deterministic rules, source provenance, confidence, change/history/version metadata, human override;
- workflow states, persistence, reminders, evidence attachments, export/share;
- sample/demo data, tests, CI, deployment settings;
- inconsistent/missing configuration, duplicated page components, abandoned routes and security leakage.

Create a **short audit in the existing `STATUS.md`** or console (no new 20-page report):

| Pattern / feature | Nagarakshak actual file:line | Tests or real proof | SevaKrit existing equivalent | Decision | Reason |
|---|---|---|---|---|---|
| multilingual intake | inspect | inspect | inspect | adapt/avoid | ... |
| provenance and citations | inspect | inspect | inspect | adapt/avoid | ... |
| evidence audit/versioning | inspect | inspect | inspect | adapt/avoid | ... |
| reviewer workflow/RBAC | inspect | inspect | inspect | adapt/avoid | ... |
| case status timeline | inspect | inspect | inspect | adapt/avoid | ... |
| voice | inspect ASR | inspect | inspect | real ASR or exclude | ... |

**Potential Nagarakshak inspiration (reported in earlier conversation, NOT confirmed by current clone):** multilingual unstructured intake, rules separate from model output, evidence provenance, confidence/version history, human override, role-based access, case workflow. Reported anti-patterns: voice recorded but not transcribed, manual evidence fusion, demo coverage, duplicated scoring, stale civic modules, weak automation. Accept/reject by reading files, not because the prompt says so.

**Rejection filter:** Any feature oriented around civic complaint maps, incident priority/security, police alerts, evidence of crimes, noisy charts or unrelated admin modules must be discarded, not copied just to inflate feature count. Port domain-agnostic primitives only if licensing and organizer rules allow and they actually pass tests.

### B4. SevaKrit recovery audit
From prior supplied IDE audit, **suspected** defects to confirm in local files:
- Three `src/data/schemes.json` schemes in draft and sources unverified; `getRuleVersions()` allegedly returns `[]`.
- `src/domain/evaluate.ts` allegedly treats failed rules as mismatches without gating source verification first; test both sides, including OR branches.
- Follow-up answers are stored as strings though engine needs booleans/numbers.
- `Plan.tsx` may show all published schemes rather than evaluated matches; progress written but not read into UI; reminders don't have delivery.
- React-only intake state vanishes on reload; privacy copy inconsistent with persistence.
- English-only parser limited to four dimensions and ten districts; ID detection only passive warning.
- Reviewer page read-only, Supabase not wired, child-table RLS incomplete, unused pages/components.
- Previous audit reported 85/85 unit tests passing, build/lint/typecheck passing, npm audit 2 critical + 1 high + 1 moderate; these numbers are **NOT current verification**.

Run only package scripts that actually exist (examples):

```bash
npm ci
npm run typecheck --if-present
npm run lint --if-present
npm test -- --run
npm run build
npm audit --json
```

If Vitest config uses another script, adjust from `package.json`; do not run `npm audit fix --force` unexamined. Investigate exact dependency advisories and whether exploitability affects production. Run existing Playwright E2E if installed and configured. Record outcomes, do not overstate.

---

## C. THE DESIGN IDENTITY — EXACT SPECIFICATION (KEEP OUT OF RANDOM CSS)

### C1. Brand and colour system
The product name is **HaqPath** (with SevaKrit attribution). This is a **design proposal**, not a claim of an existing or registered trademark. Use it consistently only after seeing repo branding/current marks. Create global CSS variables and Tailwind theme mappings from these tokens, not component-specific hex guesses.

```css
:root {
  --canvas: #F7F5F0;
  --surface: #FFFFFF;
  --surface-muted: #ECF1EC;
  --ink: #213A34;
  --ink-soft: #55645F;
  --brand: #173B35;
  --brand-hover: #102D29;
  --border: #D7DED7;
  --accent-earth: #9C552E;
  --accent-gold: #CBB97C;
  --success-ink: #2E694F;
  --success-bg: #EAF4ED;
  --warning-ink: #91571B;
  --warning-bg: #FFF5E8;
  --mismatch-ink: #5A534C;
  --mismatch-bg: #F2EFE9;
  --error-ink: #B52D34;
  --error-bg: #FFF0F0;
  --info-ink: #2B526F;
  --info-bg: #EDF5FA;
  --radius-input: 10px;
  --radius-card: 16px;
  --radius-image: 20px;
  --page-max: 1240px;
  --content-max: 760px;
}
```

Measured samples verified by formula at prompt preparation, **recheck in actual page state**: white on brand 12.26:1; `--ink` on canvas 11.21:1; soft ink on white 6.22:1; terracotta on white 5.60:1; status inks on their surfaces 5.44–7.50:1 (mismatch neutral 6.59:1). No pastel text for facts; never rely on green/red alone; explicitly label status in words. Gold is an *ornamental hairline* only.

### C2. Art direction and fonts
- Body: **Inter**, fallback system sans. Hindi: **Noto Sans Devanagari**, fallback system Hindi. Heading on marketing pages: **Newsreader** editorial serif for English only; UI forms/results use sans. Verify downloadable font license; load locally with efficient WOFF2 subsets as appropriate, no runtime Google font blocking critical rendering if avoidable.
- Type: display 68–80px max desktop, 40–45px mobile; section 42–52px desktop / 30–36px mobile; content headings 28–36px; body 16–18px with 1.55–1.65 line height; Hindi ~1.65; supportive text >=14px.
- Layout: desktop max 1240px, content max 760px, 12-column system; mobile 20px gutter, 360px first-class. Nav 76px desktop / 64px mobile; desktop hero generous top 64–100px, but make the H1 and CTA visible without awkward blank space.
- Sections with warm ivory/white/muted sage; controlled texture (very faint paper grain only if small local asset) and thin borders. Honest documentary photography, asymmetric editorial spacing, subtle captions, not glass panels/neon/AI orb/stock-photo emotions.
- Interactions: 180–220ms buttons, 300–450ms entrance, `ease-out`, no excessive spring. Sticky nav may shift compactly after scroll, but do not jump content. Respect reduced-motion. No horizontal parallax on mobile; CSS transitions should not hide required content.
- All links have meaningful text; buttons states default/hover/focus/active/disabled/loading. Error controls retain input and display solution. Skeletons only where data actually loads.

### C3. Design references — reference principles, not protected implementation
- GOV.UK Design System question page guidance: https://design-system.service.gov.uk/patterns/question-pages/ — one clear question, visible back link, proper hint/error copy.
- USWDS step indicators: https://designsystem.digital.gov/components/step-indicator/ — only for **known linear step counts**; dynamic eligibility questions should show “Question about your household,” NOT a fabricated `4 of 7` when count changes.
- WCAG 2.2 AA: https://www.w3.org/TR/WCAG22/ — contrast, visible focus, accessible names, keyboard and target size.
- Inspiration for restraint only: Linear-like precision, Stripe-like visual rhythm; do not rebuild either company's homepage or brand.

### C4. Hero photography — properly licensed or generated and disclosed
Build **an intentional 3-image visual narrative** with no invented beneficiaries or endorsements:
1. **Arrival/context**: rural MP landscape, village service centre exterior or calm real-world scene. Hero aspect desktop ~4:5 or 5:6 in right panel; mobile 16:10 crop. Do not imply the scene depicts the specific synthetic demo family.
2. **Understanding**: close-up documents/paperwork/hands on a table, IDs fully obscured, no recognizable data, and no fake official forms/marks.
3. **Next step**: community help desk, printed checklist, quiet act of preparation or village road, carefully composed without pity aesthetic.

**Source leads to inspect before use** (not automatic assets or endorsement):
- Wikimedia Commons “Through villages” public domain: https://commons.wikimedia.org/wiki/File:Through_villages.jpg (landscape option; actual crop suitability to inspect).
- Wikimedia Commons “A Gramsabha in a rural village of Madhyapradesh” CC BY-SA 4.0, Shagil Kannur: https://commons.wikimedia.org/wiki/File:A_Gramsabha_in_a_rural_village_of_Madhyapradesh.jpg (credit + ShareAlike obligations, identifiable people: consider whether appropriate; do not use in an implication of product endorsement).
- Unsplash license https://unsplash.com/license ; confirm photographer/page/people releases and follow API-attribution terms if using API.

If image generation is supported by the IDE, create a **clearly synthetic, non-identifying editorial illustration** of a community assistance scene (landscape photography aesthetic; subtle daylight; no text, government emblem, logos, caste/tribe markers or fabricated official identity). Label it “Illustrative visual”. DO NOT claim a generated person is a real PVTG beneficiary. If there is no license-safe appropriate portrait, **use landscape/still-life instead**.

Download only from the actual license-authorized original page, store optimized files in `public/images/`; use meaningful `alt`, responsive `srcSet`/`sizes`, fixed intrinsic dimensions, below-fold lazy loading, hero priority/eager. Record asset provenance in the existing README's compact “Image credits” section, not a new oversized file. Test broken links, content shifts and image payload sizes; aim <=250KB for mobile hero when feasible without bad compression.

---

### C5. BUNDLED IMAGES — COPY FIRST, PLACE WITH INTENTION

The **real image files are supplied with this prompt package** in an adjacent `assets/` folder. **This Markdown is an art-direction reference, not a browser-readable asset folder.** Copy the assets into `public/images/story/` before implementing the landing page. Never replace them with arbitrary image-search URLs, unlicensed stock, AI-generated logos, or fictional beneficiary photos.

**The image storyboard (AI-generated illustrative concept, not documentary photography):**

![Four-scene visual story: rural landscape, family conversation, paper checklist, and assistance](assets/visual-storyboard.webp)

| Intended beat | Bundled image | Placement and function | Image treatment |
|---|---|---|---|
| 01. Place / opening hook | `hero-village.webp` | Landing hero right half; evokes place and beginning, **not** a specific verified village | Desktop `aspect-ratio:3/2`, `object-position:50% 54%`; on mobile show below CTA, natural 3:2 crop |
| 03. Household story | `household-story.webp` | Beside clearly labelled **synthetic** family scenario; establish scale/empathy without inventing testimony | `aspect-ratio:3/2`; keep faces uncropped; visible caption `AI-generated illustration, not a real beneficiary` |
| 06. Action payoff | `action-checklist.webp` | Beside actual personalized document/action-board component | Tight documentation scene; no IDs; caption `Illustrative checklist scene` |
| 08. Assisted access | `assisted-service.webp` | Close chapter about helper/community centre use case; must not imply our platform has verified partners | Desktop panorama/split, mobile contained 3:2; caption `Illustrative service conversation` |

Both `.webp` and `.jpg` counterparts are bundled. In app JSX, use exact `/images/story/hero-village.webp`, `/images/story/household-story.webp`, `/images/story/action-checklist.webp`, `/images/story/assisted-service.webp`. Add natural `width=768 height=512`, `sizes`, meaningful `alt`, accessible captions and `loading="lazy"` below the hero. Hero image is eager/high priority. Use `<picture>` only with valid WebP + JPEG `source`/fallback paths. Never leave source image paths pointing at Markdown's `assets/` directory. The source files are original AI-generated editorial illustrations; **not real photos**. Do not label the imagery as MP tribal members or a real deployment.

Use these styling constraints: corners ~20px, thin frame or subtle warm background, never a thick shadow; NO face-covering text overlay, NO heavy gradients, NO fake “verified” overprints; crop with `object-fit:cover` and visually check subject placement. Keep a distinct editorial figure rhythm—one image in 01, one in 03, one in 06, one in 08; do not repeat the same image on every screen. The transactional routes (results, rules, admin, privacy) do not need decorative photography.

**Implement graceful fallback:** If an image file is missing or fails to load, retain the layout with a subtle sage background and text unaffected. Report missing assets as a real validation failure; never silently hide the failure in final checks.

### C6. Story hooks and scroll choreography — exact copy AND behavior

A landing page is a connected persuasion sequence, **not a carousel of 9 features**. The visitor should intuitively feel: *I recognise this problem → I can describe my situation → I can understand the answer → I can prepare and follow through → I trust the source → I can begin.* The following text is proposed marketing copy, **not evidence of verified government outcomes**. Adjust only for accuracy or meaningful user testing, not for generic AI-hype tone.

| Scroll position | On-screen hook (English primary) | Emotional / functional question answered | Images / interactions | Exact CTA rule |
|---|---|---|---|---|
| 01 HERO | **`You shouldn't need to know a scheme's name to find a way forward.`** | Why should I care? Is this for someone like me? | 2-column editorial; **hero-village**; small location-neutral illustration disclosure. Thin forest-green header, line of source/privacy trust below CTA | Primary `Explore possible benefits` → `/discover`; secondary `How it works` → `#how-it-works`. Real links, not JS stubs |
| 02 THE GAP | **`Help can exist and still feel out of reach.`** | Why is the existing process confusing? | No stock portrait. Use a typographic progression `Find what applies → Understand the conditions → Prepare the next action`, with connective rules, not repetitive icon cards. Avoid unsupported claims about government failures | A small text link to Help, not another giant CTA |
| 03 HUMAN STORY | **`One household. A few questions. A clearer next step.`** | Can I recognize my situation? | **household-story** adjacent to a **clearly synthetic** Dindori example. Short neutral profile facts, not an invented quote from identifiable people. Button `Try a sample household` loads explicit non-private fixture if implemented | CTA may prefill only synthetic case, and must visibly announce it is a sample |
| 04 DECISIVE QUESTIONS | **`Every question should have a reason.`** | Will you ask for endless data? | A functional 3-answer rule-driven question (`Yes`, `No`, `I don't know`) with `Why we ask`. Only use an actual source-backed question; else label preview illustrative and route to intake | `See how questions work` must navigate meaningfully or be omitted |
| 05 EVIDENCE | **`Not just a recommendation. The rule behind it.`** | Why trust this recommendation? | A live/shared evidence-card component: `Your answer` → `Official condition` → `What it means` → `Source status`. No fabricated official verification date | Card `View source` opens the real stored URL; if no verified source, show review state |
| 06 ACTION PAYOFF | **`A result is only useful when you know what to do next.`** | How do I move from discovery to action? | **action-checklist** next to a real miniature readiness timeline: `Prepare documents → Use official route → Record your follow-up`. Never show fake submission success | `See an action plan` routes to actual sample/own plan; does not pretend a saved plan exists |
| 07 CHANGE & TRUST | **`Rules change. Your explanation should say when.`** | What if a source is old or conflicting? | Short version-comparison before/after using *real reviewed data* or explicit mock illustration. Display separate source timestamp and human check date | `Learn how we verify` → Help/source-methodology anchor |
| 08 ASSISTED ACCESS | **`A clearer path should work beyond one screen.`** | Can a helper or a low-connectivity family use it? | **assisted-service** + genuine supported outputs (`print`, Hindi only if translated, assisted workflow only if implemented). Be specific: calendar export is not automatic push notifications | `Print an action sheet` only when there is a real printable sample/plan; otherwise link to how it works |
| 09 FINAL INVITATION | **`Start with what you know.`** | What do I do now? | Dramatic forest-green color field, no unnecessary photo; supportive 1–2 lines and a final accessible CTA; full navigation and image disclosures in footer | `Explore possible benefits` → `/discover`; `Privacy and help` → live pages |

**Scroll pacing instructions:**
- At first load, above-the-fold desktop shows the header, the hook, a supporting sentence, primary CTA and the top/full editorial hero photo; no artificial whitespace pushing action below fold. On mobile order is **heading → subhead → CTA → privacy microcopy → photo**.
- Alternate 2-column split, restrained full-width typography, flowing question panel, evidence strip and action timeline. Do not build nine same-sized `FeatureCard` blocks.
- Use CSS scroll and native anchors; `scroll-margin-top` accounts for sticky navigation. Avoid snap-scrolling, canvas animations, video backgrounds, animated scrolling loops or 3D. Scroll-bound animation should never hide content or hijack navigation.
- One purposeful fade/translate entrance per major beat (max ~20–30px; 300–450ms) and only when IntersectionObserver available; show content immediately if JS disabled or reduced-motion enabled. Interactions should not re-trigger annoyingly every time an item comes into view.
- Create visible chapter continuity through quiet repeated editorial elements: thin horizontal rule, eyebrow labels (`01 / THE START`), changing emphasis, and restrained green/earth colors. Story should read coherently even if animation is off.
- Use consistent text-first responsive reading order. No abrupt visual jumps, horizontal overflow or hidden story paragraphs at 320px/200% zoom. Headline may span 2–4 lines on desktop, 3–5 on mobile, with no orphan single words if feasible.
- Avoid fake product screenshots. Whenever a section demonstrates a UI state, **reuse an actual application component with sample props** or label it honestly as illustration. Single source of truth prevents landing marketing from contradicting the working product.
- All visible interface text must be linguistically reviewed before claiming Hindi support. If localized content isn't implemented, show English and do not put a cosmetic Hindi toggle.

**Use this portable React photo pattern only after checking current React/Vite conventions:**

```tsx
<figure className="story-photo">
  <picture>
    <source type="image/webp" srcSet="/images/story/hero-village.webp" />
    <img
      src="/images/story/hero-village.jpg"
      width={768} height={512}
      alt="Illustrative rural landscape with a winding road and greenery"
      decoding="async"
      fetchPriority="high"
    />
  </picture>
  <figcaption>Illustrative editorial image, not a photograph of a verified location.</figcaption>
</figure>
```

For below-fold images, remove `fetchPriority="high"` and add `loading="lazy"`. Add responsive `sizes` when using responsive `srcSet`; verify the browser uses real URLs and the correct image type. React version/type libraries may require type adjustment—check rather than assume.

## D. MULTI-PAGE INFORMATION ARCHITECTURE + EXACT ON-SCREEN CONTENT

Use React Router already present if appropriate. URL names below are target specifications: **adapt to existing routes rather than creating duplicates**.

```
PUBLIC / CITIZEN
/                         => Scroll-story Home
/how-it-works             => More detailed plain-language guidance (optional; if not useful, integrate into Help)
/discover                 => Natural-language intake
/discover/confirm         => Human confirmation of proposed facts
/discover/questions       => Decisive follow-ups, unknown allowed
/results                 => Personalized scheme results; resuming handles no profile
/schemes/:slug            => Sourced rule/evidence detail (no household info in URL)
/journey                 => My Journey board and persisted progress
/journey/:slug           => Scheme action steps, checklist, self-reported status
/action-sheet             => Print-friendly private action sheet (no PII query parameters)
/help                     => Accessible instructions, FAQs, official escalation links when verified
/privacy                  => Accurate privacy and erase-all controls

REVIEWER (real authentication + server policy enforcement)
/review/login             => reviewer sign-in
/review                   => source freshness / draft queue / verification work
/review/schemes/:id       => scheme source, rule editor and evidence
/review/compare/:id       => draft vs published + synthetic household simulation
/review/history/:id       => audit and immutable publications

FALLBACK
/*                        => friendly not-found + path home
```

### D1. The scroll-story Home — **9 purposeful chapters**
It must communicate a story as a user scrolls, without being a generic 6-card AI landing page. Underline the actual problem, demonstrate the workflow, and invite an action. NO invented statistics, happy testimonials, logos of government departments or NGO endorsements. Proposed copy is **design copy**, not official scheme claims.

**Header, stays available:** left monogram `H` shaped as a subtle path / wordmark “HaqPath”; small “by SevaKrit”. Desktop nav: `How it works`, `Find benefits`, `My journey`, `Help`; compact Hindi toggle. Top-right filled primary `Find possible benefits`. Mobile: wordmark, language, single menu button; drawer with focus trap, escape close and visible overlay. Footer contains “Independent information service. Not a government portal.”

**Chapter 01 — Hero (ivory):** A small eyebrow `GOVERNMENT BENEFITS, MADE UNDERSTANDABLE` or real Hindi equivalent; 2–3 line H1 `Support may be available. / Finding your next step / shouldn't be difficult.` (avoid guaranteed eligibility); short summary stressing MP households and explanation; two CTAs `Find possible benefits` (primary) and `See how it works` (text/outline); privacy line `No Aadhaar or account numbers needed`. Right editorial photo with slim caption and gold hairline corner, not an overlay of fake UI status. At 360px the full headline, CTA and meaningful visible image must remain well-spaced.

**Chapter 02 — The gap (white):** Eyebrow `WHY THIS EXISTS`; H2 `A scheme name is not an application plan.` Short 3-part editorial sequence, not icon cards: `What might apply?` / `What is still unclear?` / `What do I prepare next?` with connected fine rule/vertical timeline. No numerical claims.

**Chapter 03 — A person's story (sage):** H2 `Begin with your own words.` Left a marked **synthetic sample scenario**, e.g. `“Our family lives in Dindori. We are Baiga. We have a kutcha house…”` Use an editable example rather than actual personal testimony. Right a **real minimal interactive preview** only if shared with the live intake logic; otherwise show a static clearly-labelled illustration and button leading to `/discover`. Never imply preview is analysing a live claim if it isn't. Small second photo detail of papers without visible IDs.

**Chapter 04 — Questions with a reason (ivory):** Editorial split: quote-like heading `We ask only what could change the answer.` Show one actual rule-specific question with visible `Why this matters`, `Yes`, `No`, `Not sure`. In demo preview, label profile/sample and only persist if user explicitly starts. Scroll movement: gentle 30–40px fade once, not 3D or scroll-jacking.

**Chapter 05 — Evidence you can inspect (white):** H2 `Not just a result. The reason behind it.` Demonstrate honest screenshot-like real component from the app: **Household answer → Government requirement → Current evidence → Likely result**. Source verified/time status must reflect actual record. If no verified scheme is published, use a labelled illustrative UI, not a fake “verified yesterday” chip. Content status not merely green checkmarks.

**Chapter 06 — From eligible to ready (sage):** Large vertical timeline of `Understand -> Prepare -> Contact/Apply officially -> Follow up`. Pair with third appropriate photo or a cropped printable action sheet. Highlight `Take a simple checklist with you` and link to action-sheet flow. No fake “application submitted successfully” illustration.

**Chapter 07 — Trust layer (ivory):** H2 `Rules can change. Your explanation should show it.` 2-column editorial comparison of `Source confirmed` vs `Needs review`; note human verification and official links. This is the distinguishing engineering story. Under review != definitive ineligible.

**Chapter 08 — Inclusive by design (white):** Real accessibility benefits: English/Hindi when functional, assisted mode, print/low-data, without invasive ID capture. Avoid claiming offline mode if it only caches shell. Use one full-width photographic strip only if properly sourced and optimized.

**Chapter 09 — Final invitation (brand dark forest):** H2 in ivory `Start with what you know.` Primary light CTA `Explore possible benefits`; secondary `See help & privacy`; concise “Independent; final decisions belong to departments.” Then complete footer: nav, sources process, image credits (if needed), privacy, last deployment note only if real, not fake impact numbers.

**Scroll mechanics**: keyboard/natural browser scrolling always; anchor links with `scroll-margin-top` compensating sticky header; no snap scroll; `IntersectionObserver` only where useful for subtle active section marker, not to block content. Reduced-motion has immediate full visibility.

### D2. Discover `/discover`
Focus one task, no marketing hero. Heading `Tell us about your household` with reassuring 2-line intro. Language switch above form. Full input textarea with meaningful accessible label, example outside placeholder, optional speech button only if browser support and clear recording/transcription consent are implemented. Example selectable synthetic scenarios clearly marked. Screen before send prevents likely Aadhaar/bank/OTP/password, with field-level error and no raw value sent to an AI provider. Secondary structured `Answer step by step` path when parser cannot confidently extract. Clear progress/resume behavior and top-level back link.

### D3. Confirm `/discover/confirm`
Do not interpret the parser's text as truth. Display individually editable **proposed facts**: household vs member identity, district, community as self-reported, rural/urban, housing status, government-employed household member, relevant scheme attributes (only sourced). Each fact shows `You said`, confidence or `We couldn't determine`, selection/edited value. Numeric inputs enforce correct min/max/units; booleans actual true/false/unknown, not string `'true'`. Save only confirmed facts; show a plain privacy note. Contradictions require clarification.

### D4. Decisive questions `/discover/questions`
One question at a time, left back link, right supportive `Why we ask` panel. Real rule provenance if verified. `Yes / No / I don't know`, never forced yes. Questions ordered by likely ability to distinguish result; dynamically conditional flow. If count changes, don't show fake fixed percentage. Browser back retains answers. At finish state next results is based on confirmed typed facts.

### D5. Results `/results`
Top headline `Possible support for your household` with neutral summary: `Based on the details you confirmed and the published sources currently reviewed.` Four distinct sections: `Likely fit` / `Need an answer` / `Likely mismatch` / `Source needs review` **when nonempty**; count grounded in actual loaded records. Scheme cards: title, department/beneficiary unit, reason, outstanding question(s), source status, next meaningful action, 1 primary `Understand this scheme`. No guessed score percentage, ₹ totals or deadlines. Control to edit answers. Full empty/loading/error states, and a public scope notice.

### D6. Scheme detail `/schemes/:slug`
Reading hierarchy: scheme title -> source status -> concise purpose -> **eligibility evidence** table -> documents (required/recommended/not stated) -> step-by-step official action -> deadline status (date if verified, otherwise `No verified deadline available`) -> official source link and `last human verified` date -> caveats. Rule trace row: `Rule | What you told us | Government condition | Evaluation | Source`, with active version. Conflicting source with a visible banner and blocks definitive recommendation. Link to official government portal, never mimic it or capture login/OTP.

### D7. My Journey `/journey` + `/journey/:slug`
Summary not an analytics dashboard: `Your next action` prominent, then active scheme journeys, then completed history. Each has real checklist, owner/status and local time. Status options `Not started`, `Preparing documents`, `Contacted office`, `Applied on official channel` (self-reported), `Waiting for response`, `Completed`, `Paused`. A timestamped readable change history; undo/correct actions. Documents marked `Needed`, `Available`, `Not applicable`, `Need to confirm`, never ask to upload. Relevant checklist links to exact source. On reload, state survives in the chosen safe local store; `Clear my information` genuinely deletes it.

### D8. Reminder and action sheet
Reminder UI distinguishes `Official published deadline` (requires source + verified date) from `My own follow-up date`. Export valid `.ics` with stable UID, timezone/UTC DTSTART, SUMMARY, DESCRIPTION without sensitive family facts, and a sanitized official URL where needed. Show instructions for importing into device calendar; do not claim automatic notifications. Print CSS letter/A4 with high contrast, no full-page background photos, numbered actionable steps, official links, last reviewed info, user-selected safe fields only, `Not an official certificate` footnote. Browser print must not expose raw narrative if it had identifiers.

### D9. Help/Privacy
Help includes what status labels mean, why a question appears, how to use official sources, why the service cannot approve a benefit, assisted workflow, use without speech/online, and troubleshooting. Privacy accurately lists locally saved items and server-stored catalogue/reviewer data, what is never requested, AI provider if enabled, erase action, retention/limitations; do not imply user data is always stored when it is only in React state.

### D10. Reviewer workbench
This is **not** a pretty fake admin chart. Left rail: `Review queue`, `Schemes`, `Version compare`, `History`. Table defaults to evidence-needed schemes, sortable by last checked, flags on conflicts. Detail page contains official URL, source quote/section, eligibility expression builder with typed operands, active effective range, reason for change, reviewer signature. Draft -> test synthetic profiles -> check conflicts -> publish through authenticated server permission. A fresh viewer must be unable to publish using a direct API request even if they manipulate DOM. Audit timeline shows approved version, time, reviewer and content hash/diff. No false “live sync from government” without a real ingestion process.

---

## E. TARGET PROJECT STRUCTURE — EVOLVE EXISTING FILES, DON'T CREATE A SCATTERED REWRITE

**Inspect actual tree first.** The following is a desired logical module map, **not an instruction to create every file**. Retain existing code where it passes, avoid duplicate Home/router/shared state. Only split modules that genuinely need it.

```text
SevaKrit/
├─ SKILL.md                         # this permanent execution/UX standard
├─ MASTER_BUILD_PROMPT.md           # one canonical build sequence
├─ README.md                        # setup, exact verified claims, image credits
├─ STATUS.md                        # concise real phase gate / unresolved blockers
├─ .env.example                     # names only, NEVER real keys
├─ package.json / lockfile          # use existing versions/commands
├─ index.html
├─ public/
│  ├─ images/
│  │  ├─ home-context.webp           # licensed/generated; metadata in README
│  │  ├─ home-preparation.webp
│  │  └─ home-nextstep.webp
│  └─ favicon.svg                    # original simple brand identity
├─ src/
│  ├─ main.tsx                       # React bootstrap; existing file preferred
│  ├─ App.tsx                        # canonical Router; delete duplicate only safely
│  ├─ styles/
│  │  ├─ tokens.css                  # exact token variables and font mappings
│  │  ├─ global.css                  # resets/typography/focus/layout
│  │  └─ print.css                   # A4/letter action sheet
│  ├─ components/
│  │  ├─ layout/                      # Header, MobileNav, Footer, PageShell
│  │  ├─ ui/                          # Button, Field, Alert, StatusTag, Dialog
│  │  ├─ marketing/                   # HeroStory, StoryChapter, RealJourneyPreview
│  │  ├─ evidence/                    # EligibilityTrace, SourceCard, VerificationChip
│  │  └─ journey/                     # DocumentRow, NextAction, ProgressTimeline
│  ├─ pages/
│  │  ├─ Home.tsx                     # scroll narrative; use existing Home if there
│  │  ├─ Intake.tsx                   # existing entry: refactor not duplicate
│  │  ├─ ConfirmFacts.tsx
│  │  ├─ Questions.tsx
│  │  ├─ Results.tsx                   # from actual rules
│  │  ├─ SchemeDetail.tsx
│  │  ├─ Plan.tsx                      # existing or rename to MyJourney with migration
│  │  ├─ ActionSheet.tsx
│  │  ├─ Help.tsx
│  │  ├─ Privacy.tsx
│  │  └─ Review.tsx                    # actual role-protected reviewer workspace
│  ├─ context/
│  │  └─ AppState.tsx                 # existing: confirmed typed facts, safe reset
│  ├─ domain/
│  │  ├─ types.ts                     # Zod schemas, model contracts
│  │  ├─ evaluate.ts                  # pure provenance-gated eligibility engine
│  │  ├─ questions.ts                 # rank unanswered outcome-changing facts
│  │  ├─ evidence.ts                  # source validation/conflict/effective intervals
│  │  ├─ readiness.ts                 # plan from evaluated scheme, not catalogue
│  │  └─ applicationStatus.ts         # self-reported transition rules
│  ├─ services/
│  │  ├─ parseNarrative.ts            # safe tentative extraction with fallback
│  │  ├─ safeInput.ts                 # Aadhaar/OTP/etc check before retention
│  │  ├─ schemeRepository.ts          # existing published-data loader
│  │  ├─ progressRepository.ts        # existing, read/write/clear/undo
│  │  ├─ reminderRepository.ts        # existing, real read/write
│  │  ├─ calendarExport.ts            # valid downloadable ICS
│  │  ├─ supabaseClient.ts            # public/publishable anon key only
│  │  └─ reviewerRepository.ts        # server-authenticated draft/version writes
│  ├─ i18n/
│  │  ├─ en.ts                        # typed message keys
│  │  └─ hi.ts                        # reviewed Hindi, no broken placeholders
│  └─ data/                           # sample seeds marked sample, NEVER verified by default
├─ e2e/
│  ├─ citizen-journey.spec.ts         # from new visitor to action sheet and reload
│  ├─ source-uncertainty.spec.ts      # stale rule, negative gate, conflict, unknown
│  ├─ reviewer-security.spec.ts       # actual auth/RLS where test backend exists
│  └─ visual-accessibility.spec.ts    # viewport/DOM/overflow/reduced motion
├─ supabase/
│  ├─ migrations/                    # inspect existing SQL; add additive migrations
│  └─ tests/                         # SQL role and permission regression scripts
└─ .github/workflows/ci.yml          # only if GitHub Actions allowed and configured
```

**Exact responsibilities:**
- **Domain** has no React, DOM, network, current-time calls in render or unchecked DB objects. All evaluation is a pure `(profile, publishedSchemeVersion, asOf) => trace` function.
- **Repositories** own persistence/network, all schema parsing, caching and safe error states, not JSX.
- **Components** receive validated props and expose semantic roles/labels; no government rule literals in components.
- **Pages** orchestrate route-specific queries/state. Public screens must never contain reviewer service role logic.
- **Reviewer** always has backend authorization, not only hidden navigation. Avoid account creation for residents unless essential.
- **Local persistence** uses carefully versioned safe minimum state; raw narrative and identifiers not persisted. Be explicit whether `localStorage` or IndexedDB and test migration/clear.
- No new giant framework, animation package, image CDN, AI SDK or global state manager merely because a design template suggests it. Confirm actual React/Vite/Tailwind/Router versions from `package.json` rather than trusting this prompt.

---

## F. FULL DATA MODEL AND NON-NEGOTIABLE BACKEND CONTRACT

**Recommended:** existing React + TypeScript + Vite + Tailwind + React Router + Vitest + Playwright (verify installed versions). Zod for validation. Supabase PostgreSQL + Auth for reviewer, Postgres Row Level Security (RLS) for actual access. Optional Supabase Edge Function for *consented redacted* AI text extraction; no API keys inside `VITE_` client variables except public Supabase URL/anon key. The core eligibility and action plan work without AI.

### F1. Typed domain model (exact shape can adapt to code)

```ts
type Check = 'pass' | 'fail' | 'unknown' | 'source_unverified';
type Eligibility = 'likely_fit' | 'needs_information' | 'likely_mismatch' | 'source_under_review';
type Evidence = {
  sourceId: string;
  officialUrl: string;          // primary government source, validated
  authority: string;
  documentTitle: string;
  clauseRef?: string;          // exact numbered paragraph or official heading
  officialUpdatedAt?: string; // date published by authority, if available
  fetchedAt?: string;         // ingestion time, not a human approval
  humanVerifiedAt?: string;   // actual reviewer time; absent if never checked
  reviewStatus: 'verified' | 'pending' | 'conflicting' | 'expired';
};
type RuleTrace = {
  ruleId: string; ruleVersionId: string; evidenceIds: string[];
  factPath: string; actual: string | number | boolean | null;
  operator: string; expected: unknown; check: Check;
  explanation: string;
};
type SchemeDecision = {
  schemeId: string; versionId: string; eligibility: Eligibility;
  ruleTraces: RuleTrace[]; missingFactPaths: string[];
  sourceWarnings: string[]; evaluatedAt: string;
};
```

Use **discriminated Zod schemas** for all operators and typed values: `eq/in/gte/lte/and/or/not`, household member vs household-level scope, region, temporal validity, exclusive criteria. Distinguish user `unknown` from a source conflict. Closed-world exclusions only when source verified. The source status *precedes* decisive PASS/FAIL; a stale source must not drive a confident negative. Preserve exact rule version used in every saved evaluation. Date comparisons operate on effective dates and explicit timezone, not `new Date()` inside React render.

### F2. Database tables; inspect existing migrations first
Do **additive migrations**, preserving any valid existing DB schema. Model/check constraints at least:

| Table | Minimum columns / purpose | Access model |
|---|---|---|
| `schemes` | id, slug unique, title_en/hi, state_code, target_audience, department, status draft/published/retired, created_at, updated_at | anonymous SELECT published only; reviewer write |
| `scheme_rule_versions` | id, scheme_id, version_number, effective_from/to, rule_ast JSONB, review_status, source_verified_at, published_at, immutable content_hash | SELECT ONLY published approved current versions; reviewer edit draft, publish once |
| `sources` | id, official_url, issuing_authority, document_title, clause_ref, official_updated_at, fetched_at, human_verified_at, verification_status, conflict_note | only approved evidence on public paths; protected edits |
| `scheme_sources` | scheme/version, source FK, source role and clause | public SELECT where parent version public, reviewer writes |
| `document_requirements` | id, version_id, kind, applicable_condition, required_stage, source_id, verified_status | public for published versions only |
| `application_steps` | id, version_id, step_index, action, authority, official_url, required_if, source_id | public for published versions only |
| `deadline_events` | id, version_id, event_type, date nullable, timezone, verified_at, source_id | public only verified; missing = unknown |
| `reviewer_memberships` | user_id from Auth, role viewer/editor/publisher, active | user sees own; only trusted admin manages roles |
| `review_events` | id, scheme_id, draft/published version IDs, action, reviewer_id, reason, old/new hash/diff, created_at | immutable; sanitized public summary optional |
| `source_conflicts` | source IDs, field, explanation, status open/resolved, reviewer, resolved_at | reviewer edits; public warning if affecting published content |

**Citizen tracking**: prefer local IndexedDB or localStorage (versioned, safe minimum, explicit consent to keep data) for anonymous households. A server `citizen_progress` table is **optional**, not automatically required; if implemented use authenticated owner-only `auth.uid()` RLS, avoid account identity fields and sensitive details. Do not implement an anonymous global progress bucket visible to everyone.

### F3. Release and RLS invariants
- Parent record published does NOT automatically confer access to children: explicit RLS on *each* table (sources, version rules, documents, steps, dates) plus security-definer or server functions only where proven necessary.
- Prevent unauthorized direct REST/SQL writes even with invented JSON input, manipulated frontend admin state or forged role passed from browser.
- `published` rule versions immutable; modify a **new draft version**, test, then publish by trusted function/transaction. Atomic active-version switch and audit event; old result can be reconstructed.
- Prevent SSRF/source-link abuse by URL validation allowlist for “official” status; don't assume `https` alone makes a source official.
- Reject null/1970 placeholder human verification dates. No deadline? keep NULL; display unknown. Do not use program inception time as application deadline.
- Use safe migration policies for already existing test data. Verify applied migration in the actual Supabase project before saying backend connected.
- Tests: anon published read permitted; anon draft read denied; anon writes denied; reviewer editor allowed only approved operations; cross-role/cross-user data denied; public source child table available if approved; old versions not mutated.

### F4. Scheme leads requiring primary-source review (NOT pre-verified records)
- Aahar Anudan: https://cmhelpline.mp.gov.in/KnowYourEntitleDetail.aspx?Schemeid=904&pointvalue=0&status=BySchemeFor
- Dairy animal distribution: https://cmhelpline.mp.gov.in/KnowYourEntitleDetail.aspx?Schemeid=981&pointvalue=1&status=ByText
- PM-JANMAN rural housing: https://cmhelpline.mp.gov.in/KnowYourEntitleDetail.aspx?Schemeid=974&pointvalue=2&status=byschemefor
- Union Ministry programme portal: https://tribal.nic.in/PM-JANMAN.aspx

Earlier inspection described an **official source contradiction** on the dairy listing's category, an Aahar entry with an older published update and no separate application process, and housing dependent on Gram Sabha/local verification. These are source-research leads, **not** sufficient to publish a household match. For **every** target scheme, confirm as-of date, exact beneficiary unit (individual/head/household), geography, active/excluded conditions, benefit and currency if stated, documents with citations, authentic application steps, real deadline or no verified deadline, office contacts, review status and known conflicts. Preserve direct source URL and exact clause text fragment within fair quotation limits. If one required fact is absent, mark it `not stated / needs confirmation`, not a fabricated answer.

---

## G. ADDITIONS THAT DIFFERENTIATE — BUILD ONLY IF THEY CONNECT TO USER ACTION

1. **Living Household Benefit Graph**: visually show potential schemes and shared prerequisites without a fake certainty score. Nodes are scheme/requirement/office/actions with condition links. Start as accessible list; interactive graph only if usable on mobile.
2. **Decisive Question Engine**: prioritize unanswered facts that actually distinguish published rule outcomes; `Why we ask` explains the exact rule, not the model's subjective reasoning.
3. **Source Conflict Radar**: `verified / stale / conflicting / unverified` with evidence and reviewer workflow; prevents definitive denial based on contradictory or old rules.
4. **Before/After Rule Simulator**: synthetic household evaluation against two immutable versions, highlighting the exact condition changed and source; strongest reviewer demo feature.
5. **Document Reuse Matrix**: when verified, show a certificate needed for more than one chosen scheme and prepare it once; never upload/store document contents.
6. **Application Readiness Score** (optional): calculated from user-confirmed preparation items only (e.g. 3/5 prerequisites ready), **not an eligibility probability** and not used as a misleading success prediction.
7. **Self-Reported Progress Ledger**: events with time, description, option to undo/correct, resume without registration, no fake government syncing.
8. **Printable/portable HaqPath Pass**: one-page checklist or action sheet with no QR linking to sensitive query parameters; if QR used it can only link to the public official page, never a personal profile.
9. **Assisted Access**: neutral large-text, language and step-by-step mode for community workers; local session clear before assisting another household. No unverified NGO partnerships.
10. **Honest Failure Mode**: if official scheme verification is incomplete, tell the user what is uncertain and which official department/page to check, instead of a fabricated confident scheme recommendation.

**Feature priorities:** (1) evidence-gated working citizen vertical slice, (2) readiness/persistence, (3) reviewer simulator and secure backend, (4) landing/visual polish, (5) native-language and speech enhancement. Every feature must pass acceptance tests; do not implement all ten as decorative tiles.

---

## H. EXACT IMPLEMENTATION PHASES — ONE PHASE AT A TIME

### PHASE 0 — Inspect source truth and prove the baseline
**Before:** confirm current local repo, reference clone, source PDF availability, competition rules; audit Git status; compare both trees; inventory actual working features and licenses. Run package checks and `npm audit`. Locate existing tests/migrations and inspect all active routes. Deliver a concise verified defect list and scope map. **Gate:** no invented code paths or assumptions; baseline commands have real logs. Do not modify product while merely inventorying.

### PHASE 1 — Stabilize foundations and unify the visual system
Fix broken imports/duplicate Home if actually present; establish single route shell; make CSS design tokens, fonts, `PageShell`, `Button`, `FormField`, `StatusTag`, responsive header/mobile nav/footer. Preserve existing accessibility. Include `skip to content`, visible focus, fixed/normal nav semantics, light responsive footer, contextual breadcrumbs on interior pages. Test rendering of all existing routes with initial local state. **Gate:** every route reachable; 320/360/768/1440 no overflow, no dead CTA/nav; no regressions; visual theme has one source of truth.

### PHASE 2 — Government evidence + deterministic domain core
Select one **fully reviewable** scheme and encode only verified/current conditions, plus evidence source and correct review state. Fix rule version repository and provenance gating including negative/OR exclusions. Add complete synthetic tests positive, negative, unknown, source unverified, overlapping effective dates. Implement SourceCard and EligibilityTrace. Add second scheme only if its full rules are actually verifiable; otherwise label under review instead of fake publication. **Gate:** real result trace shows why and which precise source; stale/ambiguous source NEVER yields definitive positive/negative. Domain test suite passes.

### PHASE 3 — Typed intake through decisions
Build real `/discover`, `/discover/confirm`, `/discover/questions`, `/results`, `/schemes/:slug` on the existing app. Safe input validation before state/network, typed extraction + manual form fallback, contradictory input handling, real missing rule questions, edit/back/reload behavior, result filtering/ranking from actual profile, explainability views. A user must not need AI API keys to finish. **Gate:** a fresh visitor reaches real reasons and actionable scheme detail; invalid/user-unknown/status-case tests pass end to end.

### PHASE 4 — Readiness / follow-through + printable artifact
Generate steps and documents only from selected result and verified catalogue; support progress timeline, save/reload/undo/reset, reminder `.ics`, privacy copy consistent with actual storage, printable action sheet, storage/offline failure state. **Gate:** real previously saved progress visible after full reload, clear-all deletes safely, reminder file contains real date user selected, print opens correctly, no sensitive IDs retained.

### PHASE 5 — Authentic Supabase backend & reviewer workflow
Apply/reconcile migrations to real DB (credentials required and only after consent/configuration). Wire actual `supabase-js` public reads; no `source.json` pretend backend. Implement reviewer Auth and server-authorized versions/publish/audit, source conflict flag, profile simulator, RLS tests for every child table. **Gate:** recorded real DB read, reviewer publish changes public results while old rule remains immutable, anonymous draft/write is denied. If credentials unavailable report backend **BLOCKED** and continue independent UI/test work rather than falsifying it.

### PHASE 6 — Refine the nine-chapter editorial home + photography
**Required image-and-story acceptance gate:** import all four bundled source images into `public/images/story/`, implement the hooks and image placement exactly as section C5–C6, add the relevant truthful figure captions, and test browser-resolved assets, visual crops and natural scrolling at every target viewport. Do not mark Phase 6 complete if images are visible only in the Markdown document or if a subsection relies on fake live data.
Now that live components exist, build the long-form landing and borrow **actual** data-driven preview elements. Use licensed documentary and/or clearly synthetic images with correct captions and responsive formats; implement the calm multi-section scroll sequence described above. Fix loading/motion/empty states, all navigation, contact/source links. **Gate:** homepage is comprehensible and compelling at 360px and 1440px, everything on the story preview actually routes/works, image licenses/alt/size accounted for. No unsubstantiated numbers or testimonials.

### PHASE 7 — Hindi, inclusion, optional voice
Translate all visible user paths and statuses with reviewed Hindi (ideally native validation), ensure Devanagari fonts and long labels fit. Add voice only if browser/service permissions, speech-to-text accuracy and offline/failure behavior can be tested; show explicit permission/retention copy. Better no voice than fake microphone. Improve low-bandwidth and assisted clear-session. **Gate:** both real language paths complete, no partial placeholder translation, screen reader/keyboard/200%-zoom safe.

### PHASE 8 — Adversarial testing, hosted production and proof
Run complete positive/mismatch/unknown/source-review stories on desktop/mobile; test five kinds of broken state: API error, offline, corrupt local storage, stale government source, no DB credentials/permission. Run unit/lint/typecheck/build/audit/E2E, source and image link checks, privacy and RLS probes, DOM extraction + screenshots, production cold start incognito. Validate calendar download, print CSS and sensitive-data no-leak. Deploy SPA with rewrite fallback, record working URL only when verified. **Gate:** production citizen flow and reviewer flow (if backend credentials permitted) work from fresh browser; known limitations explicit, no false claims.

### PHASE CHECKPOINT EXECUTION RULE
After **EVERY** phase, execute checks A-D in section I; classify PASS/FAIL/BLOCKED; fix all P0/P1 regressions and rerun. Only after a verified gate, `git diff --check`, inspect `git diff --stat`, `git status --short`, check no keys/private images, make a small descriptive commit; push only if remote auth/competition policy permit. No forced push. If phase failed, do not label it complete or make an “everything works” commit. Next phase starts with reading current status, not rereading the entire long prompt.

---

## I. FOUR INDEPENDENT CROSS-CHECKS AFTER EACH PHASE — DOM EXTRACTION REQUIRED

**Do not run the same check four times. Four independent lenses detect different classes of defect.** After changing a page, check it in actual Chromium via Playwright as well as unit tests. If Playwright/browser unavailable, mark browser check `BLOCKED`, show why and do not claim page visually tested.

### CHECK A — Source, build, dependency and logic contracts
- Read `git diff` exactly; all changed imports/exports resolved; no unapproved new dependency; update Zod schemas and tests; no render-time random/new Date in UI.
- Run appropriate TypeScript, lint, unit, build and vulnerability review commands; test edge rule gates and effective dates.
- Recompare the **actual** source URL and scheme record. Confirm no unverified field became a verified label. Verify tests fail if relevant logic is intentionally broken (no vacuous tests).
- Audit React warning keys, duplicate Home/router, missing labels/icons and stale docs.

### CHECK B — Real user DOM + behavior + network/console
Use Playwright. Inspect semantic roles/headings/forms/links/labels **after each meaningful click**, not just screenshot pixels. Also capture browser console/page errors and failed network responses. Suggested script pattern (adapt config/test runner, do not paste as untested universal code):

```ts
import { test, expect } from '@playwright/test';

test('DOM contract for citizen journey', async ({ page }) => {
  const browserErrors: string[] = [];
  const httpFailures: string[] = [];
  page.on('pageerror', err => browserErrors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') browserErrors.push(msg.text());
  });
  page.on('response', response => {
    if (response.status() >= 400) httpFailures.push(`${response.status()} ${response.url()}`);
  });
  await page.goto('/');
  const DOM = await page.evaluate(() => ({
    title: document.title,
    lang: document.documentElement.lang,
    headings: [...document.querySelectorAll('h1,h2,h3')]
      .map(el => ({ tag: el.tagName, text: el.textContent?.trim() })),
    nav: [...document.querySelectorAll('nav a')]
      .map(el => ({ text: el.textContent?.trim(), href: el.getAttribute('href') })),
    controls: [...document.querySelectorAll('button,input,select,textarea')]
      .map(el => ({ tag: el.tagName, text: el.getAttribute('aria-label') ||
        (el as HTMLElement).textContent?.trim(), disabled: (el as HTMLButtonElement).disabled })),
    pictures: [...document.querySelectorAll('img')].map(i => ({
      alt: i.alt, complete: i.complete, naturalWidth: i.naturalWidth,
      currentSrc: i.currentSrc
    })),
    overflow: [...document.querySelectorAll('body *')]
      .filter(el => el.getBoundingClientRect().right > innerWidth + 2)
      .slice(0, 12).map(el => ({ tag: el.tagName, className: el.className?.toString() }))
  }));
  console.log('DOM_AUDIT', JSON.stringify(DOM));
  expect(DOM.headings.filter(h => h.tag === 'H1')).toHaveLength(1);
  expect(DOM.overflow).toHaveLength(0);
  expect(DOM.pictures.filter(i => !i.complete || !i.naturalWidth)).toHaveLength(0);
  expect(browserErrors).toEqual([]);
  // Review legitimate 4xx endpoints separately; do not assume every expected auth 401 is a bug.
});
```

For every route test click-through, route and back, filters, buttons, save/reload, `aria-expanded`, text that appears/disappears, actual persisted records, semantic status, hidden menus. Verify outbound request bodies never contain raw Aadhaar/bank/OTP. Use accessible `getByRole` / `getByLabel` locators, not brittle CSS-only selectors. Add trace on retries, screenshots for each key route, inspect DOM snapshot BEFORE asserting design is correct. Real screenshot ≠ correct function.


**Mandatory image/story DOM audit during CHECK B (Phase 6 and full release):** for each expected source image confirm `document.querySelector('img[src*="/images/story/"]')` or the `<picture>` fallback resolves; `img.complete === true`, `img.naturalWidth > 0`, a meaningful `alt` or explicitly decorative alt, and a visible accurate `<figcaption>` on synthetic human scenes. Inspect `window.getComputedStyle(img).objectFit`, cropping/`getBoundingClientRect()` and actual `currentSrc`. Extract the nine chapter headings in DOM order, test real primary and footer CTA `href`s, check no repeated marketing CTA is broken, inspect keyboard and reduced-motion visibility. A successful HTTP 200 is insufficient if the wrong picture is displayed or faces are cropped.

### CHECK C — Responsive, accessibility, typographic and motion audit
- Screens: **320, 360, 390, 768, 1024, 1440px**; portrait mobile and desktop. Test Hindi longer strings and browser zoom 200%; no overlapping footer, CTAs behind fixed navbar, clipped badges, scroll-trapping dialogue or horizontal overflow.
- Check focus order tab-by-tab; skip link, menu ESC, dialog trap and restore focus, form errors use `aria-describedby`, buttons/links identifiable, image alt appropriate, heading hierarchy and live announcements. Use `@axe-core/playwright` if already installed or justified.
- Verify actual foreground/background contrast per computed styles, not a token table alone; disabled and hover/focus states too. Respect `prefers-reduced-motion: reduce`.
- Capture before/after screenshots or Playwright snapshots per route and review them for awkward whitespace, image focal point, typography, unprofessional animation or invisible controls.

### CHECK D — Evidence, privacy, security and hosted reality
- Cross-read rendered scheme details against official sources and reviewer evidence. The same sample household positive and negative result must produce correct rule ID/source IDs; unknown/human-unverified must NEVER be a confident mismatch.
- Attempt forbidden reviewer actions as anonymous user at network/API layer; verify RLS on child tables, not merely missing admin menu.
- Search DOM, network logs, local/session storage and action-sheet output for sensitive test IDs. Test clear-data and session switching. No browser-bundled service-role key/AI key and no exposed raw inputs.
- Check external official links and asset license links; verify displayed `last verified` means actual human review, not source footer time.
- On deployment, repeat full flow **from fresh anonymous/incognito browser** and capture actual network/console outcomes. If no deployment yet, D = BLOCKED for production subset, never PASS.

### Minimal per-phase verification record, saved in existing STATUS.md

```text
Phase X — [scope], [git SHA]
A static/contracts: PASS|FAIL|BLOCKED — <real command/assertion>
B DOM/behavior:   PASS|FAIL|BLOCKED — <route, browser trace/test>
C responsive/a11y:PASS|FAIL|BLOCKED — <viewports, focus, issue>
D source/security: PASS|FAIL|BLOCKED — <source/RLS/network evidence>
Outstanding P0/P1: ...
Next permitted action: ...
```

Never claim 100% defect-free, universal compatibility or “four independent checks passed” if you only read code or visually scanned one screenshot. Checks do not override missing direct government verification.

---

## J. FIXTURE SCENARIOS, QA MATRIX AND TRUTHFUL DEMO

**Synthetic data only**. Do not treat these example characteristics as sufficient for official eligibility without full verified rules:

| Scenario | Purpose | Expected behaviour |
|---|---|---|
| Baiga family, Dindori, kutcha home, government employment unknown | uncertain question path | decisive question/needs information, NOT auto-approved |
| Same family, all required independently confirmed conditions satisfy verified housing rule | possible fit | likely fit + every clause + local confirmation caveat |
| Same family, has pucca house where verified rule excludes | verified negative | likely mismatch with exact verified exclusion trace |
| Same condition with unverified/external stale source | fail-closed | source under review, **not** mismatch |
| Household outside verified geographic restriction | scope guard | exclude only if the restricted geography is actually current and reviewed |
| Conflicting category on official dairy source | source conflict | blocked from confident recommendation until reviewer adjudicates |
| User enters Aadhaar-like input | privacy | error and no outbound/persistence; check false positives |
| Narrative says “no government job” vs checkbox says “yes” | contradiction | explicit reconcile step; no guessed fact |
| Numeric income written Hindi/English or omitted | typing | confirm parsed number and units or ask |
| Checklist item saved then full reload | persistence | accurate persisted item, actual progress history, user clear resets |
| Anonymous user calls reviewer publish endpoint | authorization | server denies; inspect DB policy and API response |
| Reviewer publishes new rule with source | versioning | new eval differs appropriately; previous version stays immutable |
| Offline at scheme detail | resilience | honest cache freshness and no unverified “updated now” message |
| Language switch in a complex form | inclusion | input preserved and all visible labels/errors actually translated |

**Demo sequence (<5 min, no theatrical fake integrations):** open visually elegant Home and scroll 2–3 chapters; start clearly labelled sample household; edit one fact; answer one outcome-changing question; open a real source-backed matching scheme and cite actual rule; add one checklist item and own follow-up reminder; reload to show real saved progress; download `.ics` + printable sheet; switch synthetic case to a verified negative/unknown; reviewer changes a draft rule and shows before/after only if secure backend live. Mention independently operated service and final decision with department.

---

## K. FINISHING, TOKEN CONTROL AND RESPONSE FORMAT FOR NEXEN

**Time matters**: public hackathon information indicates build event around **November 21–22, 2026**, with some ambiguity on submission/completion window. Verify organizer's binding cutoff and actual eligibility for pre-existing code before doing feature work. Do not claim qualification or deadline from ambiguous promotional material.

**No token-waste instructions:** no broad vague rewrites, no 10 subagents, no useless architecture prose after coding starts, no dozens of placeholder files, no nightly “keep going forever”. Smaller model should preserve attention for one issue at a time. Every phase:
1. Read only the necessary source files and their call sites (plus applicable source URL).
2. State exact planned change and tests in <=8 lines.
3. Implement focused, executable code and one or more meaningful regression tests.
4. Run checks A–D and fix failures.
5. Summarize `actual files changed`, `proof`, `blockers` (<=25 lines) in `STATUS.md` or final IDE message.
6. Commit+push only after legitimate checks and credentials/rules permit; no `git push --force`.
7. Start the next **highest-priority** failing gate; never redesign completed working paths without test evidence.

**Priority if time/token constrained:** truthful evidence-gated citizen journey > persistence/action sheet/reminders > secure reviewer rule compare > documented polished landing > Hindi quality > optional speech > decorative extras. If only one scheme is actually source-valid, demonstrate that correctly and disclose coverage; never fake the second.

**Success:** a trustworthy professional product in which elegant design and evidenced engineering reinforce each other—not a copied Nagarakshak repo and not a beautiful static mockup. Report honest unresolved blockers. Begin Phase 0 now. Inspect local repo first, then cloned reference, then actual PDF/rules, before touching implementation.
