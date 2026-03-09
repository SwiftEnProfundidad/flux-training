import Foundation

public enum SaveUserLegalConsentError: Error, Equatable {
  case invalidUserID
}

public struct SaveUserLegalConsentUseCase: Sendable {
  private let repository: any UserLegalConsentRepository

  public init(repository: any UserLegalConsentRepository) {
    self.repository = repository
  }

  public func execute(consent: UserLegalConsent) async throws {
    let resolvedUserID = consent.userID.trimmingCharacters(in: .whitespacesAndNewlines)
    guard resolvedUserID.isEmpty == false else {
      throw SaveUserLegalConsentError.invalidUserID
    }
    try await repository.save(
      consent: UserLegalConsent(
        userID: resolvedUserID,
        privacyPolicyAccepted: consent.privacyPolicyAccepted,
        termsAccepted: consent.termsAccepted,
        medicalDisclaimerAccepted: consent.medicalDisclaimerAccepted,
        updatedAt: consent.updatedAt
      )
    )
  }
}
