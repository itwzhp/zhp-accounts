/**
 * Express application setup
 * Framework integration
 */

import express from "express";
import { config } from "@/config";
import healthRoutes from "@/adapters/http/routes/health";

export function createApp(): express.Application {
  const app = express();

  // Middleware
  app.use((req, res, next): void => {
    if (!config.enableCors) {
      next();
      return;
    }

    const origin = req.get("origin");

    if (origin && config.corsAllowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Authorize"
      );
      res.setHeader("Access-Control-Max-Age", "86400");
    }

    if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
    }

    next();
  });

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
