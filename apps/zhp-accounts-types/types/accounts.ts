export interface Account {
  readonly id: string;
  readonly upn: string;
  readonly membershipNumber: string;
}

export interface EntraAccount extends Account {
  readonly isAdmin: boolean;
}