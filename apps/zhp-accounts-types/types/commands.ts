import type { EntraAccount } from "./accounts";

export interface CreateAccountCommand {
    readonly membershipNumber: string;
    readonly notificationEmail?: string;
}

export interface CreateAccountResponse {
    readonly password: string;
    readonly account: EntraAccount;
}

export interface GenerateTapCommand {
    readonly membershipNumber: string;
    readonly notificationEmail?: string;
}

export interface GenerateTapResponse {
    readonly tap: string;
    readonly expiresAt: string; // ISO 8601 UTC date-time string
}
