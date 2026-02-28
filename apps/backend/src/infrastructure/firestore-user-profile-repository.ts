import type { UserProfile } from "@flux/contracts";
import type { UserProfileRepository } from "../domain/user-profile-repository";
import { firestore } from "./firebase-app";

export class FirestoreUserProfileRepository implements UserProfileRepository {
  async save(profile: UserProfile): Promise<void> {
    await firestore.collection("userProfiles").doc(profile.id).set(profile);
  }
}

