# Owner Access — Setup & Daily Use

This site is walled behind a coming-soon page. Every visitor sees `/coming-soon` until launch.
Van bypasses the wall via a hidden login at `/__owner-access`. After signing in once,
a 90-day signed cookie keeps Van logged in on that browser/device.

No new dependencies. Authentication uses the Web Crypto API (PBKDF2 + HMAC-SHA-256)
and runs on Vercel's Edge runtime.

---

## 1. One-time setup (do this once, locally)

You need to set two environment variables in Vercel.

### Generate them

From the repo root:

```bash
npm run generate-owner-secrets
```

The script prompts for a password (minimum 12 characters, not echoed back), then prints
two lines:

```
OWNER_PASSWORD_HASH=<long hex string>:<long hex string>
OWNER_COOKIE_SECRET=<long hex string>
```

### Paste them into Vercel

1. Open the Vercel dashboard for the `zona-desert-site` project.
2. Go to **Settings → Environment Variables**.
3. Add two new variables, **Production scope only**:
   - Name: `OWNER_PASSWORD_HASH` — Value: the full hex string after `=` from the script output.
   - Name: `OWNER_COOKIE_SECRET` — Value: the full hex string after `=` from the script output.
4. Click **Save** for each.

### Redeploy

Trigger a redeploy so Vercel picks up the new env vars (Deployments → … → Redeploy,
or push any commit). The wall is now active.

---

## 2. Daily use

1. Bookmark **`https://zonadesert.com/__owner-access`** in every browser/device you use.
2. Visit the bookmark, enter the password, click **Continue**.
3. You'll be redirected to the real site. The cookie lasts **90 days** in that browser.
4. Every other visitor still sees the coming-soon page.

Repeat the bookmark step on each browser/device you want access from.

---

## 3. Force re-auth / log out

To clear your owner cookie on the current browser:

```bash
curl -X POST https://zonadesert.com/api/__owner-access/logout
```

…then re-visit `/__owner-access` to log back in. Or just clear cookies for `zonadesert.com`
in your browser's site settings.

---

## 4. Forgot password

1. Re-run `npm run generate-owner-secrets` locally with a new password.
2. Update both `OWNER_PASSWORD_HASH` and `OWNER_COOKIE_SECRET` in Vercel
   (Settings → Environment Variables).
3. Trigger a redeploy.
4. Note: rotating `OWNER_COOKIE_SECRET` invalidates every existing owner cookie,
   so every device will need to re-auth at `/__owner-access`.

---

## Files involved

| File | Purpose |
|---|---|
| `middleware.ts` | Edge middleware: rewrites every non-bypass route to `/coming-soon` unless the owner cookie verifies. |
| `lib/owner-auth.ts` | PBKDF2 password verify + HMAC-SHA-256 cookie sign/verify. Web Crypto only. |
| `app/coming-soon/page.tsx` | The aesthetic landing page everyone else sees. |
| `app/__owner-access/page.tsx` | The hidden login form. |
| `app/api/__owner-access/login/route.ts` | POST: verify password, set cookie. |
| `app/api/__owner-access/logout/route.ts` | POST: clear cookie. |
| `scripts/generate-owner-secrets.mjs` | Local utility (this script). |
