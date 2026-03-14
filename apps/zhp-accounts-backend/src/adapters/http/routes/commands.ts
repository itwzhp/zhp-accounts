import { Router, type Request, type Response, type Router as ExpressRouter } from "express";
import type { CreateAccountCommand, GenerateTapCommand } from "zhp-accounts-types";
import { config } from "@/config";
import { NullEntraAccountCommandsAdapter } from "@/adapters/entra/null-entra-account-commands-adapter";
import { createAccount } from "@/use-cases/accounts/create-account";
import { generateTap } from "@/use-cases/accounts/generate-tap";
import { verifyInternalAuthToken } from "../internal-auth";
import { getRequestIdentity } from "../azure-auth";

const router: ExpressRouter = Router();
const accountCommandsPort = new NullEntraAccountCommandsAdapter();

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

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parseCreateAccountCommand(body: unknown): CreateAccountCommand | null {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return null;
  }

  const membershipNumber = (body as { membershipNumber?: unknown }).membershipNumber;

  if (!isNonEmptyString(membershipNumber)) {
    return null;
  }

  return {
    membershipNumber: membershipNumber.trim(),
  };
}

function parseGenerateTapCommand(body: unknown): GenerateTapCommand | null {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return null;
  }

  const parsed = body as {
    membershipNumber?: unknown;
    email?: unknown;
  };

  if (!isNonEmptyString(parsed.membershipNumber) || !isNonEmptyString(parsed.email)) {
    return null;
  }

  return {
    membershipNumber: parsed.membershipNumber.trim(),
    email: parsed.email.trim(),
  };
}

async function validateCommandRequest(req: Request): Promise<{
  login: string;
  requesterMemberNum: string;
  allowedMemberNumbers: readonly string[];
} | null> {
  const authorizationHeader = readHeader(req, "authorization");
  const internalAuthToken = readHeader(req, "x-internalauth");
  const identity = getRequestIdentity(req);

  if (!authorizationHeader || !internalAuthToken || !identity.login || !identity.memberNum) {
    return null;
  }

  const verifiedToken = await verifyInternalAuthToken(
    internalAuthToken,
    config.internalAuthJwtSecret,
  );

  if (!verifiedToken || verifiedToken.sub !== identity.memberNum) {
    return null;
  }

  return {
    login: identity.login,
    requesterMemberNum: identity.memberNum,
    allowedMemberNumbers: verifiedToken.allowedMemberNumbers,
  };
}

router.post("/commands/CreateAccount", async (req: Request, res: Response): Promise<void> => {
  try {
    const authContext = await validateCommandRequest(req);

    if (!authContext) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const command = parseCreateAccountCommand(req.body);

    if (!command) {
      res.status(400).json({ error: "Invalid CreateAccount command payload" });
      return;
    }

    if (!authContext.allowedMemberNumbers.includes(command.membershipNumber)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const payload = await createAccount(accountCommandsPort, command, authContext.login);

    res.status(200).json(payload);
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/commands/GenerateTap", async (req: Request, res: Response): Promise<void> => {
  try {
    const authContext = await validateCommandRequest(req);

    if (!authContext) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const command = parseGenerateTapCommand(req.body);

    if (!command) {
      res.status(400).json({ error: "Invalid GenerateTap command payload" });
      return;
    }

    if (!authContext.allowedMemberNumbers.includes(command.membershipNumber)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const payload = await generateTap(accountCommandsPort, command, authContext.login);

    res.status(200).json(payload);
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;