export interface CreateAccountCommand {
    readonly membershipNumber: string;
}

export interface CreateAccountResponse {
    readonly email: string;
    readonly password: string;
}