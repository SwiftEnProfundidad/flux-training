import Foundation
import Observation

@MainActor
@Observable
public final class AccountProfileViewModel {
  public var displayName = ""
  public var age = 18
  public var heightCm = 170.0
  public var weightKg = 70.0
  public var goal: TrainingGoal = .recomposition
  public private(set) var status: String = SettingsLegalScreenStatus.idle.rawValue

  private let loadUserProfileUseCase: LoadUserProfileUseCase
  private let saveUserProfileUseCase: SaveUserProfileUseCase
  private var createdAt = Date()

  public var screenStatus: SettingsLegalScreenStatus {
    SettingsLegalScreenStatus.fromRuntimeStatus(status)
  }

  public init(
    loadUserProfileUseCase: LoadUserProfileUseCase,
    saveUserProfileUseCase: SaveUserProfileUseCase
  ) {
    self.loadUserProfileUseCase = loadUserProfileUseCase
    self.saveUserProfileUseCase = saveUserProfileUseCase
  }

  public func refresh(userID: String) async {
    let resolvedUserID = userID.trimmingCharacters(in: .whitespacesAndNewlines)
    guard resolvedUserID.isEmpty == false else {
      status = SettingsLegalScreenStatus.validationError.rawValue
      return
    }

    status = SettingsLegalScreenStatus.loading.rawValue
    do {
      let loadedProfile = try await loadUserProfileUseCase.execute(userID: resolvedUserID)
      guard let loadedProfile else {
        status = "empty"
        return
      }
      displayName = loadedProfile.displayName
      age = loadedProfile.age
      heightCm = loadedProfile.heightCm
      weightKg = loadedProfile.weightKg
      goal = loadedProfile.goal
      createdAt = loadedProfile.createdAt
      status = "loaded"
    } catch {
      status = resolveStatus(for: error)
    }
  }

  public func save(userID: String) async {
    let resolvedUserID = userID.trimmingCharacters(in: .whitespacesAndNewlines)
    guard resolvedUserID.isEmpty == false else {
      status = SettingsLegalScreenStatus.validationError.rawValue
      return
    }

    status = SettingsLegalScreenStatus.loading.rawValue
    do {
      try await saveUserProfileUseCase.execute(
        profile: UserProfile(
          id: resolvedUserID,
          displayName: displayName,
          goal: goal,
          age: age,
          heightCm: heightCm,
          weightKg: weightKg,
          createdAt: createdAt
        )
      )
      status = SettingsLegalScreenStatus.saved.rawValue
    } catch {
      status = resolveStatus(for: error)
    }
  }

  private func resolveStatus(for error: Error) -> String {
    if error is LoadUserProfileError || error is SaveUserProfileError {
      return SettingsLegalScreenStatus.validationError.rawValue
    }
    if let urlError = error as? URLError, urlError.code == .notConnectedToInternet {
      return SettingsLegalScreenStatus.offline.rawValue
    }
    if case FluxBackendClientError.missingAuthorizationBearer = error {
      return SettingsLegalScreenStatus.denied.rawValue
    }
    if case let FluxBackendClientError.backend(code, _, _, _) = error,
       code == "missing_authorization_bearer" || code == "invalid_authorization_bearer" {
      return SettingsLegalScreenStatus.denied.rawValue
    }
    return SettingsLegalScreenStatus.error.rawValue
  }
}
