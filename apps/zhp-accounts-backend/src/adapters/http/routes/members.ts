import { Router, type Request, type Response, type Router as ExpressRouter } from "express";
import { getMember } from "@/use-cases/members/get-member";
import { performFullAuth } from "../full-auth";

const router: ExpressRouter = Router();

router.get("/members/:memberId", async (req: Request, res: Response): Promise<void> => {
  const memberId = req.params.memberId.trim();

  if (memberId.length === 0) {
    res.status(400).json({ error: "Invalid memberId path parameter" });
    return;
  }

  try {
    const authResult = await performFullAuth(req, res, memberId);

    if (!authResult) {
      return;
    }

    const member = await getMember(memberId);

    if (member == null) {
      res.status(404).json({ error: "Member not found" });
      return;
    }

    res.status(200).json(member);
  } catch (error) {
    console.error("Error handling GET /members/:memberId request", {
      memberId,
      error: error instanceof Error ? error.message : String(error),
    });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
