import { randomBytes } from "node:crypto";
import type { GenerateTapResponse } from "zhp-accounts-types";
import type {
  CreateAccountResult,
  EntraAccountCommandsPort,
} from "@/ports/entra-account-commands-port";
import type { TipiMemberDetails } from "@/entities/tipi-member-details";
import { getGraphClient } from "./entra-graph-client";
import { config } from "@/config";

const TEMPORARY_PASSWORD_LENGTH = 20;
const TEMPORARY_PASSWORD_SUFFIX = "!Aa1";
const DEFAULT_TAP_LIFETIME_MINUTES = 24*60;

interface GraphCreatedUser {
  id?: string;
  userPrincipalName?: string;
  employeeId?: string;
}

interface GraphTemporaryAccessPassResponse {
  temporaryAccessPass?: string;
  startDateTime?: string;
  lifetimeInMinutes?: number;
}

interface GraphUsersResponse {
  value?: Array<{
    id?: string;
    userPrincipalName?: string;
  }>;
}

function toMailNickname(upn: string): string {
  const localPart = upn.split("@")[0] ?? "";
  return localPart.trim();
}

function createTemporaryPassword(): string {
  const raw = randomBytes(TEMPORARY_PASSWORD_LENGTH).toString("base64url");
  const trimmed = raw.slice(0, TEMPORARY_PASSWORD_LENGTH);
  return `${trimmed}${TEMPORARY_PASSWORD_SUFFIX}`;
}

function escapeODataString(value: string): string {
  return value.replace(/'/g, "''");
}

export class EntraAccountCommandsAdapter implements EntraAccountCommandsPort {
  private async findUserByUpn(upn: string): Promise<{ id: string; userPrincipalName: string } | null> {
    const graphClient = getGraphClient();
    const escapedUpn = escapeODataString(upn);

    const response = await graphClient
      .api("/users")
      .select(["id", "userPrincipalName"])
      .filter(`userPrincipalName eq '${escapedUpn}'`)
      .top(1)
      .get() as GraphUsersResponse;

    const firstUser = response.value?.[0];
    if (!firstUser || typeof firstUser.id !== "string" || typeof firstUser.userPrincipalName !== "string") {
      return null;
    }

    return {
      id: firstUser.id,
      userPrincipalName: firstUser.userPrincipalName,
    };
  }

  private async assignLicense(userId: string): Promise<void> {
    const graphClient = getGraphClient();

    await graphClient
      .api(`/users/${userId}/assignLicense`)
      .post({
        addLicenses: [
          {
            skuId: config.entraLicenseSku,
          },
        ],
        removeLicenses: [],
      });
  }

  async createAccount(accountOwner: TipiMemberDetails, upn: string): Promise<CreateAccountResult> {
    const graphClient = getGraphClient();
    const password = createTemporaryPassword();
    const mailNickname = toMailNickname(upn);

    if (!mailNickname) {
      throw new Error(`Nieprawidłowy UPN '${upn}' - brak local part.`);
    }

    const existingUser = await this.findUserByUpn(upn);
    if (existingUser) {
      return {
        status: "already-exists",
        upn: existingUser.userPrincipalName,
      };
    }

    const createdUser = await graphClient
      .api("/users")
      .post({
        mail: upn,
        userPrincipalName: upn,
        mailNickname,
        passwordProfile: {
          password,
          forceChangePasswordNextSignIn: true,
        },
        givenName: accountOwner.name,
        surname: accountOwner.surname,
        displayName: `${accountOwner.name} ${accountOwner.surname}`,
        jobTitle: accountOwner.membershipNumber,
        department: accountOwner.hufiec,
        officeLocation: accountOwner.choragiew,
        accountEnabled: true,
        usageLocation: "PL",
        employeeId: accountOwner.membershipNumber,
        employeeType: "Tipi-automat-tmp",
      }) as GraphCreatedUser;

    if (typeof createdUser.id !== "string" || typeof createdUser.userPrincipalName !== "string") {
      throw new Error("Nie udało się odczytać danych nowo utworzonego użytkownika Entra.");
    }

    await this.assignLicense(createdUser.id);

    return {
      status: "created",
      response: {
        password,
        account: {
          id: createdUser.id,
          upn: createdUser.userPrincipalName,
          membershipNumber: createdUser.employeeId ?? accountOwner.membershipNumber,
          isAdmin: false,
        },
      },
    };
  }

  async generateTap(upn: string): Promise<GenerateTapResponse> {
    const graphClient = getGraphClient();

    const tapResponse = await graphClient
      .api(`/users/${encodeURIComponent(upn)}/authentication/temporaryAccessPassMethods`)
      .post({
        isUsableOnce: true,
        lifetimeInMinutes: DEFAULT_TAP_LIFETIME_MINUTES,
      }) as GraphTemporaryAccessPassResponse;

    if (typeof tapResponse.temporaryAccessPass !== "string") {
      throw new Error(`Nie udało się wygenerować TAP dla '${upn}'.`);
    }

    const lifetimeInMinutes = typeof tapResponse.lifetimeInMinutes === "number"
      ? tapResponse.lifetimeInMinutes
      : DEFAULT_TAP_LIFETIME_MINUTES;
    const startDate = tapResponse.startDateTime ? new Date(tapResponse.startDateTime) : new Date();
    const expiresAt = new Date(startDate.getTime() + lifetimeInMinutes * 60 * 1000).toISOString();

    return {
      tap: tapResponse.temporaryAccessPass,
      expiresAt,
    };
  }
}
