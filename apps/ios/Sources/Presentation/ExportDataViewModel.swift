import Foundation
import Observation

@MainActor
@Observable
public final class ExportDataViewModel {
  public private(set) var status: String = SettingsLegalScreenStatus.idle.rawValue
  public private(set) var generatedAtISO8601 = "-"
  public private(set) var payloadBytes = 0
  public private(set) var payloadPreview = ""

  private let exportUserDataUseCase: ExportUserDataUseCase
  private let iso8601Formatter: ISO8601DateFormatter

  public var screenStatus: SettingsLegalScreenStatus {
    SettingsLegalScreenStatus.fromRuntimeStatus(status)
  }

  public init(exportUserDataUseCase: ExportUserDataUseCase) {
    self.exportUserDataUseCase = exportUserDataUseCase
    self.iso8601Formatter = ISO8601DateFormatter()
  }

  public func refresh(userID: String) async {
    let resolvedUserID = userID.trimmingCharacters(in: .whitespacesAndNewlines)
    guard resolvedUserID.isEmpty == false else {
      status = SettingsLegalScreenStatus.validationError.rawValue
      return
    }

    status = SettingsLegalScreenStatus.loading.rawValue
    do {
      let payload = try await exportUserDataUseCase.execute(userID: resolvedUserID)
      payloadBytes = payload.bytes
      payloadPreview = payload.json
      generatedAtISO8601 = iso8601Formatter.string(from: payload.snapshot.exportedAt)
      status = payloadContainsAnyData(payload.snapshot) ? "loaded" : "empty"
    } catch {
      status = resolveStatus(for: error)
    }
  }

  public func export(userID: String) async {
    let resolvedUserID = userID.trimmingCharacters(in: .whitespacesAndNewlines)
    guard resolvedUserID.isEmpty == false else {
      status = SettingsLegalScreenStatus.validationError.rawValue
      return
    }

    status = SettingsLegalScreenStatus.loading.rawValue
    do {
      let payload = try await exportUserDataUseCase.execute(userID: resolvedUserID)
      payloadBytes = payload.bytes
      payloadPreview = payload.json
      generatedAtISO8601 = iso8601Formatter.string(from: payload.snapshot.exportedAt)
      status = SettingsLegalScreenStatus.exported.rawValue
    } catch {
      status = resolveStatus(for: error)
    }
  }

  private func payloadContainsAnyData(_ snapshot: UserDataExportSnapshot) -> Bool {
    snapshot.profile != nil || snapshot.settings != nil || snapshot.legalConsent != nil
  }

  private func resolveStatus(for error: Error) -> String {
    if error is ExportUserDataError {
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
