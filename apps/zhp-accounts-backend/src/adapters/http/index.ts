/**
 * Placeholder for HTTP adapters
 * Express controllers and route handlers will be added here
 */

export type { Request, Response } from "express";
export { getRequestIdentity } from "@/adapters/http/azure-auth";
export type { Account as AuditUser } from "zhp-accounts-types";
