import Foundation

enum FluxLocalEnvironment {
  static func merged(
    processEnvironment: [String: String] = ProcessInfo.processInfo.environment,
    currentDirectoryPath: String = FileManager.default.currentDirectoryPath
  ) -> [String: String] {
    let fileEnvironment = loadEnvironmentFile(currentDirectoryPath: currentDirectoryPath)
    return fileEnvironment.merging(processEnvironment) { _, processValue in processValue }
  }

  private static func loadEnvironmentFile(currentDirectoryPath: String) -> [String: String] {
    guard let fileURL = locateEnvironmentFile(currentDirectoryPath: currentDirectoryPath) else {
      return [:]
    }
    guard let contents = try? String(contentsOf: fileURL, encoding: .utf8) else {
      return [:]
    }

    return contents
      .split(whereSeparator: \.isNewline)
      .reduce(into: [String: String]()) { environment, rawLine in
        let line = rawLine.trimmingCharacters(in: .whitespacesAndNewlines)
        guard line.isEmpty == false, line.hasPrefix("#") == false else {
          return
        }

        let segments = line.split(separator: "=", maxSplits: 1, omittingEmptySubsequences: false)
        guard segments.count == 2 else {
          return
        }

        let key = String(segments[0]).trimmingCharacters(in: .whitespacesAndNewlines)
        guard key.isEmpty == false else {
          return
        }

        let value = String(segments[1]).trimmingCharacters(in: .whitespacesAndNewlines)
        environment[key] = value
      }
  }

  private static func locateEnvironmentFile(currentDirectoryPath: String) -> URL? {
    let currentDirectoryURL = URL(fileURLWithPath: currentDirectoryPath, isDirectory: true)
    let iosEnvironmentURL = currentDirectoryURL.appendingPathComponent(".env.local")
    if FileManager.default.fileExists(atPath: iosEnvironmentURL.path) {
      return iosEnvironmentURL
    }

    var cursor = currentDirectoryURL
    while true {
      let candidate = cursor.appendingPathComponent("apps/ios/.env.local")
      if FileManager.default.fileExists(atPath: candidate.path) {
        return candidate
      }

      let parent = cursor.deletingLastPathComponent()
      if parent.path == cursor.path {
        return nil
      }
      cursor = parent
    }
  }
}

public struct FluxTrainingAppConfiguration: Sendable, Equatable {
  private static let defaultBackendURLString =
    "https://us-central1-flux-training-mvp.cloudfunctions.net"

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

  static func makeProduction(
    processEnvironment: [String: String] = ProcessInfo.processInfo.environment,
    currentDirectoryPath: String = FileManager.default.currentDirectoryPath
  ) -> FluxTrainingAppConfiguration {
    let environment = FluxLocalEnvironment.merged(
      processEnvironment: processEnvironment,
      currentDirectoryPath: currentDirectoryPath
    )
    let rawBaseURL =
      environment["FLUX_BACKEND_BASE_URL"] ??
      defaultBackendURLString
    let backendURL = URL(string: rawBaseURL) ?? defaultBackendURL
    let clientVersion = environment["FLUX_IOS_CLIENT_VERSION"] ?? "0.1.0"
    let appleProviderToken =
      environment["FLUX_APPLE_PROVIDER_TOKEN"] ?? "ios-apple-provider-token"
    let firebaseWebAPIKey =
      environment["FLUX_FIREBASE_WEB_API_KEY"] ??
      environment["FLUX_FIREBASE_API_KEY"] ??
      ""

    return FluxTrainingAppConfiguration(
      defaultUserID: environment["FLUX_DEFAULT_USER_ID"] ?? "flux-user-local",
      backendConfiguration: FluxBackendConfiguration(
        baseURL: backendURL,
        clientVersion: clientVersion,
        appleProviderToken: appleProviderToken,
        firebaseWebAPIKey: firebaseWebAPIKey
      )
    )
  }

  private static var defaultBackendURL: URL {
    URL(string: defaultBackendURLString) ?? URL(filePath: "/")
  }
}
