import { Router, type Request, type Response, type Router as ExpressRouter } from "express";
import { NullEntraMemberDetailsAdapter } from "@/adapters/entra/null-entra-member-details-adapter";
import { NullTipiQueryAdapter } from "@/adapters/tipi/null-tipi-query-adapter";
import { getMember } from "@/use-cases/members/get-member";

const router: ExpressRouter = Router();
const entraMemberDetailsPort = new NullEntraMemberDetailsAdapter();
const tipiQueryPort = new NullTipiQueryAdapter();

router.get("/members/:memberId", async (req: Request, res: Response): Promise<void> => {
  const memberId = req.params.memberId.trim();

  if (memberId.length === 0) {
    res.status(400).json({ error: "Invalid memberId path parameter" });
    return;
  }

  try {
    const member = await getMember(entraMemberDetailsPort, tipiQueryPort, memberId);

    res.status(200).json(member);
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
