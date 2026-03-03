import Foundation

public struct FluxTrainingAppConfiguration: Sendable, Equatable {
  public let defaultUserID: String
  public let backendConfiguration: FluxBackendConfiguration

  public init(
    defaultUserID: String,
    backendConfiguration: FluxBackendConfiguration
  ) {
    self.defaultUserID = defaultUserID
    self.backendConfiguration = backendConfiguration
  }

  public static let production = FluxTrainingAppConfiguration.makeProduction()

  private static func makeProduction() -> FluxTrainingAppConfiguration {
    let environment = ProcessInfo.processInfo.environment
    let rawBaseURL = environment["FLUX_BACKEND_BASE_URL"] ?? "http://127.0.0.1:8787/api"
    let backendURL = URL(string: rawBaseURL) ?? URL(string: "http://127.0.0.1:8787/api")!
    let clientVersion = environment["FLUX_IOS_CLIENT_VERSION"] ?? "0.1.0"
    let appleProviderToken =
      environment["FLUX_APPLE_PROVIDER_TOKEN"] ?? "ios-apple-provider-token"

    return FluxTrainingAppConfiguration(
      defaultUserID: environment["FLUX_DEFAULT_USER_ID"] ?? "flux-user-local",
      backendConfiguration: FluxBackendConfiguration(
        baseURL: backendURL,
        clientVersion: clientVersion,
        appleProviderToken: appleProviderToken
      )
    )
  }
}
