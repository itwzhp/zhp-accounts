/**
 * Placeholder for HTTP adapters
 * Express controllers and route handlers will be added here
 */

export type { Request, Response } from "express";
export { getRequestIdentity } from "@/adapters/http/azure-auth";
export type { AzureRequestIdentity } from "@/adapters/http/azure-auth";
