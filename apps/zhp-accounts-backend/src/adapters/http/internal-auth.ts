import { jwtVerify, SignJWT } from "jose";

export interface InternalAuthTokenPayload {
  sub: string;
  allowedUnitIds: number[];
  allowedMemberNumbers: string[];
  iat: number;
  exp: number;
}

interface InternalAuthTokenInput {
  sub: string;
  allowedUnitIds: number[];
  allowedMemberNumbers: string[];
}

interface InternalAuthTokenOptions {
  secret: string;
  ttlSeconds: number;
}

function getSecretKey(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

function isInternalAuthTokenPayload(value: unknown): value is InternalAuthTokenPayload {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const payload = value as Record<string, unknown>;

  return (
    typeof payload.sub === "string" &&
    Array.isArray(payload.allowedUnitIds) &&
    payload.allowedUnitIds.every((unitId) => typeof unitId === "number") &&
    Array.isArray(payload.allowedMemberNumbers) &&
    payload.allowedMemberNumbers.every((memberNumber) => typeof memberNumber === "string") &&
    typeof payload.iat === "number" &&
    typeof payload.exp === "number"
  );
}

export async function generateInternalAuthToken(
  input: InternalAuthTokenInput,
  options: InternalAuthTokenOptions,
): Promise<string> {
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload: InternalAuthTokenPayload = {
    sub: input.sub,
    allowedUnitIds: [...new Set(input.allowedUnitIds)],
    allowedMemberNumbers: [...new Set(input.allowedMemberNumbers)],
    iat: issuedAt,
    exp: issuedAt + options.ttlSeconds,
  };

  return new SignJWT({
    allowedUnitIds: payload.allowedUnitIds,
    allowedMemberNumbers: payload.allowedMemberNumbers,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(payload.sub)
    .setIssuedAt(payload.iat)
    .setExpirationTime(payload.exp)
    .sign(getSecretKey(options.secret));
}

export async function verifyInternalAuthToken(
  token: string,
  secret: string,
): Promise<InternalAuthTokenPayload | null> {
  try {
    const verificationResult = await jwtVerify(token, getSecretKey(secret), {
      algorithms: ["HS256"],
      typ: "JWT",
    });
    const payload = {
      sub: verificationResult.payload.sub,
      allowedUnitIds: verificationResult.payload.allowedUnitIds,
      allowedMemberNumbers: verificationResult.payload.allowedMemberNumbers,
      iat: verificationResult.payload.iat,
      exp: verificationResult.payload.exp,
    } as unknown;

    if (!isInternalAuthTokenPayload(payload)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}