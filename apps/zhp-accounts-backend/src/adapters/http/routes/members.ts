import { Router, type Request, type Response, type Router as ExpressRouter } from "express";
import { NullEntraMemberDetailsAdapter } from "@/adapters/entra/null-entra-member-details-adapter";
import { NullTipiQueryAdapter } from "@/adapters/tipi/null-tipi-query-adapter";
import { config } from "@/config";
import { MemberAccessDeniedError, getMember } from "@/use-cases/members/get-member";
import { verifyInternalAuthToken } from "../internal-auth";
import { getAzureRequestIdentity } from "../azure-auth";

const router: ExpressRouter = Router();
const entraMemberDetailsPort = new NullEntraMemberDetailsAdapter();
const tipiQueryPort = new NullTipiQueryAdapter();

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

router.get("/members/:memberId", async (req: Request, res: Response): Promise<void> => {
  const memberId = req.params.memberId.trim();

  if (memberId.length === 0) {
    res.status(400).json({ error: "Invalid memberId path parameter" });
    return;
  }

  try {
    const authorizationHeader = readHeader(req, "authorization");
    const requesterMemberNum = getAzureRequestIdentity(req)?.memberNum;
    const internalAuthToken = readHeader(req, "x-internalauth");

    if (!authorizationHeader || !requesterMemberNum || !internalAuthToken) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const verifiedToken = await verifyInternalAuthToken(
      internalAuthToken,
      config.internalAuthJwtSecret,
    );

    if (!verifiedToken || verifiedToken.sub !== requesterMemberNum) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const member = await getMember(
      entraMemberDetailsPort,
      tipiQueryPort,
      memberId,
      verifiedToken.allowedMemberNumbers,
    );

    res.status(200).json(member);
  } catch (error) {
    if (error instanceof MemberAccessDeniedError) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
