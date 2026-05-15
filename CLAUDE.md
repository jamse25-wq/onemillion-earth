# CLAUDE.md — onemillion.earth
## Development Brief for Claude Code

This file contains everything Claude Code needs to understand the project, make good decisions, and help build it incrementally. Read it fully before starting any task.

---

## Project Overview

**onemillion.earth** is a carbon credit marketplace with a collective mission: facilitate the verified retirement of one million tonnes of CO₂, visualised as a globe slowly filling up with progress.

It is part carbon marketplace, part collective action campaign, part leaderboard competition. The experience should feel beautiful, credible, and emotionally resonant — not corporate, not preachy.

**Core proposition:**  
The globe is divided into segments representing one million tonnes of carbon. Individuals and companies browse real verified carbon projects, choose one, pay, and fund a verified tonne. Their contribution fills part of the globe and places them on a public leaderboard. The globe updates daily to reflect total progress.

**Domain:** onemillion.earth

**The founder is a solo non-technical builder.** All development decisions should prioritise:
- Simplicity over cleverness
- Working over perfect
- Incremental builds (get something live, then improve it)
- Avoiding over-engineering

---

## Tech Stack

Keep this as simple as possible. The following choices are intentional and should not be changed without discussion.

| Layer | Choice | Reason |
|---|---|---|
| Frontend | Plain HTML/CSS/JS or Next.js (simple) | No build complexity for solo founder |
| Globe visual | globe.gl (Three.js wrapper) | Best balance of quality and buildability |
| Database | Supabase (free tier) | Hosted Postgres, simple API, good free tier |
| Payments | Stripe | Industry standard, easy integration |
| Hosting | Vercel | Free tier, simple deploys, works with Next.js |
| Email | Resend | Simple API, generous free tier |

**Do not introduce additional dependencies without a clear reason.** Every new tool is a new thing to maintain.

---

## Globe Visual — Key Decision

The globe is the emotional centrepiece of the site. It must be beautiful but it does **not** need to be real-time.

**Chosen approach: daily batch update + static snapshot**

- Globe.gl renders a 3D draggable globe with filled hexagonal or dot-based segments
- Total fill level is stored as a single number (total tonnes purchased) in Supabase
- A lightweight daily cron job (Vercel cron or a simple script) recalculates what percentage of the globe should be filled and writes a JSON snapshot
- The globe loads this snapshot on page load — no live WebSocket connections required
- Recent purchases (last 20–30) are fetched from Supabase on load and shown as glowing point markers at approximate lat/lng positions
- New purchase markers animate onto the globe after checkout completes

**Visual spec for the globe:**
- Dark Earth texture background (use the texture from `unpkg.com/world-atlas`)
- Filled segments: glowing green (`#3ddc84`) with subtle bloom effect
- Unfilled segments: very dark, barely visible grid lines
- Atmosphere glow rim around the sphere
- Draggable and zoomable by the user
- Slow auto-rotation when idle
- On mobile: touch-draggable, slightly zoomed out

---

## Information Architecture

```
/                        — Hero + globe + live counter + ticker + CTA
/projects                — Browse carbon projects (marketplace)
/project/[slug]          — Individual project detail + purchase flow
/leaderboard             — Daily / Weekly / All-time leaderboard (by spend)
/purchase/success        — Post-purchase: certificate + share prompt
/why-carbon-credits      — Honest explainer: what credits are, what they aren't, how we choose projects
/about                   — Mission, how it works, team
/verify                  — Public transparency page: total credits retired, registry links
```

---

## Database Schema (Supabase)

Keep the schema minimal. These are the core tables needed for launch.

