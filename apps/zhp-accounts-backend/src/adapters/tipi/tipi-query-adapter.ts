import type { ZhpMember, ZhpUnit, ZhpUnitType } from "zhp-accounts-types";
import { config } from "@/config";
import type { TipiQueryPort } from "@/ports/tipi-query-port";

interface TipiUnitSummaryResponse {
  id: number;
  name: string;
  type: string;
}

interface TipiMemberSummaryResponse {
  name: string;
  surname: string;
  membershipNumber: string;
}

interface TipiMemberDetailsResponse extends TipiMemberSummaryResponse {
  hasAllRequiredConsents: boolean;
}

function toUnitType(value: string): ZhpUnitType {
  if (value === "choragiew" || value === "hufiec" || value === "pjo") {
    return value;
  }

  throw new Error(`Unsupported unit type returned by Tipi API: ${value}`);
}

function toUnit(input: TipiUnitSummaryResponse): ZhpUnit {
  return {
    id: input.id,
    name: input.name,
    type: toUnitType(input.type),
  };
}

function toMember(input: TipiMemberSummaryResponse): ZhpMember {
  return {
    name: input.name,
    surname: input.surname,
    membershipNumber: input.membershipNumber,
    hasAllRequiredConsents: false,
  };
}

function toMemberDetails(input: TipiMemberDetailsResponse): ZhpMember {
  return {
    name: input.name,
    surname: input.surname,
    membershipNumber: input.membershipNumber,
    hasAllRequiredConsents: input.hasAllRequiredConsents,
  };
}

export class TipiQueryAdapter implements TipiQueryPort {
  private readonly baseUrl = config.tipiApiBaseUrl;
  private readonly clientId = config.tipiApiClientId;
  private readonly clientSecret = config.tipiApiClientSecret;

  private async requestJson<T>(path: string): Promise<{ status: number; data: T }> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "GET",
      headers: {
        "CF-Access-Client-Id": this.clientId,
        "CF-Access-Client-Secret": this.clientSecret,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return { status: response.status, data: null as T };
    }

    const data = (await response.json()) as T;
    return { status: response.status, data };
  }

  async getRootUnits(memberNum: string): Promise<ZhpUnit[]> {
    const path = `/zhp-accounts/members/${encodeURIComponent(memberNum)}/root-units`;
    const response = await this.requestJson<TipiUnitSummaryResponse[]>(path);

    if (response.status === 400) {
      throw new Error(`Invalid member ID format for Tipi root units request: ${memberNum}`);
    }

    if (response.status !== 200) {
      throw new Error(`Tipi root units request failed with status ${response.status}`);
    }

    return response.data.map(toUnit);
  }

  async getUnit(unitId: number): Promise<ZhpUnit> {
    const path = `/zhp-accounts/units/${unitId}`;
    const response = await this.requestJson<TipiUnitSummaryResponse>(path);

    if (response.status === 404) {
      throw new Error(`Unit with ID ${unitId} not found in Tipi`);
    }

    if (response.status === 409) {
      throw new Error(`Tipi returned data consistency conflict for unit ID ${unitId}`);
    }

    if (response.status !== 200) {
      throw new Error(`Tipi get unit request failed with status ${response.status}`);
    }

    return toUnit(response.data);
  }

  async getSubUnits(memberNum: string, parentId: number): Promise<ZhpUnit[]> {
    const path = `/zhp-accounts/members/${encodeURIComponent(memberNum)}/units/${parentId}/sub-units`;
    const response = await this.requestJson<TipiUnitSummaryResponse[]>(path);

    if (response.status === 400) {
      throw new Error(`Invalid member ID format for Tipi sub-units request: ${memberNum}`);
    }

    if (response.status !== 200) {
      throw new Error(`Tipi sub-units request failed with status ${response.status}`);
    }

    return response.data.map(toUnit);
  }

  async getMembers(unitId: number): Promise<ZhpMember[]> {
    const path = `/zhp-accounts/units/${unitId}/members`;
    const response = await this.requestJson<TipiMemberSummaryResponse[]>(path);

    if (response.status !== 200) {
      throw new Error(`Tipi get members request failed with status ${response.status}`);
    }

    return response.data.map(toMember);
  }

  async getMember(membershipNumber: string): Promise<ZhpMember | null> {
    const path = `/zhp-accounts/members/${encodeURIComponent(membershipNumber)}`;
    const response = await this.requestJson<TipiMemberDetailsResponse>(path);

    if (response.status === 404) {
      return null;
    }

    if (response.status === 400) {
      throw new Error(`Invalid member ID format for Tipi member request: ${membershipNumber}`);
    }

    if (response.status === 409) {
      throw new Error(`Tipi returned data consistency conflict for member ID ${membershipNumber}`);
    }

    if (response.status !== 200) {
      throw new Error(`Tipi get member request failed with status ${response.status}`);
    }

    return toMemberDetails(response.data);
  }
}