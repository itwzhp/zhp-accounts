import type {
  CreateAccountResponse,
  GenerateTapResponse,
} from "zhp-accounts-types";
import type { EntraAccountCommandsPort } from "@/use-cases/accounts/ports/entra-account-commands-port";

export class NullEntraAccountCommandsAdapter implements EntraAccountCommandsPort {
  async createAccount(memberNum: string, login: string): Promise<CreateAccountResponse> {
    const loginPrefix = login.split("@")[0] ?? "user";

    return {
      email: `${memberNum.toLowerCase()}.${loginPrefix.toLowerCase()}@example.zhp.pl`,
      password: "TempPassword123!",
    };
  }

  async generateTap(
    memberNum: string,
    email: string,
    login: string,
  ): Promise<GenerateTapResponse> {
    const tapSuffix = Buffer.from(`${memberNum}:${email}:${login}`).toString("base64url").slice(0, 12);

    return {
      tap: `mock-tap-${tapSuffix}`,
      expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    };
  }
}