### `purchases`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | Auto-generated |
| created_at | timestamp | Auto |
| buyer_name | text | Public display name (or "Anonymous") |
| buyer_email | text | Private — never displayed publicly |
| is_anonymous | boolean | If true, show "Anonymous" on leaderboard |
| organisation | text | Optional — company name |
| project_slug | text | FK to projects table |
| tonnes | numeric | Carbon tonnes purchased |
| amount_gbp | numeric | Total paid in GBP (inc. platform fee) |
| carbon_cost_gbp | numeric | Amount passed to registry |
| platform_fee_gbp | numeric | Platform revenue |
| stripe_payment_id | text | For reconciliation |
| certificate_id | uuid | For certificate page |
| lat | numeric | Approximate lat for globe marker (random within country) |
| lng | numeric | Approximate lng for globe marker |
| country | text | Optional — buyer's country |

### `projects`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| slug | text | URL-friendly ID e.g. `kenya-cookstoves` |
| name | text | Display name |
| region | text | e.g. "Sub-Saharan Africa · Kenya" |
| description | text | 2–3 sentence description |
| long_description | text | Full project page content |
| price_per_tonne_gbp | numeric | Verified cost |
| credit_type | text | Either `"removal"` or `"avoidance"` — drives all copy generation |
| registry | text | e.g. "Gold Standard" |
| registry_url | text | Link to public registry entry |
| co_benefits | text[] | e.g. ["Biodiversity", "Community livelihoods"] |
| is_active | boolean | Toggle to hide projects |
| image_url | text | Hero image for project card |

### `globe_snapshot`
| Column | Type | Notes |
|---|---|---|
| id | int (PK) | Always just row ID 1 |
| updated_at | timestamp | When last recalculated |
| total_tonnes | numeric | Running total |
| total_purchases | int | Number of transactions |
| fill_percentage | numeric | total_tonnes / 1,000,000 × 100 |
| recent_markers | jsonb | Array of last 30 {lat, lng, name, tonnes, project} |

---

## Platform Fee Model

The platform charges an **18% processing fee** on top of the verified project price. This must be:
- Clearly displayed at checkout (not hidden)
- Broken out on the receipt/certificate
- Never described as a "carbon offset fee" — it is a platform fee

**Checkout calculation example:**
```
Project: Kenya Cookstoves — £14/tonne
Buyer wants: 5 tonnes
Carbon cost: £70.00
Platform fee (18%): £12.60
Total charged: £82.60

→ £70.00 passed to Gold Standard registry purchase
→ £12.60 is platform revenue
```

Stripe handles the payment. The registry purchase is currently **manual** at MVP stage — the founder reviews purchases weekly and batches the registry purchase. This is fine for early launch. Automate later.

---

## Leaderboard Logic

**Important: ranked by spend (total GBP paid), not by tonnes.**

Rationale: Two buyers could each purchase 100 tonnes but one may have spent significantly more on higher-quality projects. Spend-based ranking rewards choosing premium projects.

- Each leaderboard entry shows: rank, name/org, total spend (£), total tonnes, top project
- Anonymous buyers show as "Anonymous" — they still appear and contribute to totals
- Three views: Today / This Week / All Time (Hall of Fame)
- Query Supabase with appropriate `created_at` filters
- Update every hour (or on each page load — fine for MVP)

---

## Purchase Flow (Step by Step)

1. User lands on homepage, sees globe + counter + project cards
2. User clicks "Claim Your Segment" or a project card
3. If project card: land on `/project/[slug]` with full description
4. User selects number of tonnes using a slider or input (min: 1, max: no limit)
5. Price breakdown shown live: carbon cost + platform fee + total
6. User enters: name (or tick "Stay anonymous"), optional org, email
7. Click "Proceed to payment" → Stripe Checkout opens
8. On success: redirect to `/purchase/success?certificate=[id]`
9. Success page shows:
   - Certificate with buyer name, tonnes, project, date, registry badge
   - Globe animates their marker appearing
   - Share buttons (LinkedIn, X/Twitter, copy link)
   - Auto-generated shareable image (can use html2canvas or a simple OG image approach)
10. Confirmation email sent via Resend with certificate and registry link

---

## Certificate Design Requirements

The certificate is a key virality mechanic. It should look like something worth sharing.

