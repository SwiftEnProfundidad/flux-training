import Foundation

public struct UserLegalConsent: Sendable, Equatable {
  public let userID: String
  public let privacyPolicyAccepted: Bool
  public let termsAccepted: Bool
  public let medicalDisclaimerAccepted: Bool
  public let updatedAt: Date

  public init(
    userID: String,
    privacyPolicyAccepted: Bool,
    termsAccepted: Bool,
    medicalDisclaimerAccepted: Bool,
    updatedAt: Date
  ) {
    self.userID = userID
    self.privacyPolicyAccepted = privacyPolicyAccepted
    self.termsAccepted = termsAccepted
    self.medicalDisclaimerAccepted = medicalDisclaimerAccepted
    self.updatedAt = updatedAt
  }
}

public protocol UserLegalConsentRepository: Sendable {
  func save(consent: UserLegalConsent) async throws
  func load(userID: String) async throws -> UserLegalConsent?
}
