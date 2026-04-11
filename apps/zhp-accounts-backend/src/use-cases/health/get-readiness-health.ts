import { getReadinessChecks } from "@/frameworks/providers/service-provider";
import { getHealthFromChecks } from "@/use-cases/health/get-health";
import type { Health } from "@/entities/health";

export async function getReadinessHealth(): Promise<Health> {
  return getHealthFromChecks(getReadinessChecks());
}