- Landscape format, dark background matching site aesthetic
- Shows: buyer name/org, tonnes purchased, project name, date, registry verification badge
- Large central number (the tonnes) with unit
- Site URL and mission statement at the bottom
- Unique certificate ID visible (for verification)
- Available as: on-page view, downloadable PNG, shareable link (`/certificate/[id]`)

---

## Live Activity Ticker

A scrolling ticker across the top of the page showing recent purchases. Fetches the last 20 purchases from Supabase ordered by `created_at` desc. Refreshes every 60 seconds.

Format for removal/sequestration projects (reforestation, peatland, seagrass):
`🌿 [Name/Org] funded [X]t of carbon removal via [Project Name] · [Country if available]`

Format for avoidance projects (cookstoves, REDD+):
`🌿 [Name/Org] funded [X]t of emissions avoidance via [Project Name] · [Country if available]`

Anonymous buyers show as: `🌱 Someone in [Country] funded [X]t via [Project Name]`

Note: do not use "sequestered" generically for all projects — see Carbon Language Rules below.

---

## Carbon Projects — Launch Lineup

Start with these five projects. Add more over time. Each must have a live, linkable registry page before going live.

| Slug | Name | Region | Price/t | Registry | Credit Type |
|---|---|---|---|---|---|
| `kenya-cookstoves` | Efficient Cookstoves for Rural Families | Kenya | £14 | Gold Standard | avoidance |
| `borneo-reforestation` | Borneo Rainforest Regeneration | Malaysia | £22 | Gold Standard | removal |
| `scotland-peatland` | Scottish Peatland Restoration | Scotland | £38 | Woodland Carbon Code | removal |
| `cornwall-seagrass` | Seagrass Meadow Restoration | Cornwall | £45 | Pending — verify before launch | removal |
| `amazon-redd` | Amazon REDD+ Forest Protection | Brazil | £18 | Verra VCS | avoidance |

**Important:** Before launch, verify each project's registry page exists and is publicly accessible. The `/verify` page should link directly to each. Do not list a project without a live registry link.

---

## Transparency Page (`/verify`)

This page is central to the project's credibility. It should show:

- Total tonnes purchased through the platform (live from Supabase)
- Total GBP passed to registries (calculated: sum of `carbon_cost_gbp`)
- Breakdown by project
- Links to each project's live registry page
- Statement of platform fee and how it is used
- Date of last registry batch purchase (manually updated by founder)

This page exists to pre-empt greenwashing accusations. Make it easy to find — link it from the footer on every page.

---

## Build Order — Recommended Sequence

Build in this order. Each phase should be shippable before moving to the next.

### Phase 1 — Static foundation (no database)
- [ ] Homepage layout with placeholder globe (static SVG or simple canvas globe)
- [ ] Hero text, counter (hardcoded), CTA button
- [ ] 5 project cards (hardcoded data)
- [ ] Basic responsive layout (mobile-first)
- [ ] Deploy to Vercel

### Phase 2 — Globe
- [ ] Integrate globe.gl
- [ ] Hardcoded fill percentage (e.g. 0% to start)
- [ ] Auto-rotation + drag interaction
- [ ] Dark Earth texture + green filled segments
- [ ] Mobile touch support

### Phase 3 — Database + payments
- [ ] Set up Supabase — create tables as per schema above
- [ ] Set up Stripe — product for carbon purchase, webhook for success
- [ ] Purchase flow: project page → tonnes selector → checkout
- [ ] Post-purchase: write to Supabase, redirect to success page
- [ ] Basic certificate page

### Phase 4 — Live data
- [ ] Wire homepage counter to Supabase total
- [ ] Wire leaderboard to real purchases
- [ ] Wire ticker to real purchases
- [ ] Daily cron job to update `globe_snapshot` table
- [ ] Globe loads from `globe_snapshot` on page load

### Phase 5 — Polish + launch prep
- [ ] Certificate design + download/share (use correct credit_type language per project)
- [ ] Confirmation email via Resend
- [ ] `/verify` transparency page
- [ ] `/why-carbon-credits` page (see spec above)
- [ ] `/about` page
- [ ] Meta tags + OG image for social sharing
- [ ] Final mobile QA

