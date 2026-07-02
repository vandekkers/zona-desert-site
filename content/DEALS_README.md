# How to add, edit, or remove a deal (no code needed)

<!-- BREAKAWAY: deals board — remove at platform launch -->

Everything on zonadesert.com/deals comes from **one file**: `content/deals.json`.
You edit it on the GitHub website, hit commit, and the live site updates itself
about 2 minutes later. No terminal, no deploys, no asking anyone.

## Add a deal

1. Go to the repo on github.com → open `content/deals.json` → click the
   **pencil icon** (Edit this file).
2. The first block in the file (the one full of `$comment` and `$fields`) is a
   cheat-sheet, not a deal. **Leave it alone.**
3. Copy an existing deal — everything from its opening `{` to its closing `}` —
   and paste it right below the cheat-sheet block. Add a comma after the `}` you
   pasted if another deal follows it.
4. Edit the values:
   - `id`: lowercase street address with hyphens, like `"1409-lakepointe-st"`.
     This becomes the link: zonadesert.com/deals/1409-lakepointe-st
   - `status`: `"available"`, `"pending"`, or `"sold"`
   - `price`, `arv`, `estRehab`, `estRent`: plain numbers — `129000`, not
     `"$129,000"`
   - `closeBy` and `featured` are optional — delete those lines if you don't
     need them.
5. Scroll down, write a short commit message ("add lakepointe deal"), click
   **Commit changes**.
6. Wait ~2 minutes. Refresh zonadesert.com/deals. Done.

**Careful with commas.** Every deal is separated by a comma, but there is NO
comma after the last one. If the site doesn't update, 9 times out of 10 it's a
missing or extra comma — GitHub's editor shows a red squiggle where the
problem is.

## Add photos

Two options:

**Option A — paste image links (fastest).** If the photos are already online
somewhere, paste the full `https://...` links straight into the deal's
`"photos"` list.

**Option B — upload to the repo.**
1. On github.com, navigate to `public/deals/` → **Add file → Upload files**.
2. Before uploading, GitHub asks for the folder: type the deal id as a new
   folder name (e.g. `public/deals/1409-lakepointe-st/`).
3. Name the files `1.jpg`, `2.jpg`, `3.jpg`... (first one is the cover photo).
4. Commit, then reference them in the JSON like
   `"/deals/1409-lakepointe-st/1.jpg"`.

Phone photos are fine. Keep them under ~2 MB each so the page stays fast.

## Mark a deal pending or sold

Edit the deal's `"status"` line. Pending and sold deals automatically drop
below available ones; sold deals grey out. Keeping a couple of sold deals on
the board is good marketing — it shows the pipeline is real.

## Change your phone number, email, or the headline

Edit `content/deals-config.json` the same way. Phone format: `"+1"` plus the
10 digits, like `"+13135550142"`. The Call/Text/Email buttons on every deal
use these.

## Remove a deal completely

Delete its whole block from `{` to `}` (and fix the commas). Or just flip it
to `"sold"` and keep the track record visible.
