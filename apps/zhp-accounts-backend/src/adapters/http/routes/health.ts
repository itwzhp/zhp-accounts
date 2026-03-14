/**
 * Health check routes
 * HTTP adapter for health check endpoint
 */

import { Router, type Request, type Response, type Router as ExpressRouter } from "express";
import { getHealth } from "@/use-cases/health/get-health";

const router: ExpressRouter = Router();

router.get("/healthcheck/readiness", async (_: Request, res: Response): Promise<void> => {
  const health = await getHealth();
  const statusCode = health.status === "down" ? 503 : 200;

  res.status(statusCode).json(health);
});

router.get("/healthcheck/liveliness", (_: Request, res: Response): void => {
  res.status(200).send('{"status":"ok"}');
});

router.get("/healthcheck/ping", (req: Request, res: Response): void => {
  res.status(200).json({ headers: req.headers });
});

export default router;
