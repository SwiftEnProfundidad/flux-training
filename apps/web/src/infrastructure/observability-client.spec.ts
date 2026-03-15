import { beforeEach, describe, expect, it, vi } from "vitest";
import { createLocalPreviewSession } from "./firebase-auth-client";
import { setApiAuthSession } from "./api-client";
import {
  apiObservabilityGateway,
  resetLocalPreviewObservabilityStore
} from "./observability-client";

describe("apiObservabilityGateway", () => {
  beforeEach(() => {
    resetLocalPreviewObservabilityStore();
    setApiAuthSession(null);
    vi.restoreAllMocks();
  });

  it("avoids network calls for analytics and crash reports in local preview sessions", async () => {
    const previewSession = createLocalPreviewSession({ provider: "google" });
    setApiAuthSession(previewSession);
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const analyticsEvent = await apiObservabilityGateway.createAnalyticsEvent({
      userId: previewSession.userId,
      name: "dashboard_domain_changed",
      source: "web",
      occurredAt: "2026-03-13T09:00:00.000Z",
      attributes: {
        domain: "onboarding",
        correlationId: "preview-corr-1"
      }
    });
    const crashReport = await apiObservabilityGateway.createCrashReport({
      userId: previewSession.userId,
      source: "web",
      message: "Preview issue",
      severity: "warning",
      occurredAt: "2026-03-13T09:01:00.000Z"
    });
    const storedEvents = await apiObservabilityGateway.listAnalyticsEvents(previewSession.userId);
    const storedReports = await apiObservabilityGateway.listCrashReports(previewSession.userId);
    const summary = await apiObservabilityGateway.listObservabilitySummary(previewSession.userId);

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(analyticsEvent.name).toBe("dashboard_domain_changed");
    expect(crashReport.message).toBe("Preview issue");
    expect(storedEvents).toHaveLength(1);
    expect(storedReports).toHaveLength(1);
    expect(summary.totalAnalyticsEvents).toBe(1);
    expect(summary.totalCrashReports).toBe(1);
    expect(summary.uniqueCorrelationIds).toBe(1);
  });

  it("keeps using the backend for real sessions", async () => {
    setApiAuthSession({
      userId: "user-real-1",
      sessionId: "session-real-1",
      token: "token-real-1",
      issuedAt: "2026-03-13T09:00:00.000Z",
      expiresAt: "2026-03-13T10:00:00.000Z",
      rotationRequiredAt: "2026-03-13T09:30:00.000Z",
      absoluteExpiresAt: "2026-03-13T18:00:00.000Z",
      sessionPolicy: {
        maxIdleSeconds: 1800,
        rotationIntervalSeconds: 900,
        absoluteTtlSeconds: 28800
      },
      identity: {
        provider: "email",
        providerUserId: "provider-real-1",
        email: "real@flux.app",
        displayName: "Real Athlete"
      }
    });
    const fetchSpy = vi.fn(async () =>
      new Response(
        JSON.stringify({
          event: {
            userId: "user-real-1",
            name: "dashboard_domain_changed",
            source: "web",
            occurredAt: "2026-03-13T09:00:00.000Z",
            attributes: {
              domain: "training"
            }
          }
        }),
        {
          status: 201,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    );
    vi.stubGlobal("fetch", fetchSpy);

    const event = await apiObservabilityGateway.createAnalyticsEvent({
      userId: "user-real-1",
      name: "dashboard_domain_changed",
      source: "web",
      occurredAt: "2026-03-13T09:00:00.000Z",
      attributes: {
        domain: "training"
      }
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(event.attributes.domain).toBe("training");
  });
});
