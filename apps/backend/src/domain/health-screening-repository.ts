import type { HealthScreening } from "@flux/contracts";

export interface HealthScreeningRepository {
  save(screening: HealthScreening): Promise<void>;
}

