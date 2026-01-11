/**
 * Express application setup
 * Framework integration
 */

import express from "express";
import healthRoutes from "@/adapters/http/routes/health";

export function createApp(): express.Application {
  const app = express();

  // Middleware
  app.use(express.json());

  // Routes
  app.use(healthRoutes);

  // Health check for container orchestration
  app.get("/", (_req, res): void => {
    res.status(200).json({ message: "ZHP Accounts API" });
  });

  // 404 handler
  app.use((_req, res): void => {
    res.status(404).json({ error: "Not Found" });
  });

  return app;
}
