import type { UserProfile } from "@flux/contracts";

export interface UserProfileRepository {
  save(profile: UserProfile): Promise<void>;
}

