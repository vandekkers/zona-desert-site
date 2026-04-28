#!/usr/bin/env node
// Local-only utility: generate OWNER_PASSWORD_HASH + OWNER_COOKIE_SECRET for Vercel env vars.
// Mirrors the constants in lib/owner-auth.ts so the produced hash verifies in the Edge runtime.
//
// Usage: npm run generate-owner-secrets

import { webcrypto } from "node:crypto";
import { stdin as input, stdout as output } from "node:process";
import readline from "node:readline/promises";

// MUST match lib/owner-auth.ts exactly.
const PBKDF2_ITERATIONS = 600_000;
const PBKDF2_HASH = "SHA-256";
const SALT_BYTES = 16;
const DERIVED_KEY_BYTES = 32;
const COOKIE_SECRET_BYTES = 32;

const MIN_PASSWORD_LENGTH = 12;

function bytesToHex(bytes) {
  let s = "";
  for (let i = 0; i < bytes.length; i++) {
    s += bytes[i].toString(16).padStart(2, "0");
  }
  return s;
}

async function pbkdf2(password, salt, iterations, keyLenBytes) {
  const baseKey = await webcrypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const bits = await webcrypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: PBKDF2_HASH },
    baseKey,
    keyLenBytes * 8
  );
  return new Uint8Array(bits);
}

async function main() {
  const rl = readline.createInterface({ input, output, terminal: true });
  let password;
  try {
    password = await rl.question(
      `Enter the owner password (min ${MIN_PASSWORD_LENGTH} chars). It will not be echoed back: `
    );
  } finally {
    rl.close();
  }

  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    console.error(`\nError: password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
    process.exit(1);
  }

  const salt = webcrypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const derived = await pbkdf2(password, salt, PBKDF2_ITERATIONS, DERIVED_KEY_BYTES);
  const cookieSecret = webcrypto.getRandomValues(new Uint8Array(COOKIE_SECRET_BYTES));

  const ownerPasswordHash = `${bytesToHex(salt)}:${bytesToHex(derived)}`;
  const ownerCookieSecret = bytesToHex(cookieSecret);

  output.write("\n");
  output.write("Add these two environment variables to Vercel (Production scope):\n\n");
  output.write(`OWNER_PASSWORD_HASH=${ownerPasswordHash}\n`);
  output.write(`OWNER_COOKIE_SECRET=${ownerCookieSecret}\n`);
  output.write("\n");
  output.write("Steps:\n");
  output.write("  1. Open Vercel project Settings -> Environment Variables.\n");
  output.write("  2. Paste both lines above (Production scope only).\n");
  output.write("  3. Trigger a redeploy so the new vars are picked up.\n");
  output.write("  4. Visit https://zonadesert.com/__owner-access and sign in.\n");
  output.write("\nDo NOT commit these values. Re-run this script anytime to rotate.\n");
}

main().catch((err) => {
  console.error("Failed to generate owner secrets:", err);
  process.exit(1);
});
