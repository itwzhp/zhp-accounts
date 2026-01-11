/**
 * Application entry point
 * Initializes Express server and starts listening
 */

import { createApp } from "@/frameworks/express/app";
import { config } from "@/config";

const app = createApp();

const server = app.listen(config.port, (): void => {
  console.info(
    `Server running on http://localhost:${config.port} [${config.nodeEnv}]`
  );
  console.info(`Health check: http://localhost:${config.port}/healthcheck`);
});

// Graceful shutdown
process.on("SIGTERM", (): void => {
  console.info("SIGTERM received, shutting down gracefully");
  server.close((): void => {
    console.info("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", (): void => {
  console.info("SIGINT received, shutting down gracefully");
  server.close((): void => {
    console.info("Server closed");
    process.exit(0);
  });
});
