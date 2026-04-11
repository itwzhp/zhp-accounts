import { getHealth } from "@/use-cases/health/get-health";

export async function ensureFullHealth(): Promise<void> {
  const health = await getHealth();

  if (health.status !== "ok") {
    throw new Error(`Pelny healthcheck nie przeszedl (status: ${health.status})`);
  }
}