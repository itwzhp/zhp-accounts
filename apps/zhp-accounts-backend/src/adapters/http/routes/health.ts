/**
 * Health check routes
 * HTTP adapter for health check endpoint
 */

import { Router, type Request, type Response, type Router as ExpressRouter } from "express";
import { getHealth } from "@/use-cases/health/get-health";

const router: ExpressRouter = Router();

router.get("/healthcheck", (_req: Request, res: Response): void => {
  const health = getHealth();
  res.status(200).json(health);
});

export default router;