---

## Tone & Copy Guidelines

The writing on this site should feel:
- **Purposeful but not preachy** — state facts, don't lecture
- **Precise** — use exact numbers, not vague claims
- **Quietly confident** — this is important work, it doesn't need to shout
- **Human** — individuals and small companies are as welcome as corporates

Avoid: "carbon neutral", "offset your footprint", "go green", "make a difference", "cancel out your emissions"
Use instead: "fund", "retire", "verified", "contribute to", "removal", "avoidance"

The mission statement to use consistently:  
> *"The globe is divided into one million segments. Help us fund one million tonnes of verified carbon action — one tonne at a time."*

---

## Carbon Language Rules

This is one of the most legally and reputationally sensitive areas of the site. Follow these rules precisely and consistently across all pages, components, and auto-generated content (certificates, emails, ticker).

### The core distinction

There are two fundamentally different types of carbon credit on this platform. They must never be described with the same language:

**Removal / Sequestration projects** — these physically extract CO₂ from the atmosphere and store it. Use "removal" or "sequestration" only for these.
- Examples on this platform: Borneo Reforestation, Scottish Peatland, Seagrass Cornwall

**Avoidance / Reduction projects** — these prevent emissions that would otherwise have occurred. They do not remove existing CO₂. Never use "sequester" or "remove" for these.
- Examples on this platform: Kenya Cookstoves, Amazon REDD+

### Required language per project type

| Project | Type | Correct verb | Incorrect |
|---|---|---|---|
| Kenya Cookstoves | Avoidance | "funded avoidance of", "prevented" | "sequestered", "removed" |
| Amazon REDD+ | Avoidance | "funded protection of", "prevented deforestation of" | "sequestered", "removed" |
| Borneo Reforestation | Removal | "funded removal of", "sequestered" | "offset", "cancelled out" |
| Scottish Peatland | Removal | "funded sequestration of", "removed" | "offset", "neutralised" |
| Seagrass Cornwall | Removal | "funded sequestration of", "removed" | "offset", "cancelled out" |

### Site-wide language rules

- **Never say "offset"** as a verb applied to the buyer's own emissions. Do not say "offset your carbon footprint" or "offset your emissions". A buyer is funding climate projects, not cancelling their own output.
- **Never say "carbon neutral"** in relation to a buyer's purchase or their organisation. The platform makes no such claim about any buyer's overall footprint.
- **Never say "net zero"** in relation to a buyer's purchase.
- **"Retire"** is the correct technical term for what happens to a credit after purchase — it is permanently removed from circulation in the registry. Use this on the transparency and verify pages.
- **"Fund"** is the safest all-purpose verb when you need one word that works for both project types: "fund a tonne of verified climate action".
- **"Verified tonne"** is acceptable and accurate — each credit represents one metric tonne of CO₂ equivalent, verified by the named registry.
- **The homepage counter** should read: "X tonnes funded" — not "sequestered", not "offset". This covers both project types accurately.
- **Certificates** must state the project type clearly: either "carbon removal" or "emissions avoidance" — never just "carbon offset".

### The store of each project must include a `credit_type` field

Add `credit_type` to the `projects` table: either `"removal"` or `"avoidance"`. All dynamic copy generation (ticker, certificates, emails) must reference this field to use the correct language automatically.

---

## Why Carbon Credits — Page Spec (`/why-carbon-credits`)

This page addresses scepticism head-on. It is one of the most important pages on the site for credibility with both individual buyers and corporate procurement teams. It should be well-written, honest, and not defensive.

### Page structure

**1. Opening statement (hero)**

> *"Carbon credits aren't perfect. But right now, they are one of the most effective ways to direct private finance to the projects that address the climate crisis. Here's how we think about them — and why we only list the ones we do."*

This tone is deliberate: acknowledge imperfection immediately. It disarms sceptics and signals honesty.

**2. Why credits matter — the core argument**

