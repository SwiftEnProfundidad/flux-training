import { describe, expect, it } from "vitest";
import type { HealthScreening } from "@flux/contracts";
import { CreateHealthScreeningUseCase } from "./create-health-screening";
import type { HealthScreeningRepository } from "../domain/health-screening-repository";

class InMemoryHealthScreeningRepository implements HealthScreeningRepository {
  records: HealthScreening[] = [];

  async save(screening: HealthScreening): Promise<void> {
    this.records.push(screening);
  }
}

describe("CreateHealthScreeningUseCase", () => {
  it("evaluates risk and stores screening", async () => {
    const repository = new InMemoryHealthScreeningRepository();
    const useCase = new CreateHealthScreeningUseCase(repository);

    const screening = await useCase.execute({
      userId: "user-1",
      onboardingProfile: {
        displayName: "Juan",
        age: 35,
        heightCm: 178,
        weightKg: 84,
        availableDaysPerWeek: 4,
        equipment: ["dumbbells"],
        injuries: []
      },
      responses: [
        { questionId: "parq-1", answer: false },
        { questionId: "parq-2", answer: true }
      ]
    });

    expect(screening.risk).toBe("moderate");
    expect(repository.records).toHaveLength(1);
  });
});

