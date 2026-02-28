import { afterEach, describe, expect, it } from "vitest";
import { startDemoHttpServer, type DemoHttpServer } from "./demo-http-server";

const clientHeaders = {
  "x-flux-client-platform": "web",
  "x-flux-client-version": "0.1.0"
};

describe("DemoHttpServer", () => {
  let server: DemoHttpServer | undefined;

  afterEach(async () => {
    if (server !== undefined) {
      await server.stop();
      server = undefined;
    }
  });

  it("serves videos and recommendations for dashboard local demo", async () => {
    server = await startDemoHttpServer({ port: 0 });

    const videosResponse = await fetch(
      `${server.baseUrl}/api/listExerciseVideos?userId=demo-user&exerciseId=goblet-squat&locale=es-ES`,
      { headers: clientHeaders }
    );
    const recommendationsResponse = await fetch(
      `${server.baseUrl}/api/listAIRecommendations?userId=demo-user&goal=recomposition&pendingQueueCount=1&daysSinceLastWorkout=3&recentCompletionRate=0.5&locale=es-ES`,
      { headers: clientHeaders }
    );

    expect(videosResponse.status).toBe(200);
    expect(recommendationsResponse.status).toBe(200);

    const videosPayload = (await videosResponse.json()) as { videos: unknown[] };
    const recommendationsPayload = (await recommendationsResponse.json()) as {
      recommendations: Array<{ priority?: string }>;
    };

    expect(videosPayload.videos.length).toBeGreaterThan(0);
    expect(recommendationsPayload.recommendations.length).toBeGreaterThan(0);
    expect(recommendationsPayload.recommendations[0]?.priority).toBe("high");
  });

  it("rejects clients below minimum version", async () => {
    server = await startDemoHttpServer({
      port: 0,
      webMinimumVersion: "0.2.0"
    });

    const response = await fetch(`${server.baseUrl}/api/listTrainingPlans?userId=demo-user`, {
      headers: clientHeaders
    });

    expect(response.status).toBe(426);

    const payload = (await response.json()) as { error?: string; minimumVersion?: string };
    expect(payload.error).toBe("client_update_required");
    expect(payload.minimumVersion).toBe("0.2.0");
  });

  it("returns method_not_allowed for known routes with invalid HTTP method", async () => {
    server = await startDemoHttpServer({ port: 0 });

    const response = await fetch(`${server.baseUrl}/api/listTrainingPlans?userId=demo-user`, {
      method: "POST",
      headers: clientHeaders
    });

    expect(response.status).toBe(405);
    const payload = (await response.json()) as { error?: string };
    expect(payload.error).toBe("method_not_allowed");
  });

  it("surfaces missing_user_id for list endpoints requiring identity scope", async () => {
    server = await startDemoHttpServer({ port: 0 });

    const response = await fetch(`${server.baseUrl}/api/listTrainingPlans`, {
      headers: clientHeaders
    });

    expect(response.status).toBe(400);
    const payload = (await response.json()) as { error?: string };
    expect(payload.error).toBe("missing_user_id");
  });
});
