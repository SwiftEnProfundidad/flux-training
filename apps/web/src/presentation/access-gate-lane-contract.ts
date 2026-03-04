export type WebLane = "main" | "secondary";

type AuthStatus =
  | "signed_out"
  | "loading"
  | "validation_error"
  | "auth_error"
  | "session_required"
  | "recovery_sent_email"
  | "recovery_sent_sms"
  | `signed_in:${string}`;

type CreateAccessGateLaneScreenModelInput = {
  lane: WebLane;
  hasAuthenticatedSession: boolean;
  authStatus: AuthStatus;
};

export type AccessGateLaneScreenModel = {
  routeId: "web.route.accessGate" | "web.route.light.accessGate";
  screenId: "web.accessGate.screen" | "web.light.accessGate.screen";
  status: AuthStatus;
};

export function createAccessGateLaneScreenModel(
  input: CreateAccessGateLaneScreenModelInput
): AccessGateLaneScreenModel {
  const routeId =
    input.lane === "main" ? "web.route.accessGate" : "web.route.light.accessGate";
  const screenId =
    input.lane === "main" ? "web.accessGate.screen" : "web.light.accessGate.screen";
  return {
    routeId,
    screenId,
    status: input.hasAuthenticatedSession ? "signed_in" : input.authStatus
  };
}
