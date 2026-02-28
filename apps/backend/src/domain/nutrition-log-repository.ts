import type { NutritionLog } from "@flux/contracts";

export interface NutritionLogRepository {
  save(log: NutritionLog): Promise<void>;
  listByUserId(userId: string): Promise<NutritionLog[]>;
}

