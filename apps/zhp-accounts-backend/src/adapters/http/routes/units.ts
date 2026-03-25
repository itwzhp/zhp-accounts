import { Router, type Request, type Response, type Router as ExpressRouter } from "express";
import { getMembers } from "@/use-cases/members/get-members";
import { getRootUnits } from "@/use-cases/units/get-root-units";
import { getSubUnits } from "@/use-cases/units/get-sub-units";
import { generateInternalAuthToken } from "../internal-auth";
import { getRequestIdentity } from "../azure-auth";
import { performFullAuth } from "../full-auth";

const router: ExpressRouter = Router();

function parseNumericPathParam(value: string): number | null {
  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed)) {
    return null;
  }

  return parsed;
}

router.get("/units", async (_req: Request, res: Response): Promise<void> => {
  try {
    const requestIdentity = getRequestIdentity(_req);
    if (!requestIdentity) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const membershipNumber = requestIdentity.membershipNumber;

    const units = await getRootUnits(membershipNumber);
    const internalAuthToken = await generateInternalAuthToken(
      {
        sub: membershipNumber,
        allowedUnitIds: units.map((unit) => unit.id),
        allowedMemberNumbers: [],
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
    const authResult = await performFullAuth(req, res, undefined, parentId);

    if (!authResult) {
      return;
    }
    const membershipNumber = authResult.membershipNumber;

    const payload = await getSubUnits(membershipNumber, parentId);
    const refreshedInternalAuthToken = await generateInternalAuthToken(
      {
        sub: membershipNumber,
        allowedUnitIds: [payload.root.id, ...payload.subunits.map((unit) => unit.id)],
        allowedMemberNumbers: [],
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
    const authResult = await performFullAuth(req, res, undefined, unitId);

    if (!authResult) {
      return;
    }
    const membershipNumber = authResult.membershipNumber;

    const payload = await getMembers(unitId);
    const refreshedInternalAuthToken = await generateInternalAuthToken(
      {
        sub: membershipNumber,
        allowedUnitIds: [unitId],
        allowedMemberNumbers: payload.members.map((member) => member.membershipNumber),
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
