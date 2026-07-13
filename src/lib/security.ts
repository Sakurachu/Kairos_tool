import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export function createToken() {
  return randomBytes(24).toString("base64url");
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function hashVisitor(activityId: string, visitorId: string) {
  const salt = process.env.VISITOR_SALT || process.env.DATABASE_URL || "local";
  return hashToken(`${salt}:${activityId}:${visitorId}`);
}

export function tokensMatch(token: string, expectedHash: string) {
  const actual = Buffer.from(hashToken(token), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
