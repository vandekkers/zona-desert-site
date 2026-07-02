# How deals get on the board (no code needed)

<!-- BREAKAWAY: deals board — remove at platform launch -->

Every deal on zonadesert.com/deals is **one JSON file** in `content/deals/`.
Add a file → commit → the site rebuilds itself in ~2 minutes. There are three
ways to do it, easiest first.

## Way 1 — The deal desk (recommended)

1. Make sure you're logged in at `zonadesert.com/__owner-access` (same login
   as always, 90-day cookie).
2. Go to **`zonadesert.com/deal-desk`** — visitors without your login just get
   bounced to the public board, so this page is yours alone.
3. Fill in the form. Cap rate, NOI, cash flow, and spread compute live as you
   type, so you can sanity-check the deal before it ships.
4. Click **Commit deal on GitHub** — GitHub opens with the file name and
   contents already filled in. Scroll down, click **Commit changes**. Done.
5. If you used local photo paths, click **Upload photos** and drag the images
   into `public/deals/<deal-id>/` (name them `1.jpg`, `2.jpg`, … — the first
   one is the cover).

## Way 2 — Ask an AI to write the deal

The schema at **`content/deals/_SCHEMA.json`** is a machine-readable contract.
Paste it into any AI assistant (Claude, ChatGPT, whatever) along with your raw
deal notes — MLS sheet, text thread, voice-memo transcript — and say:

> "Produce one JSON object that validates against this schema for the
> following property: …"

Then paste the result into the **Paste JSON (AI)** tab on `/deal-desk`. It
validates instantly, shows you the computed numbers, and gives you the same
one-click GitHub commit. AI agents with repo access can go further and open a
pull request adding `content/deals/<id>.json` directly — the file format is
the whole integration surface.

## Way 3 — Edit on GitHub by hand

Copy `content/deals/_TEMPLATE.json`, rename it to your deal id
(e.g. `1409-lakepointe-st.json`), edit the values, commit. Since every deal
is its own file, you can't break other deals with a stray comma anymore.

## Field cheat-sheet

- `id` — lowercase-hyphenated street address; becomes the link
  (`zonadesert.com/deals/<id>`) and must match the filename.
- `status` — `available`, `pending`, or `sold`. Pending/sold sort below
  available; sold greys out. Keeping a few solds visible is good marketing.
- `strategy` — `["rental"]`, `["flip"]`, or both; controls which analysis
  tabs buyers see.
- `rental` block — give it `monthlyRent` plus whatever real numbers you have
  (`taxesAnnual`, `insuranceAnnual`, `hoaMonthly`…). Anything you leave out
  is estimated with standard assumptions (8% vacancy, 10% management,
  10% maintenance) and labeled "est." on the page.
- `terms` block — EMD, close method, access. Wholesalers and agents look for
  these first.
- `comps` — a couple of recent sales backing your ARV. Optional but powerful.
- Money fields are plain numbers: `129000`, never `"$129,000"`.

## Changing your contact info or the headline

Edit `content/deals-config.json` — phone (`+1` plus 10 digits), email, board
headline/subhead. The Call/Text/Email/offer buttons on every deal use these.
