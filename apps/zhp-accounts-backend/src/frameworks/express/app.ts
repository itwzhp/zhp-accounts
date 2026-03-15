/**
 * Express application setup
 * Framework integration
 */

import express from "express";
import { config } from "@/config";
import healthRoutes from "@/adapters/http/routes/health";
import membersRoutes from "@/adapters/http/routes/members";
import unitsRoutes from "@/adapters/http/routes/units";
import commandsRoutes from "@/adapters/http/routes/commands";
import { corsMiddleware } from "@/frameworks/express/cors";

export function createApp(): express.Application {
  const app = express();

  // Middleware
  if (config.enableCors) {
    app.use(corsMiddleware);
  }

  app.use(express.json());

  // Routes
  app.use(healthRoutes);
  app.use(unitsRoutes);
  app.use(membersRoutes);
  app.use(commandsRoutes);

  app.get("/", (_, res): void => {
    res.status(200).json({ message: "ZHP Accounts API" });
  });

  // 404 handler
  app.use((_, res): void => {
    res.status(404).json({ error: "Not Found" });
  });

  return app;
}
