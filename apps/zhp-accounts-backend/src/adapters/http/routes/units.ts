import { Router, type Request, type Response, type Router as ExpressRouter } from "express";
import { NullTipiQueryAdapter } from "@/adapters/tipi/null-tipi-query-adapter";
import { getMembers } from "@/use-cases/members/get-members";
import { getRootUnits } from "@/use-cases/units/get-root-units";
import { getSubUnits } from "@/use-cases/units/get-sub-units";

const router: ExpressRouter = Router();
const tipiQueryPort = new NullTipiQueryAdapter();

function parseNumericPathParam(value: string): number | null {
  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed)) {
    return null;
  }

  return parsed;
}

router.get("/units", async (_req: Request, res: Response): Promise<void> => {
  try {
    const units = await getRootUnits(tipiQueryPort);
    res.status(200).json(units);
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
    const payload = await getSubUnits(tipiQueryPort, parentId);
    res.status(200).json(payload);
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
    const payload = await getMembers(tipiQueryPort, unitId);
    res.status(200).json(payload);
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
