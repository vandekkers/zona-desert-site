# DEALS_BREAKAWAY.md — how to remove the deals board at platform launch

The `/deals` board (and its `/deal-desk` owner tool) is a temporary,
standalone off-market deal page. It has zero dependencies on the platform
(no API calls, no auth code of its own, no shared components), so removal is
a delete-and-two-line-restore operation. Search the repo for `BREAKAWAY` to
find every trace.

## Delete these (entire files/folders)

| Path | What it is |
|---|---|
| `app/(deals)/` | The whole route group: board, deal pages, `/deal-desk`, the `/api/deals-admin` GitHub gateway, layout, components, math lib |
| `content/deals/` | One JSON file per deal, plus `_SCHEMA.json` and `_TEMPLATE.json` |
| `content/deals-config.json` | Phone / email / headline / repo config |
| `content/DEALS_README.md` | The founder's plain-English instructions |
| `public/deals/` | Uploaded deal photos |
| `DEALS_BREAKAWAY.md` | This file |

(JSON files cannot carry code comments; `deals-config.json` and `_SCHEMA.json`
carry a `$comment` breakaway note inside their data instead of a `//` marker.)

## Also remove from Vercel

- The `GITHUB_DEALS_TOKEN` environment variable (Production scope) — the
  deal-desk publishing gateway's GitHub credential. Revoke the fine-grained
  PAT itself at github.com → Settings → Developer settings while you're at it.

## Restore the marked lines in `middleware.ts`

All are marked with `// BREAKAWAY: deals board`:

1. **Delete** the `"/deals",` entry from `BYPASS_PREFIXES`.
2. **Restore** the non-owner target from `"/deals"` back to `"/coming-soon"`,
   and the response from `redirect` back to `rewrite` (the wall should not
   change the URL):

```ts
url.pathname = "/coming-soon";
url.search = "";
return NextResponse.rewrite(url);
```

(`/deal-desk` needs no middleware change — it was never bypassed; deleting
its folder removes the page.)

## Verify

1. `grep -ri BREAKAWAY .` (excluding node_modules) returns nothing.
2. `npm run build` passes and the route table no longer lists `/deals` or
   `/deal-desk`.
3. Logged-out visit to `/` shows `/coming-soon` again; `/__owner-access`
   login still works (it was never touched).
