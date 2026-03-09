import Foundation

public struct FluxBackendConfiguration: Sendable, Equatable {
  public let baseURL: URL
  public let clientVersion: String
  public let platform: String
  public let appleProviderToken: String
  public let firebaseWebAPIKey: String

  public init(
    baseURL: URL,
    clientVersion: String,
    platform: String = "ios",
    appleProviderToken: String = "ios-apple-provider-token",
    firebaseWebAPIKey: String = ""
  ) {
    self.baseURL = baseURL
    self.clientVersion = clientVersion
    self.platform = platform
    self.appleProviderToken = appleProviderToken
    self.firebaseWebAPIKey = firebaseWebAPIKey
  }
}
