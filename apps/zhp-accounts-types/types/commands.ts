export interface CreateAccountCommand {
    readonly membershipNumber: string;
}

export interface CreateAccountResponse {
    readonly email: string;
    readonly password: string;
}

export interface ResetPasswordCommand {
    readonly membershipId: string;
}

export interface ResetPasswordResponse {}

export interface ResetMfaCommand {
    readonly membershipId: string;
}

export interface ResetMfaResponse {}

export interface FixEmailCommand {
    readonly membershipId: string;
}

export interface FixEmailResponse {}