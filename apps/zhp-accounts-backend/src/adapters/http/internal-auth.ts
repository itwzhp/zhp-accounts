import type { Request } from "express";
import { jwtVerify, SignJWT } from "jose";
import { config } from "@/config";

interface InternalAuthTokenPayload {
  sub: string;
  allowedUnitIds: number[];
  allowedMemberNumbers: string[];
}

const secretKey = new TextEncoder().encode(config.internalAuthJwtSecret);

function readHeader(request: Request, name: string): string | null {
  const rawValue = request.headers[name.toLowerCase()];

  if (typeof rawValue === "string") {
    return rawValue;
  }

  if (Array.isArray(rawValue) && rawValue.length > 0) {
    return rawValue[0] ?? null;
  }

  return null;
}

export async function generateInternalAuthToken(input: InternalAuthTokenPayload): Promise<string> {
  const issuedAt = Math.floor(Date.now() / 1000);

  return await new SignJWT({
    allowedUnitIds: [...new Set(input.allowedUnitIds)],
    allowedMemberNumbers: [...new Set(input.allowedMemberNumbers)],
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(input.sub)
    .setIssuedAt(issuedAt)
    .setExpirationTime(issuedAt + config.internalAuthJwtTtlSeconds)
    .sign(secretKey);
}

export async function verifyInternalAuthToken(
  request: Request,
): Promise<InternalAuthTokenPayload | null> {
  const token = readHeader(request, "x-internalauth");

  if (!token) {
    return null;
  }

  try {
    const verificationResult = await jwtVerify<InternalAuthTokenPayload>(token, secretKey, {
      algorithms: ["HS256"],
      typ: "JWT",
    });

    return verificationResult.payload;

  } catch {
    return null;
  }
}