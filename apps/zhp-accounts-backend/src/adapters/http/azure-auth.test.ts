import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Request } from "express";
import { getRequestIdentity } from "./azure-auth";

const mockConfig = vi.hoisted(() => ({ isLocalInstance: true }));

vi.mock("@/config", () => ({ config: mockConfig }));

const CLIENT_PRINCIPAL = "eyJhdXRoX3R5cCI6ImFhZCIsImNsYWltcyI6W3sidHlwIjoiYXVkIiwidmFsIjoiYXBpOlwvXC9rb250by1iYWNrZW5kLnpocC5wbCJ9LHsidHlwIjoiaXNzIiwidmFsIjoiaHR0cHM6XC9cL3N0cy53aW5kb3dzLm5ldFwvZTEzNjhkMWUtMzk3NS00Y2U2LTg5M2QtZmMzNTFmZDQ0ZGNkXC8ifSx7InR5cCI6ImlhdCIsInZhbCI6IjE3NzMzMjQyNzIifSx7InR5cCI6Im5iZiIsInZhbCI6IjE3NzMzMjQyNzIifSx7InR5cCI6ImV4cCIsInZhbCI6IjE3NzMzMjk4NDUifSx7InR5cCI6Imh0dHA6XC9cL3NjaGVtYXMubWljcm9zb2Z0LmNvbVwvY2xhaW1zXC9hdXRobmNsYXNzcmVmZXJlbmNlIiwidmFsIjoiMSJ9LHsidHlwIjoiYWlvIiwidmFsIjoiQVhRQWlcLzhiQUFBQTlvMXdHalN1WmtWZzZqVlFZNXdWWTdpQ1VXTmtUSXdhUElDQlNCY2ZROUt5NTA2RmwwWENielBXWEhBc1g2K2RwdFwvdkRKMzViVWxFYUEwcDR3NG13MzFtbXVjVVBETFwvT09EQTdVUXZMREREWmowMmo2Z3FMUEtyR1ZINHlDQkNUOTJVK1JNckNuYnhoNVhiTURCRkVnPT0ifSx7InR5cCI6Imh0dHA6XC9cL3NjaGVtYXMubWljcm9zb2Z0LmNvbVwvY2xhaW1zXC9hdXRobm1ldGhvZHNyZWZlcmVuY2VzIiwidmFsIjoicHdkIn0seyJ0eXAiOiJodHRwOlwvXC9zY2hlbWFzLm1pY3Jvc29mdC5jb21cL2NsYWltc1wvYXV0aG5tZXRob2RzcmVmZXJlbmNlcyIsInZhbCI6Im1mYSJ9LHsidHlwIjoiYXBwaWQiLCJ2YWwiOiI0OTJmMDhlZi1hZmJhLTRiYmMtYWU2Zi00MTQ0MTU3M2Q3NGUifSx7InR5cCI6ImFwcGlkYWNyIiwidmFsIjoiMCJ9LHsidHlwIjoiaHR0cDpcL1wvc2NoZW1hcy54bWxzb2FwLm9yZ1wvd3NcLzIwMDVcLzA1XC9pZGVudGl0eVwvY2xhaW1zXC9zdXJuYW1lIiwidmFsIjoiR3JvZHppY2tpIn0seyJ0eXAiOiJodHRwOlwvXC9zY2hlbWFzLnhtbHNvYXAub3JnXC93c1wvMjAwNVwvMDVcL2lkZW50aXR5XC9jbGFpbXNcL2dpdmVubmFtZSIsInZhbCI6Ikthcm9sIn0seyJ0eXAiOiJpcGFkZHIiLCJ2YWwiOiIzMS4xNzUuNDIuMjEifSx7InR5cCI6Im5hbWUiLCJ2YWwiOiJLYXJvbCBHcm9kemlja2kifSx7InR5cCI6Imh0dHA6XC9cL3NjaGVtYXMubWljcm9zb2Z0LmNvbVwvaWRlbnRpdHlcL2NsYWltc1wvb2JqZWN0aWRlbnRpZmllciIsInZhbCI6IjljOWE3ZTczLWM4NzgtNDZhYy04NWMyLTEzMDhmZTRhZGQ0MiJ9LHsidHlwIjoicmgiLCJ2YWwiOiIxLkFSOEFIbzAyNFhVNTVreUpQZncxSDlSTnpiTnBSUUktTWZSTmtnNVhDWEtDUXZXRkFQQWZBQS4ifSx7InR5cCI6Imh0dHA6XC9cL3NjaGVtYXMubWljcm9zb2Z0LmNvbVwvaWRlbnRpdHlcL2NsYWltc1wvc2NvcGUiLCJ2YWwiOiJ1c2VyX2ltcGVyc29uYXRpb24ifSx7InR5cCI6InNpZCIsInZhbCI6IjAwMmVlMDE5LWExMWEtYWI1Yi01NmY1LTZjNDAzMzRjMWI0NyJ9LHsidHlwIjoiaHR0cDpcL1wvc2NoZW1hcy54bWxzb2FwLm9yZ1wvd3NcLzIwMDVcLzA1XC9pZGVudGl0eVwvY2xhaW1zXC9uYW1laWRlbnRpZmllciIsInZhbCI6Imc2dlIzQlMyY0RhNnB1TjQzOWhZYk9MSTJCX2h3NGVJSzYtWmFiSEQtUHMifSx7InR5cCI6Imh0dHA6XC9cL3NjaGVtYXMubWljcm9zb2Z0LmNvbVwvaWRlbnRpdHlcL2NsYWltc1wvdGVuYW50aWQiLCJ2YWwiOiJlMTM2OGQxZS0zOTc1LTRjZTYtODkzZC1mYzM1MWZkNDRkY2QifSx7InR5cCI6Imh0dHA6XC9cL3NjaGVtYXMueG1sc29hcC5vcmdcL3dzXC8yMDA1XC8wNVwvaWRlbnRpdHlcL2NsYWltc1wvbmFtZSIsInZhbCI6Imthcm9sLmdyb2R6aWNraUB6aHAubmV0LnBsIn0seyJ0eXAiOiJodHRwOlwvXC9zY2hlbWFzLnhtbHNvYXAub3JnXC93c1wvMjAwNVwvMDVcL2lkZW50aXR5XC9jbGFpbXNcL3VwbiIsInZhbCI6Imthcm9sLmdyb2R6aWNraUB6aHAubmV0LnBsIn0seyJ0eXAiOiJ1dGkiLCJ2YWwiOiI0S040aWhFT3YwYV9KZ1lyM0gwREFBIn0seyJ0eXAiOiJ2ZXIiLCJ2YWwiOiIxLjAifSx7InR5cCI6Inhtc19mdGQiLCJ2YWwiOiJ5WjhYQXdPZVN2bUZLMGYwSU5VOFZwNEd5cm1qZ0FaSm50RnVIYnZGNWJBQmMzZGxaR1Z1WXkxa2MyMXoifSx7InR5cCI6Im1lbWJlck51bSIsInZhbCI6IkFMMDA1MDQ3MDcxIn1dLCJuYW1lX3R5cCI6Imh0dHA6XC9cL3NjaGVtYXMueG1sc29hcC5vcmdcL3dzXC8yMDA1XC8wNVwvaWRlbnRpdHlcL2NsYWltc1wvbmFtZSIsInJvbGVfdHlwIjoiaHR0cDpcL1wvc2NoZW1hcy5taWNyb3NvZnQuY29tXC93c1wvMjAwOFwvMDZcL2lkZW50aXR5XC9jbGFpbXNcL3JvbGUifQ==";
const TEST_BEARER_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IlFaZ045SHFOa0dORU00R2VLY3pEMDJQY1Z2NCIsImtpZCI6IlFaZ045SHFOa0dORU00R2VLY3pEMDJQY1Z2NCJ9.eyJhdWQiOiJhcGk6Ly9rb250by1iYWNrZW5kLnpocC5wbCIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0L2UxMzY4ZDFlLTM5NzUtNGNlNi04OTNkLWZjMzUxZmQ0NGRjZC8iLCJpYXQiOjE3NzM0MjA5MDUsIm5iZiI6MTc3MzQyMDkwNSwiZXhwIjoxNzczNDI1MTY0LCJhY3IiOiIxIiwiYWlvIjoiQVhRQWkvOGJBQUFBam9tUVlPZC95eHc2OCtiaGtSUmdQTlRpQzBNa3pFd3BGUjgzQ1kvUmhnSEZtcENxWUFGbnh5WFMyRFVNa3RvamQ2Y2RSOG9idDZVQ0tVSEN5YVBXTU96UGE2eTdPVzFzVzk1RksyM2dxSU1wdjkvNlJFL3o2azlCUE00cW1Pa2ZXUzMvdDZ3V1B6YlBFb091cmhUbzJBPT0iLCJhbXIiOlsicHdkIiwibWZhIl0sImFwcGlkIjoiNDkyZjA4ZWYtYWZiYS00YmJjLWFlNmYtNDE0NDE1NzNkNzRlIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJHcm9kemlja2kiLCJnaXZlbl9uYW1lIjoiS2Fyb2wiLCJpcGFkZHIiOiIzMS42MS4yMjcuMTA3IiwibmFtZSI6Ikthcm9sIEdyb2R6aWNraSIsIm9pZCI6IjljOWE3ZTczLWM4NzgtNDZhYy04NWMyLTEzMDhmZTRhZGQ0MiIsInJoIjoiMS5BUjhBSG8wMjRYVTU1a3lKUGZ3MUg5Uk56Yk5wUlFJLU1mUk5rZzVYQ1hLQ1F2V0ZBUEFmQUEuIiwic2NwIjoidXNlcl9pbXBlcnNvbmF0aW9uIiwic2lkIjoiMDAyZWUwMTktYTExYS1hYjViLTU2ZjUtNmM0MDMzNGMxYjQ3Iiwic3ViIjoiZzZ2UjNCUzJjRGE2cHVONDM5aFliT0xJMkJfaHc0ZUlLNi1aYWJIRC1QcyIsInRpZCI6ImUxMzY4ZDFlLTM5NzUtNGNlNi04OTNkLWZjMzUxZmQ0NGRjZCIsInVuaXF1ZV9uYW1lIjoia2Fyb2wuZ3JvZHppY2tpQHpocC5uZXQucGwiLCJ1cG4iOiJrYXJvbC5ncm9kemlja2lAemhwLm5ldC5wbCIsInV0aSI6IjQzNnhLYnBCajBHQU16ZE14VGNSQUEiLCJ2ZXIiOiIxLjAiLCJ4bXNfZnRkIjoiMXNKc1lYcTE0eTFWcGtoUVI4d2FNbkV6cldsUXI3VGh6MGtfUkhQVmJ2Y0JabkpoYm1ObFl5MWtjMjF6IiwibWVtYmVyTnVtIjoiQUwwMDUwNDcwNzEifQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

