import type { NextFunction, Request, Response } from "express";
import { config } from "@/config";

export function corsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const origin = req.get("origin");

  if (origin && config.corsAllowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Authorize, X-InternalAuth"
    );
    res.setHeader("Access-Control-Max-Age", "86400");
  }

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  next();
}