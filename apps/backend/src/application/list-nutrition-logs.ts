import type { NutritionLog } from "@flux/contracts";
import type { NutritionLogRepository } from "../domain/nutrition-log-repository";

export class ListNutritionLogsUseCase {
  constructor(private readonly repository: NutritionLogRepository) {}

  async execute(userId: string): Promise<NutritionLog[]> {
    if (userId.length === 0) {
      throw new Error("missing_user_id");
    }
    return this.repository.listByUserId(userId);
  }
}