function buildRequest(headers: Record<string, string>): Request {
  return {
    headers,
  } as Request;
}

function buildTokenFromPayload(payload: Record<string, unknown>): string {
  const payloadPart = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");

  return `header.${payloadPart}.signature`;
}

beforeEach((): void => {
  mockConfig.isLocalInstance = true;
});

describe("getRequestIdentity in local mode", (): void => {
  it("extracts identity from bearer token", (): void => {
    const request = buildRequest({
      authorization: `Bearer ${TEST_BEARER_TOKEN}`,
    });

    const identity = getRequestIdentity(request);

    expect(identity).toEqual({
      login: "karol.grodzicki@zhp.net.pl",
      memberNum: "AL005047071",
    });
  });

  it("ignores azure easyauth headers when bearer is present", (): void => {
    const request = buildRequest({
      authorization: `Bearer ${TEST_BEARER_TOKEN}`,
      "x-ms-client-principal-name": "azure.user@zhp.net.pl",
      "x-ms-client-principal": CLIENT_PRINCIPAL,
    });

    const identity = getRequestIdentity(request);

    expect(identity).toEqual({
      login: "karol.grodzicki@zhp.net.pl",
      memberNum: "AL005047071",
    });
  });

  it("returns empty identity for malformed bearer token", (): void => {
    const request = buildRequest({
      authorization: "Bearer",
    });

    const identity = getRequestIdentity(request);

    expect(identity).toBeNull();
  });

  it("returns empty identity when bearer payload does not contain memberNum", (): void => {
    const request = buildRequest({
      authorization: `Bearer ${buildTokenFromPayload({ upn: "person@zhp.net.pl" })}`,
    });

    const identity = getRequestIdentity(request);

    expect(identity).toBeNull();
  });
});

describe("getRequestIdentity in production mode", (): void => {
  beforeEach((): void => {
    mockConfig.isLocalInstance = false;
  });

  it("extracts login and memberNum from Azure EasyAuth headers", (): void => {
    const request = buildRequest({
      authorization: `Bearer ${TEST_BEARER_TOKEN}`,
      "x-ms-client-principal-name": "karol.grodzicki2@zhp.net.pl",
      "x-ms-client-principal": CLIENT_PRINCIPAL,
    });

    const identity = getRequestIdentity(request);

    expect(identity).toEqual({
      login: "karol.grodzicki2@zhp.net.pl",
      memberNum: "AL005047071",
    });
  });
});
