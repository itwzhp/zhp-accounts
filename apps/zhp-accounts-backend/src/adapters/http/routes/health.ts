/**
 * Health check routes
 * HTTP adapter for health check endpoint
 */

import { Router, type Request, type Response, type Router as ExpressRouter } from "express";
import { getHealth } from "@/use-cases/health/get-health";

const router: ExpressRouter = Router();

router.get("/healthcheck/readiness", (_req: Request, res: Response): void => {
  const health = getHealth();
  res.status(200).json(health);
});

router.get("/healthcheck/liveliness", (_req: Request, res: Response): void => {
  res.status(200).send('{"status":"ok"}');
});

router.get("/healthcheck/ping", (req: Request, res: Response): void => {
  res.status(200).json({ headers: req.headers });
});

export default router;
