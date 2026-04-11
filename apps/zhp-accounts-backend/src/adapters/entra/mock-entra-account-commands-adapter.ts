import type {
  GenerateTapResponse,
} from "zhp-accounts-types";
import type { TipiMemberDetails } from "@/entities/tipi-member-details";
import type {
  CreateAccountResult,
  EntraAccountCommandsPort,
} from "@/ports/entra-account-commands-port";

const occupiedUpns = new Set<string>([
  "jan.kowalski@zhp.pl",
  "kowalski.jan@zhp.pl",
  "j.kowalski@zhp.pl",
]);

export class MockEntraAccountCommandsAdapter implements EntraAccountCommandsPort {
  async createAccount(accountOwner: TipiMemberDetails, upn: string): Promise<CreateAccountResult> {
    if (occupiedUpns.has(upn)) {
      return {
        status: "already-exists",
        upn,
      };
    }

    occupiedUpns.add(upn);

    return {
      status: "created",
      response: {
        password: "TempPassword123!",
        account: {
          id: `mock-${accountOwner.membershipNumber}`,
          upn,
          membershipNumber: accountOwner.membershipNumber,
          isAdmin: false,
        },
      },
    };
  }

  async generateTap(upn: string): Promise<GenerateTapResponse> {
    const tapSuffix = Buffer.from(upn).toString("base64url").slice(0, 12);

    return {
      tap: `mock-tap-${tapSuffix}`,
      expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    };
  }
}
