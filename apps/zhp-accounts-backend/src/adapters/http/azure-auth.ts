import type { Request } from "express";
import { config } from "@/config";

interface AzureClientPrincipalClaim {
  typ: string;
  val: string;
}

interface AzureClientPrincipal {
  claims?: AzureClientPrincipalClaim[];
}

export interface AzureRequestIdentity {
  login: string;
  memberNum: string;
}

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

function decodeClientPrincipal(encodedClientPrincipal: string | null): AzureClientPrincipal | null {
  if (encodedClientPrincipal === null || encodedClientPrincipal.length === 0) {
    return null;
  }

  try {
    const decoded = Buffer.from(encodedClientPrincipal, "base64").toString("utf8");

    return JSON.parse(decoded) as AzureClientPrincipal;
  } catch {
    return null;
  }
}

function getBearerToken(request: Request): string | null {
  const authorizationHeader = readHeader(request, "authorization");

  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token, ...rest] = authorizationHeader.trim().split(/\s+/);

  if (scheme?.toLowerCase() !== "bearer" || !token || rest.length > 0) {
    return null;
  }

  return token;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const [_, payloadBase64Url] = token.split(".");

  if (!payloadBase64Url) {
    return null;
  }

  try {
    const decodedPayload = Buffer.from(payloadBase64Url, "base64url").toString("utf8");
    const parsed = JSON.parse(decodedPayload) as unknown;

    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return null;
    }

    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

function readStringClaim(
  payload: Record<string, unknown>,
  claimName: string,
): string | null {
  const claimValue = payload[claimName];

  return typeof claimValue === "string" ? claimValue : null;
}

function getBearerRequestIdentity(request: Request): AzureRequestIdentity | null{
  const bearerToken = getBearerToken(request);

  if (!bearerToken) {
    return null;
  }

  const payload = decodeJwtPayload(bearerToken);

  if (!payload) {
    return null;
  }

  const login =
    readStringClaim(payload, "upn") ??
    readStringClaim(payload, "unique_name") ??
    readStringClaim(payload, "name");
  const memberNum = readStringClaim(payload, "memberNum");

  if (!login || !memberNum) {
    return null;
  }

  return {
    login,
    memberNum,
  };
}

function getAzureRequestIdentity(request: Request): AzureRequestIdentity | null {
  const login = readHeader(request, "x-ms-client-principal-name");
  const clientPrincipal = decodeClientPrincipal(
    readHeader(request, "x-ms-client-principal"),
  );
  const memberNum =
    clientPrincipal?.claims?.find((claim): boolean => claim.typ === "memberNum")?.val ?? null;

  if (!login || !memberNum) {
    return null;
  }

  return {
    login,
    memberNum,
  };
}

export function getRequestIdentity(request: Request): AzureRequestIdentity | null {
  if (config.isLocalInstance) {
    return getBearerRequestIdentity(request);
  }

  return getAzureRequestIdentity(request);
}
