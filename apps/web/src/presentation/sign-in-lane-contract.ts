import type { WebLane } from "./access-gate-lane-contract";

type AuthStatus =
  | "signed_out"
  | "loading"
  | "validation_error"
  | "auth_error"
  | "session_required"
  | "recovery_sent_email"
  | "recovery_sent_sms"
  | `signed_in:${string}`;

type CreateSignInLaneScreenModelInput = {
  lane: WebLane;
  authStatus: AuthStatus;
};

export type SignInLaneScreenModel = {
  routeId: "web.route.signIn" | "web.route.light.signIn";
  screenId: "web.signIn.screen" | "web.light.signIn.screen";
  statusId: "web.signIn.status" | "web.light.signIn.status";
  actions: {
    apple: "web.signIn.apple" | "web.light.signIn.apple";
    google: "web.signIn.google" | "web.light.signIn.google";
    email: "web.signIn.email" | "web.light.signIn.email";
    recoverEmail: "web.signIn.recoverEmail" | "web.light.signIn.recoverEmail";
    recoverSMS: "web.signIn.recoverSMS" | "web.light.signIn.recoverSMS";
  };
  status: AuthStatus;
};

export function createSignInLaneScreenModel(
  input: CreateSignInLaneScreenModelInput
): SignInLaneScreenModel {
  if (input.lane === "secondary") {
    return {
      routeId: "web.route.light.signIn",
      screenId: "web.light.signIn.screen",
      statusId: "web.light.signIn.status",
      actions: {
        apple: "web.light.signIn.apple",
        google: "web.light.signIn.google",
        email: "web.light.signIn.email",
        recoverEmail: "web.light.signIn.recoverEmail",
        recoverSMS: "web.light.signIn.recoverSMS"
      },
      status: input.authStatus
    };
  }

  return {
    routeId: "web.route.signIn",
    screenId: "web.signIn.screen",
    statusId: "web.signIn.status",
    actions: {
      apple: "web.signIn.apple",
      google: "web.signIn.google",
      email: "web.signIn.email",
      recoverEmail: "web.signIn.recoverEmail",
      recoverSMS: "web.signIn.recoverSMS"
    },
    status: input.authStatus
  };
}
