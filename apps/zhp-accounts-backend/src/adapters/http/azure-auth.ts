import type { Request } from "express";

interface AzureClientPrincipalClaim {
  typ: string;
  val: string;
}

interface AzureClientPrincipal {
  claims?: AzureClientPrincipalClaim[];
}

export interface AzureRequestIdentity {
  login: string | null;
  memberNum: string | null;
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

export function getAzureRequestIdentity(request: Request): AzureRequestIdentity {
  const login = readHeader(request, "x-ms-client-principal-name");
  const clientPrincipal = decodeClientPrincipal(
    readHeader(request, "x-ms-client-principal"),
  );
  const memberNum =
    clientPrincipal?.claims?.find((claim): boolean => claim.typ === "memberNum")?.val ?? null;

  return {
    login,
    memberNum,
  };
}
