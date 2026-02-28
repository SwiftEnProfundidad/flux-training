import type { ProgressSummary } from "@flux/contracts";
import type { ProgressGateway } from "../application/manage-progress";
import { assertApiResponse, createApiHeaders } from "./api-client";

class ApiProgressGateway implements ProgressGateway {
  async getProgressSummary(userId: string): Promise<ProgressSummary> {
    const response = await fetch(`/api/getProgressSummary?userId=${encodeURIComponent(userId)}`, {
      headers: createApiHeaders()
    });
    await assertApiResponse(response, "get_progress_summary_failed");
    const payload = (await response.json()) as { summary: ProgressSummary };
    return payload.summary;
  }
}

export const apiProgressGateway: ProgressGateway = new ApiProgressGateway();
