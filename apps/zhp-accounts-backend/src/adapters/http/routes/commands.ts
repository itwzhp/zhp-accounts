import { Router, type Request, type Response, type Router as ExpressRouter } from "express";
import type { CreateAccountCommand, GenerateTapCommand } from "zhp-accounts-types";
import { createAccount } from "@/use-cases/accounts/create-account";
import { generateTap } from "@/use-cases/accounts/generate-tap";
import { performFullAuth } from "../full-auth";

const router: ExpressRouter = Router();

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
  };

  if (!isNonEmptyString(parsed.membershipNumber)) {
    return null;
  }

  return {
    membershipNumber: parsed.membershipNumber.trim(),
  };
}

router.post("/commands/CreateAccount", async (req: Request, res: Response): Promise<void> => {
  try {
    const command = parseCreateAccountCommand(req.body);
    if (!command) { 
        res.status(400).json({ error: "Invalid CreateAccount command payload" });
        return;
    }
    const authResult = await performFullAuth(req, res, command.membershipNumber);
    if (!authResult) {
      return;
    }

    const payload = await createAccount(command, authResult.login);

    res.status(200).json(payload);
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/commands/GenerateTap", async (req: Request, res: Response): Promise<void> => {
  try {
    const command = parseGenerateTapCommand(req.body);
    if (!command) { 
        res.status(400).json({ error: "Invalid GenerateTap command payload" });
        return;
    }
    const authResult = await performFullAuth(req, res, command.membershipNumber);
    if (!authResult) {
      return;
    }

    const payload = await generateTap(command, authResult.login);

    res.status(200).json(payload);
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;