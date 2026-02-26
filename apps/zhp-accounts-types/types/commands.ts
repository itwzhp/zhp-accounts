export interface CreateAccountCommand {
    readonly membershipNumber: string;
}

export interface CreateAccountResponse {
    readonly email: string;
    readonly password: string;
}

export interface GenerateTapCommand {
    readonly membershipNumber: string;
    readonly email: string;
}

export interface GenerateTapResponse {
    readonly tap: string;
    readonly expiresAt: string; // ISO 8601 UTC date-time string
}
