import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "hec-admin-session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function getSessionSecret() {
  return process.env.ADMIN_PASSWORD;
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD);
}

export function verifyAdminCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) return false;

  return (
    safeEqual(email.trim().toLowerCase(), adminEmail.trim().toLowerCase()) &&
    safeEqual(password, adminPassword)
  );
}

export function createAdminSession() {
  const secret = getSessionSecret();
  if (!secret) throw new Error("ADMIN_PASSWORD is required to create an admin session.");

  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
  const nonce = randomBytes(16).toString("hex");
  const payload = `${expiresAt}.${nonce}`;
  return {
    token: `${payload}.${sign(payload, secret)}`,
    maxAge: SESSION_DURATION_SECONDS,
  };
}

export function isValidAdminSession(token: string | undefined) {
  const secret = getSessionSecret();
  if (!secret || !token) return false;

  const [expiresAtText, nonce, signature, ...extra] = token.split(".");
  if (
    extra.length > 0 ||
    !/^\d+$/.test(expiresAtText ?? "") ||
    !/^[a-f\d]{32}$/.test(nonce ?? "") ||
    !/^[a-f\d]{64}$/.test(signature ?? "")
  ) {
    return false;
  }

  const expiresAt = Number(expiresAtText);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) {
    return false;
  }

  const payload = `${expiresAtText}.${nonce}`;
  return safeEqual(signature, sign(payload, secret));
}
