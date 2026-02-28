import type { ProgressSummary } from "@flux/contracts";

export interface ProgressGateway {
  getProgressSummary(userId: string): Promise<ProgressSummary>;
}

export class ManageProgressUseCase {
  constructor(private readonly progressGateway: ProgressGateway) {}

  async getSummary(userId: string): Promise<ProgressSummary> {
    if (userId.length === 0) {
      throw new Error("missing_user_id");
    }
    return this.progressGateway.getProgressSummary(userId);
  }
}