Write this as flowing prose, not bullet points. The argument to make:
- The climate crisis requires action at a scale that governments and regulation alone cannot move fast enough to fund
- Nature-based projects — forests, peatlands, seagrass, clean cookstoves — need sustained private finance to exist and continue
- Carbon credits are the mechanism that directs that finance at scale, with a verifiable unit of measurement
- An imperfect but verified tonne of action today is better than a perfect solution that arrives too late

**3. Our three non-negotiable criteria**

Every project listed on onemillion.earth must meet all three. Display these as three distinct visual sections, each with a short explanation:

**Additional**
> A project is additional if it would not have happened without carbon finance. We only list projects where the funding is genuinely the reason the work exists — not projects that were going to happen anyway and are simply claiming credit for it. This is verified independently by our registry partners.

**Co-benefits**
> Every project we list delivers benefits beyond carbon alone — to local ecosystems, biodiversity, and the communities that live alongside them. We display these co-benefits explicitly on every project page. Carbon that also protects orangutan habitat, improves air quality for families, or restores coastal ecosystems is carbon that earns its price.

**Certified to the highest standard**
> All projects are independently verified by Gold Standard, Verra (VCS), or the Woodland Carbon Code — the three most rigorous certification bodies in the voluntary carbon market. Certification means the carbon impact has been independently audited, the methodology is publicly available, and the credit is permanently retired in a public registry when you fund it. We link to every project's live registry entry so you can verify this yourself.

**4. What we don't claim**

A short, plain section that states clearly:
- Funding a tonne on onemillion.earth does not make you, your flight, or your organisation "carbon neutral"
- These projects are climate contributions, not cancellations
- We encourage buyers to reduce their own emissions first, and use this platform for the gap that remains

**5. Further reading**

Link to: Gold Standard website, Verra VCS, Integrity Council for the Voluntary Carbon Market (ICVCM), and the `/verify` transparency page.

### Design notes for this page
- Dark, clean, text-led — this is not a marketing page, it's an honest conversation
- No hero image — open with the text statement directly
- The three criteria should feel weighty and considered, not like a checklist
- Include the `/verify` link prominently — it proves the claims on this page

---

## Key Constraints & Reminders

1. **Never claim to make the buyer "carbon neutral", "net zero", or say their emissions are "offset"** — the purchase funds verified climate projects. That is all it claims to do. This is both legally safer and more honest.

2. **Use the correct verb for each project type** — "removal"/"sequestration" for reforestation/peatland/seagrass; "avoidance"/"prevention" for cookstoves/REDD+. See Carbon Language Rules above. The `credit_type` field in the projects table drives this automatically.

3. **Every project must link to a public registry page** before it goes live. No exceptions.

4. **Platform fee must be disclosed at checkout**, not buried in T&Cs.

5. **The globe is updated daily, not in real-time.** State this subtly on the page (e.g. small label: "Globe updated daily").

6. **Keep the Supabase schema minimal** — resist adding columns "just in case". Add them when needed.

7. **Test Stripe in test mode** until the first real purchase is ready to process.

8. **Anonymous mode is not optional** — some buyers will not want public profiles. Always honour this.

9. **The site domain is onemillion.earth** — use this consistently in all meta tags, OG images, certificates, and emails.

---

## Future Features (Do Not Build Yet)

These are good ideas for later. Do not let them scope-creep the launch:

- Gifting a tonne to someone else
- Corporate bulk purchase / invoice flow
- API for companies to integrate purchases into their own checkout
- Auto-purchasing from registry via API (currently manual batch)
- "Season 2" mechanism for when 1 million tonnes is reached
- Native mobile app

---

## Questions to Answer Before First Commit

Before writing any code, make sure these are resolved:

1. Do you have a Supabase account set up?
2. Do you have a Stripe account set up (even in test mode)?
3. Have you verified at least 3 of the 5 project registry links are live?
4. Have you registered onemillion.earth and pointed it to Vercel?
5. Do you have a Vercel account?
6. Have you confirmed your registry partner (Gold Standard recommended first) and have a contact there?

If any of these are no — start there before touching code.
