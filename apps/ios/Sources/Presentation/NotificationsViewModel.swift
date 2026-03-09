import Foundation
import Observation

@MainActor
@Observable
public final class NotificationsViewModel {
  public var trainingRemindersEnabled = true
  public var recoveryAlertsEnabled = true
  public var weeklyDigestEnabled = false
  public private(set) var status: String = SettingsLegalScreenStatus.idle.rawValue

  private let loadUserSettingsUseCase: LoadUserSettingsUseCase
  private let saveUserSettingsUseCase: SaveUserSettingsUseCase

  public var screenStatus: SettingsLegalScreenStatus {
    SettingsLegalScreenStatus.fromRuntimeStatus(status)
  }

  public init(
    loadUserSettingsUseCase: LoadUserSettingsUseCase,
    saveUserSettingsUseCase: SaveUserSettingsUseCase
  ) {
    self.loadUserSettingsUseCase = loadUserSettingsUseCase
    self.saveUserSettingsUseCase = saveUserSettingsUseCase
  }

  public func refresh(userID: String) async {
    let resolvedUserID = userID.trimmingCharacters(in: .whitespacesAndNewlines)
    guard resolvedUserID.isEmpty == false else {
      status = SettingsLegalScreenStatus.validationError.rawValue
      return
    }

    status = SettingsLegalScreenStatus.loading.rawValue
    do {
      let loadedSettings = try await loadUserSettingsUseCase.execute(userID: resolvedUserID)
      guard let loadedSettings else {
        status = "empty"
        return
      }
      trainingRemindersEnabled = loadedSettings.notificationsEnabled
      recoveryAlertsEnabled = loadedSettings.watchSyncEnabled
      weeklyDigestEnabled = loadedSettings.calendarSyncEnabled
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
      try await saveUserSettingsUseCase.execute(
        settings: UserSettings(
          userID: resolvedUserID,
          notificationsEnabled: trainingRemindersEnabled,
          watchSyncEnabled: recoveryAlertsEnabled,
          calendarSyncEnabled: weeklyDigestEnabled,
          updatedAt: Date()
        )
      )
      status = SettingsLegalScreenStatus.saved.rawValue
    } catch {
      status = resolveStatus(for: error)
    }
  }

  private func resolveStatus(for error: Error) -> String {
    if error is SaveUserSettingsError || error is LoadUserSettingsError {
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
