# DEALS_BREAKAWAY.md — how to remove the deals board at platform launch

The `/deals` board is a temporary, standalone off-market deal page. It has zero
dependencies on the platform (no API calls, no auth, no shared components), so
removal is a delete-and-two-line-restore operation. Search the repo for
`BREAKAWAY` to find every trace.

## Delete these (entire files/folders)

| Path | What it is |
|---|---|
| `app/(deals)/` | The whole route group: board page, deal detail page, layout, components, data lib |
| `content/deals.json` | The deal "database" Van edits on GitHub |
| `content/deals-config.json` | Phone / email / headline config |
| `content/DEALS_README.md` | Van's plain-English editing instructions |
| `public/deals/` | Uploaded deal photos |
| `DEALS_BREAKAWAY.md` | This file |

(JSON files cannot carry code comments; the two `content/*.json` files carry a
`$comment` breakaway note inside their data instead of a `//` marker.)

## Restore these two lines in `middleware.ts`

Both are marked with `// BREAKAWAY: deals board`:

1. **Delete** the `"/deals",` entry from `BYPASS_PREFIXES`.
2. **Restore** the non-owner rewrite target from `"/deals"` back to
   `"/coming-soon"`:

```ts
url.pathname = "/coming-soon";
```

## Verify

1. `grep -ri BREAKAWAY .` (excluding node_modules) returns nothing.
2. `npm run build` passes and the route table no longer lists `/deals`.
3. Logged-out visit to `/` shows `/coming-soon` again; `/__owner-access` login
   still works (it was never touched).
