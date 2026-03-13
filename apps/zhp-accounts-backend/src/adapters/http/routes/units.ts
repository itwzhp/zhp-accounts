import { Router, type Request, type Response, type Router as ExpressRouter } from "express";
import { NullTipiQueryAdapter } from "@/adapters/tipi/null-tipi-query-adapter";
import { config } from "@/config";
import { getMembers } from "@/use-cases/members/get-members";
import { getRootUnits } from "@/use-cases/units/get-root-units";
import { getSubUnits } from "@/use-cases/units/get-sub-units";
import { generateInternalAuthToken, verifyInternalAuthToken } from "../internal-auth";
import { getRequestIdentity } from "../azure-auth";

const router: ExpressRouter = Router();
const tipiQueryPort = new NullTipiQueryAdapter();

function parseNumericPathParam(value: string): number | null {
  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed)) {
    return null;
  }

  return parsed;
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

router.get("/units", async (_req: Request, res: Response): Promise<void> => {
  try {
    const membershipNumber = getRequestIdentity(_req)?.memberNum;

    if (!membershipNumber) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const units = await getRootUnits(tipiQueryPort, membershipNumber);
    const internalAuthToken = await generateInternalAuthToken(
      {
        sub: membershipNumber,
        allowedUnitIds: units.map((unit) => unit.id),
        allowedMemberNumbers: [],
      },
      {
        secret: config.internalAuthJwtSecret,
        ttlSeconds: config.internalAuthJwtTtlSeconds,
      },
    );

    res.status(200).json({
      units,
      internalAuthToken,
    });
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/units/:parentId", async (req: Request, res: Response): Promise<void> => {
  const parentId = parseNumericPathParam(req.params.parentId);

  if (parentId === null) {
    res.status(400).json({ error: "Invalid parentId path parameter" });
    return;
  }

  try {
    const authorizationHeader = readHeader(req, "authorization");
    const membershipNumber = getRequestIdentity(req)?.memberNum;
    const internalAuthToken = readHeader(req, "x-internalauth");

    if (!authorizationHeader || !membershipNumber || !internalAuthToken) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const verifiedToken = await verifyInternalAuthToken(
      internalAuthToken,
      config.internalAuthJwtSecret,
    );

    if (!verifiedToken || verifiedToken.sub !== membershipNumber) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!verifiedToken.allowedUnitIds.includes(parentId)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const payload = await getSubUnits(tipiQueryPort, membershipNumber, parentId);
    const refreshedInternalAuthToken = await generateInternalAuthToken(
      {
        sub: membershipNumber,
        allowedUnitIds: [payload.root.id, ...payload.subunits.map((unit) => unit.id)],
        allowedMemberNumbers: [],
      },
      {
        secret: config.internalAuthJwtSecret,
        ttlSeconds: config.internalAuthJwtTtlSeconds,
      },
    );

    res.status(200).json({
      ...payload,
      internalAuthToken: refreshedInternalAuthToken,
    });
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/units/:unitId/members", async (req: Request, res: Response): Promise<void> => {
  const unitId = parseNumericPathParam(req.params.unitId);

  if (unitId === null) {
    res.status(400).json({ error: "Invalid unitId path parameter" });
    return;
  }

  try {
    const authorizationHeader = readHeader(req, "authorization");
    const membershipNumber = getRequestIdentity(req)?.memberNum;
    const internalAuthToken = readHeader(req, "x-internalauth");

    if (!authorizationHeader || !membershipNumber || !internalAuthToken) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const verifiedToken = await verifyInternalAuthToken(
      internalAuthToken,
      config.internalAuthJwtSecret,
    );

    if (!verifiedToken || verifiedToken.sub !== membershipNumber) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!verifiedToken.allowedUnitIds.includes(unitId)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const payload = await getMembers(tipiQueryPort, unitId);
    const refreshedInternalAuthToken = await generateInternalAuthToken(
      {
        sub: membershipNumber,
        allowedUnitIds: [unitId],
        allowedMemberNumbers: payload.members.map((member) => member.membershipNumber),
      },
      {
        secret: config.internalAuthJwtSecret,
        ttlSeconds: config.internalAuthJwtTtlSeconds,
      },
    );

    res.status(200).json({
      ...payload,
      internalAuthToken: refreshedInternalAuthToken,
    });
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
