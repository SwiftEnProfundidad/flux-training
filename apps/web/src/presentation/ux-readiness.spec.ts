import { describe, expect, it } from "vitest";
import { buildUXReadinessSnapshot } from "./ux-readiness";

describe("buildUXReadinessSnapshot", () => {
  it("returns high readiness when core statuses are healthy", () => {
    const snapshot = buildUXReadinessSnapshot({
      authStatus: "signed_in:apple",
      onboardingStatus: "saved",
      trainingStatus: "loaded",
      nutritionStatus: "loaded",
      progressStatus: "loaded",
      syncStatus: "synced",
      observabilityStatus: "loaded",
      pendingQueueCount: 0,
      releaseCompatibilityStatus: "compatible"
    });

    expect(snapshot.score).toBeGreaterThanOrEqual(90);
    expect(snapshot.label).toBe("ready_to_train");
    expect(snapshot.tone).toBe("positive");
  });

  it("returns low readiness when client upgrade is required", () => {
    const snapshot = buildUXReadinessSnapshot({
      authStatus: "signed_out",
      onboardingStatus: "idle",
      trainingStatus: "idle",
      nutritionStatus: "idle",
      progressStatus: "idle",
      syncStatus: "idle",
      observabilityStatus: "idle",
      pendingQueueCount: 4,
      releaseCompatibilityStatus: "upgrade_required"
    });

    expect(snapshot.score).toBeLessThan(40);
    expect(snapshot.label).toBe("upgrade_required");
    expect(snapshot.tone).toBe("critical");
  });
});
