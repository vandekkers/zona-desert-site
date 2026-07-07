// BREAKAWAY: deals board — remove at platform launch
//
// Owner-only gateway: lets /deal-desk create, update, and delete deal
// files by committing to GitHub's contents API. This is the deals
// group's ONLY server-side integration and it talks exclusively to
// api.github.com — there is still no platform backend involved.
//
// Auth: the same owner-access cookie that gates the site (verified
// here directly — middleware also screens non-owners, this is defense
// in depth). Credentials: a fine-grained GitHub PAT with Contents
// read/write on the deals repo, stored as GITHUB_DEALS_TOKEN in Vercel.
// Every commit to main triggers the normal Vercel rebuild, so changes
// go live the same way a hand-made GitHub edit would.

import { NextRequest, NextResponse } from "next/server";
import { OWNER_COOKIE_NAME, verifyOwnerCookie } from "@/lib/owner-auth";
import configRaw from "@/content/deals-config.json";
import { validateDeal } from "../../_lib/deal-shared";

const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const GITHUB_HEADERS = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28"
});

async function getExistingSha(
  repo: string,
  path: string,
  token: string
): Promise<string | undefined> {
  const res = await fetch(
    `https://api.github.com/repos/${repo}/contents/${path}?ref=main`,
    { headers: GITHUB_HEADERS(token), cache: "no-store" }
  );
  if (!res.ok) return undefined;
  const body = (await res.json()) as { sha?: string };
  return body.sha;
}

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get(OWNER_COOKIE_NAME)?.value;
  if (!(await verifyOwnerCookie(cookie))) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const token = process.env.GITHUB_DEALS_TOKEN;
  if (!token) {
    return NextResponse.json(
      {
        error:
          "Gateway not configured — add a GITHUB_DEALS_TOKEN environment variable in Vercel (fine-grained PAT, Contents read/write on the deals repo) and redeploy."
      },
      { status: 503 }
    );
  }

  let body: { action?: string; id?: string; deal?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { action, id, deal } = body;
  if (typeof id !== "string" || !ID_PATTERN.test(id)) {
    return NextResponse.json(
      { error: "Invalid deal id (lowercase letters/numbers/hyphens only)." },
      { status: 400 }
    );
  }

  const repo: string = configRaw.repo;
  const path = `content/deals/${id}.json`;

  if (action === "delete") {
    const sha = await getExistingSha(repo, path, token);
    if (!sha) {
      return NextResponse.json({ error: `No deal file found for "${id}".` }, { status: 404 });
    }
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      method: "DELETE",
      headers: GITHUB_HEADERS(token),
      body: JSON.stringify({
        message: `deal-desk: remove ${id}`,
        sha,
        branch: "main"
      })
    });
    if (!res.ok) {
      const detail = ((await res.json().catch(() => null)) as { message?: string })?.message;
      return NextResponse.json(
        { error: `GitHub rejected the delete (${res.status}${detail ? `: ${detail}` : ""}).` },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true, action: "delete", id });
  }

  if (action === "upsert") {
    const errors = validateDeal(deal);
    if (errors.length > 0) {
      return NextResponse.json({ error: "Deal failed validation.", errors }, { status: 400 });
    }
    if ((deal as { id: string }).id !== id) {
      return NextResponse.json(
        { error: "Deal id does not match the target file id." },
        { status: 400 }
      );
    }
    const sha = await getExistingSha(repo, path, token);
    const content = Buffer.from(JSON.stringify(deal, null, 2) + "\n", "utf8").toString("base64");
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      method: "PUT",
      headers: GITHUB_HEADERS(token),
      body: JSON.stringify({
        message: `deal-desk: ${sha ? "update" : "add"} ${id}`,
        content,
        branch: "main",
        ...(sha ? { sha } : {})
      })
    });
    if (!res.ok) {
      const detail = ((await res.json().catch(() => null)) as { message?: string })?.message;
      return NextResponse.json(
        { error: `GitHub rejected the commit (${res.status}${detail ? `: ${detail}` : ""}).` },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true, action: sha ? "update" : "create", id });
  }

  return NextResponse.json({ error: 'Unknown action — use "upsert" or "delete".' }, { status: 400 });
}
