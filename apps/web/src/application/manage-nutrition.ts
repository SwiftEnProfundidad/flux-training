import { nutritionLogSchema, type NutritionLog } from "@flux/contracts";

export interface NutritionGateway {
  createNutritionLog(log: NutritionLog): Promise<NutritionLog>;
  listNutritionLogs(userId: string): Promise<NutritionLog[]>;
}

export class ManageNutritionUseCase {
  constructor(private readonly gateway: NutritionGateway) {}

  async createNutritionLog(log: NutritionLog): Promise<NutritionLog> {
    const createdLog = await this.gateway.createNutritionLog(log);
    return nutritionLogSchema.parse(createdLog);
  }

  async listNutritionLogs(userId: string): Promise<NutritionLog[]> {
    const logs = await this.gateway.listNutritionLogs(userId);
    return nutritionLogSchema.array().parse(logs);
  }
}

