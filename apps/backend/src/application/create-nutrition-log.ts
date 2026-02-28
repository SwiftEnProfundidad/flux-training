import { nutritionLogSchema, type NutritionLog } from "@flux/contracts";
import type { NutritionLogRepository } from "../domain/nutrition-log-repository";

export class CreateNutritionLogUseCase {
  constructor(private readonly repository: NutritionLogRepository) {}

  async execute(payload: NutritionLog): Promise<NutritionLog> {
    const log = nutritionLogSchema.parse(payload);
    await this.repository.save(log);
    return log;
  }
}

