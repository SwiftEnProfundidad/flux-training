import type { NutritionLog } from "@flux/contracts";
import type { NutritionGateway } from "../application/manage-nutrition";
import { assertApiResponse, createApiHeaders } from "./api-client";

class ApiNutritionGateway implements NutritionGateway {
  async createNutritionLog(log: NutritionLog): Promise<NutritionLog> {
    const response = await fetch("/api/createNutritionLog", {
      method: "POST",
      headers: createApiHeaders(undefined, true),
      body: JSON.stringify(log)
    });
    await assertApiResponse(response, "create_nutrition_log_failed");
    const payload = (await response.json()) as { log: NutritionLog };
    return payload.log;
  }

  async listNutritionLogs(userId: string): Promise<NutritionLog[]> {
    const response = await fetch(`/api/listNutritionLogs?userId=${encodeURIComponent(userId)}`, {
      headers: createApiHeaders()
    });
    await assertApiResponse(response, "list_nutrition_logs_failed");
    const payload = (await response.json()) as { logs: NutritionLog[] };
    return payload.logs;
  }
}

export const apiNutritionGateway: NutritionGateway = new ApiNutritionGateway();
