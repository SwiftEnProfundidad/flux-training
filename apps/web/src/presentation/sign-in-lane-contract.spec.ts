import { describe, expect, it } from "vitest";
import { createSignInLaneScreenModel } from "./sign-in-lane-contract";

describe("sign in lane contract", () => {
  it("returns main lane identifiers and actions", () => {
    expect(
      createSignInLaneScreenModel({
        lane: "main",
        authStatus: "signed_out"
      })
    ).toEqual({
      routeId: "web.route.signIn",
      screenId: "web.signIn.screen",
      statusId: "web.signIn.status",
      actions: {
        apple: "web.signIn.apple",
        email: "web.signIn.email",
        recoverEmail: "web.signIn.recoverEmail",
        recoverSMS: "web.signIn.recoverSMS"
      },
      status: "signed_out"
    });
  });

  it("returns secondary lane identifiers and actions", () => {
    expect(
      createSignInLaneScreenModel({
        lane: "secondary",
        authStatus: "validation_error"
      })
    ).toEqual({
      routeId: "web.route.light.signIn",
      screenId: "web.light.signIn.screen",
      statusId: "web.light.signIn.status",
      actions: {
        apple: "web.light.signIn.apple",
        email: "web.light.signIn.email",
        recoverEmail: "web.light.signIn.recoverEmail",
        recoverSMS: "web.light.signIn.recoverSMS"
      },
      status: "validation_error"
    });
  });
});
