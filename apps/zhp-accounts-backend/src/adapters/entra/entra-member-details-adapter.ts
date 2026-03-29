import { Client } from "@microsoft/microsoft-graph-client";
import type { User } from "@microsoft/microsoft-graph-types";
import type { EntraMemberDetailsPort } from "@/ports/entra-member-details-port";
import type { EntraAccount } from "zhp-accounts-types";
import { getGraphClient } from "./entra-graph-client";

interface MatchedGraphUser {
    id: string;
    userPrincipalName: string;
    employeeId: string;
    employeeType?: string;
}

function normalizeMembershipNumber(memberId: string): string {
    return memberId.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function isTipiBasedUser(employeeType: string | undefined | null): boolean {
    return typeof employeeType === "string" && employeeType.toLowerCase().startsWith("tipi");
}

export class EntraMemberDetailsAdapter implements EntraMemberDetailsPort {
    private async checkIfUserIsAdmin(graphClient: Client, userId: string): Promise<boolean> {
        const rolesResponse = await graphClient
            .api(`/users/${userId}/transitiveMemberOf/microsoft.graph.directoryRole`)
            .top(1)
            .get();
        
        return rolesResponse?.value?.length > 0;
    }

    async getMemberDetails(memberId: string): Promise<EntraAccount | null> {
        const membershipNumber = normalizeMembershipNumber(memberId);
        const graphClient = getGraphClient();

        const usersResponse = await graphClient
            .api("/users")
            .select(["id", "userPrincipalName", "employeeId", "employeeType"])
            .filter(`employeeId eq '${membershipNumber}'`)
            .top(20)
            .get();

        const users = ((usersResponse?.value ?? []) as User[]).filter(
            (user): user is MatchedGraphUser =>
                typeof user.id === "string" &&
                typeof user.userPrincipalName === "string" &&
                typeof user.employeeId === "string",
        )
            .filter((user) => isTipiBasedUser(user.employeeType));

        if (users.length === 0) {
            return null;
        }

        if (users.length > 1) {
            throw new Error(
                `Wielu użytkowników Entra z employeeId '${membershipNumber}' i employeeType zaczynającym się od 'tipi' zostało znalezionych`,
            );
        }

        const selectedUser = users[0];
        const isAdmin = await this.checkIfUserIsAdmin(graphClient, selectedUser.id);

        return {
            id: selectedUser.id,
            upn: selectedUser.userPrincipalName,
            membershipNumber: selectedUser.employeeId,
            isAdmin,
        };
    }
}
