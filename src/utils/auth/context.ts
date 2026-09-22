import "server-only";

import { cache } from "react";

import { apiClient } from "@/utils/services/GatewayServerClient";
import { GatewayRequestError } from "@/utils/services/GatewayRequestError";

export interface BeneficiaryIdentity {
  sub: string;
  preferredUsername?: string;
  name?: string;
  givenName?: string;
  familyName?: string;
  email?: string;
}

export interface BeneficiaryContext {
  authenticated: true;
  currentTool: "beneficiary";
  currentClient: "beneficiary-interface";
  identity: BeneficiaryIdentity;
  realmRoles: string[];
  clientRoles: string[];
  groups: string[];
  contextExpiresAt: number;
  sessionExpiresAt: number;
  sessionAbsoluteExpiresAt: number;
}

function plainRecord(value: unknown): Record<string, unknown> {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    Object.getPrototypeOf(value) !== Object.prototype
  ) {
    throw new GatewayRequestError(502, "AUTH_UPSTREAM_ERROR");
  }
  return value as Record<string, unknown>;
}

function exactKeys(record: Record<string, unknown>, allowed: readonly string[]): void {
  if (Object.keys(record).some((key) => !allowed.includes(key))) {
    throw new GatewayRequestError(502, "AUTH_UPSTREAM_ERROR");
  }
}

function requiredString(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) throw new GatewayRequestError(502, "AUTH_UPSTREAM_ERROR");
  return value;
}

function optionalString(value: unknown): string | undefined {
  return value === undefined ? undefined : requiredString(value);
}

function stringList(value: unknown): string[] {
  if (
    !Array.isArray(value) ||
    value.some((item) => typeof item !== "string" || !item.trim()) ||
    new Set(value).size !== value.length
  ) {
    throw new GatewayRequestError(502, "AUTH_UPSTREAM_ERROR");
  }
  return [...value];
}

function futureEpoch(value: unknown): number {
  if (!Number.isSafeInteger(value) || (value as number) <= Date.now()) {
    throw new GatewayRequestError(502, "AUTH_UPSTREAM_ERROR");
  }
  return value as number;
}

function parseContext(value: unknown): BeneficiaryContext {
  const source = plainRecord(value);
  exactKeys(source, [
    "authenticated",
    "currentTool",
    "currentClient",
    "identity",
    "realmRoles",
    "clientRoles",
    "groups",
    "contextExpiresAt",
    "sessionExpiresAt",
    "sessionAbsoluteExpiresAt",
  ]);

  if (
    source.authenticated !== true ||
    source.currentTool !== "beneficiary" ||
    source.currentClient !== "beneficiary-interface"
  ) {
    throw new GatewayRequestError(502, "AUTH_UPSTREAM_ERROR");
  }

  const identity = plainRecord(source.identity);
  exactKeys(identity, ["sub", "preferredUsername", "name", "givenName", "familyName", "email"]);

  const contextExpiresAt = futureEpoch(source.contextExpiresAt);
  const sessionExpiresAt = futureEpoch(source.sessionExpiresAt);
  const sessionAbsoluteExpiresAt = futureEpoch(source.sessionAbsoluteExpiresAt);

  if (sessionExpiresAt > sessionAbsoluteExpiresAt) {
    throw new GatewayRequestError(502, "AUTH_UPSTREAM_ERROR");
  }

  return {
    authenticated: true,
    currentTool: "beneficiary",
    currentClient: "beneficiary-interface",
    identity: {
      sub: requiredString(identity.sub),
      preferredUsername: optionalString(identity.preferredUsername),
      name: optionalString(identity.name),
      givenName: optionalString(identity.givenName),
      familyName: optionalString(identity.familyName),
      email: optionalString(identity.email),
    },
    realmRoles: stringList(source.realmRoles),
    clientRoles: stringList(source.clientRoles),
    groups: stringList(source.groups),
    contextExpiresAt,
    sessionExpiresAt,
    sessionAbsoluteExpiresAt,
  };
}

export const getBeneficiaryContext = cache(async (): Promise<BeneficiaryContext> => {
  const response = await apiClient.POST_CONTEXT("auth/client/context", { tool: "beneficiary" });
  const payload: unknown = await response.json();

  return parseContext(payload);
});
