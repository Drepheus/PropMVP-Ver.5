# PropAnalyzed MVP-Ver.5 — Workflow & UX Guidelines

## Core Philosophy: **Utility Over Bloat**

Every screen serves a single purpose. The user should be able to triage a property in 60 seconds or less.

---

## Primary Flow: Search → Triage → Decide

### Step 1: Property Search
- Search bar → type address → autocomplete suggests matches
- Click **"Analyze Property"** to submit
- For local dev testing, typing "test" shows 3 pre-seeded mock Phoenix addresses

### Step 2: Instant Triage View (DEFAULT after search)
The triage view loads as a **full-screen, clean layout** — NOT buried in tabs.

**Layout hierarchy (top to bottom):**

1. **Hero Section (top 25%)**
   - Address (large, bold, lowercase)
   - "Last analyzed X min ago • Property verified" badge
   - **Deal Score** — the biggest thing on screen (e.g. `8/10` or `A+`), color-coded:
     - Green = Hot deal (score ≥ 7)
     - Yellow = Moderate (score 4–6)
     - Red = Cold (score ≤ 3)
   - 4–6 horizontal signal pills:
     - `High Equity` • `Absentee Owner` • `Vacancy Signal` • `Strong Comps` • `Off Market` etc.
     - Derived from property data (equityPercent, ownerOccupied, listingStatus, comps)

2. **One-Row Key Metrics (flex grid)**
   - Beds • Baths • Sqft • Year Built
   - Est. Value • Equity $ • Equity %
   - ARV • MAO • Projected Profit (3 big financial numbers)

3. **Two Massive Action Buttons (side-by-side)**
   - **CLAIM DEAL** — bright green, primary → opens ClaimDealModal
   - **KILL IT** — red/orange, secondary → shows kill reason menu

4. **Secondary: "Full Deep-Dive Analysis" button**
   - Small, top-right or below action buttons
   - Opens existing 6-panel analysis (ARV, Comps, Repairs, MAO, Deal Analysis) inside a **right-side Sheet/Drawer**
   - Does NOT replace or navigate away from triage view

### Step 3a: CLAIM DEAL
- Immediately calls `/api/leads/claim` endpoint
- Shows success toast: "Lead claimed! Moving to My Leads"
- Navigates to `/lead-management` with the new lead pre-selected, status = "New"
- Pre-filled notes field pops for immediate context capture

### Step 3b: KILL IT
- Shows popover with kill reasons (Low Equity, High Repair Cost, No Distress Signal, Bad Location, Over-leveraged)
- Archives the decision for pattern learning
- Fades out the property, auto-focuses search bar for next property

### Step 3c: Full Deep-Dive
- Opens existing panels (ARV Calculator, Repair Cost Estimation, MAO Calculator, Deal Analysis) in a Drawer
- All existing calculator logic preserved — no code wasted
- Back/close button returns to clean triage view

---

## Navigation Structure

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Market Intelligence | Market research + news feeds |
| `/property-search` | Search & Decide (Dashboard) | Property search → triage |
| `/analytics` | Analytics Dashboard | Portfolio analytics |
| `/lead-management` | Lead Management | Pipeline tracking |
| `/make-offer` | Make Offer | Offer generation |
| `/secure-contract` | Secure Contract | Contract management |

## Keyboard Shortcuts (Triage View)
- `C` — Open Claim Deal modal
- `K` — Open Kill It menu
- `Enter` — Confirm claim (when modal is open)

---

## Design Tokens

- **Theme**: Pure black background (`bg-black`, `bg-[#050505]`)
- **Accent**: Emerald green (`emerald-500`) for primary actions
- **Danger**: Red (`red-400`, `red-500`) for kill/destructive actions
- **Text**: White for primary, `slate-400/500` for secondary
- **Borders**: `slate-900` hairline borders
- **Radius**: `rounded-2xl` for cards, `rounded-xl` for buttons
- **Font**: System + ultra-bold weights, tiny uppercase tracking labels

## Local Dev Testing

When `DATABASE_URL` is not set, the app runs in **in-memory mode** with:
- 3 pre-seeded mock Phoenix properties (type "test" in search to find them)
- 1 pre-seeded "Hot" lead for Lead Management testing
- Admin Bypass login (no credentials needed)
- No external API calls required
