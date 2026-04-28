// Edge-runtime safe owner auth utilities (Web Crypto API only).
// Used by middleware.ts + app/api/__owner-access/* routes.
// Mirror these constants in scripts/generate-owner-secrets.mjs.

export const PBKDF2_ITERATIONS = 600_000;
export const PBKDF2_HASH = "SHA-256" as const;
export const SALT_BYTES = 16;
export const DERIVED_KEY_BYTES = 32;
export const COOKIE_SECRET_BYTES = 32;

export const OWNER_COOKIE_NAME = "__zona_owner_access";
export const OWNER_COOKIE_MAX_AGE_SECONDS = 90 * 24 * 60 * 60; // 90 days

function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error("invalid hex length");
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    const byte = parseInt(hex.substr(i * 2, 2), 16);
    if (Number.isNaN(byte)) throw new Error("invalid hex character");
    out[i] = byte;
  }
  return out;
}

function bytesToHex(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i++) {
    s += bytes[i].toString(16).padStart(2, "0");
  }
  return s;
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function pbkdf2(
  password: string,
  salt: Uint8Array,
  iterations: number,
  keyLenBytes: number
): Promise<Uint8Array> {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password) as BufferSource,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as BufferSource, iterations, hash: PBKDF2_HASH },
    baseKey,
    keyLenBytes * 8
  );
  return new Uint8Array(bits);
}

async function hmacSha256(keyBytes: Uint8Array, message: string): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    new TextEncoder().encode(message) as BufferSource
  );
  return new Uint8Array(sig);
}

export async function verifyPassword(password: string): Promise<boolean> {
  if (!password) return false;
  const stored = process.env.OWNER_PASSWORD_HASH;
  if (!stored) return false;
  const sep = stored.indexOf(":");
  if (sep <= 0 || sep === stored.length - 1) return false;
  const saltHex = stored.slice(0, sep);
  const expectedHex = stored.slice(sep + 1);
  let salt: Uint8Array;
  let expected: Uint8Array;
  try {
    salt = hexToBytes(saltHex);
    expected = hexToBytes(expectedHex);
  } catch {
    return false;
  }
  if (salt.length !== SALT_BYTES || expected.length !== DERIVED_KEY_BYTES) return false;
  const derived = await pbkdf2(password, salt, PBKDF2_ITERATIONS, DERIVED_KEY_BYTES);
  return constantTimeEqual(derived, expected);
}

function getCookieSecret(): Uint8Array | null {
  const hex = process.env.OWNER_COOKIE_SECRET;
  if (!hex) return null;
  try {
    const bytes = hexToBytes(hex);
    if (bytes.length < 16) return null;
    return bytes;
  } catch {
    return null;
  }
}

export async function signOwnerCookie(): Promise<string | null> {
  const secret = getCookieSecret();
  if (!secret) return null;
  const expiry = Math.floor(Date.now() / 1000) + OWNER_COOKIE_MAX_AGE_SECONDS;
  const payload = String(expiry);
  const sig = await hmacSha256(secret, payload);
  return `${payload}.${bytesToHex(sig)}`;
}

export async function verifyOwnerCookie(cookie: string | undefined | null): Promise<boolean> {
  if (!cookie) return false;
  const dot = cookie.indexOf(".");
  if (dot <= 0 || dot === cookie.length - 1) return false;
  const payload = cookie.slice(0, dot);
  const sigHex = cookie.slice(dot + 1);
  const expiry = Number(payload);
  if (!Number.isFinite(expiry) || expiry <= 0) return false;
  if (Math.floor(Date.now() / 1000) >= expiry) return false;
  const secret = getCookieSecret();
  if (!secret) return false;
  let presented: Uint8Array;
  try {
    presented = hexToBytes(sigHex);
  } catch {
    return false;
  }
  const expected = await hmacSha256(secret, payload);
  return constantTimeEqual(presented, expected);
}
