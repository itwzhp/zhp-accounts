import type { Request, Response } from "express";
import { AzureRequestIdentity, getRequestIdentity } from "./azure-auth";
import { verifyInternalAuthToken } from "./internal-auth";

export async function performFullAuth(req: Request, res: Response, requiredMembershipNumber? :string, requiredUnitId? :number)
: Promise<AzureRequestIdentity | null> {
    const requesterIdentity = getRequestIdentity(req);
    if (!requesterIdentity) {
      res.status(401).json({ error: "Unauthorized" });
      return null;
    }

    const verifiedToken = await verifyInternalAuthToken(req);

    if (!verifiedToken || verifiedToken.sub !== requesterIdentity.memberNum) {
      res.status(401).json({ error: "Unauthorized" });
      return null;
    }

    if (requiredMembershipNumber && !verifiedToken.allowedMemberNumbers.includes(requiredMembershipNumber)) {
      res.status(403).json({ error: "Forbidden" });
      return null;
    }

    if (requiredUnitId && !verifiedToken.allowedUnitIds.includes(requiredUnitId)) {
      res.status(403).json({ error: "Forbidden" });
      return null;
    }

    return requesterIdentity;
}