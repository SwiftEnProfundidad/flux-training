import Foundation

public enum FluxBackendClientError: Error, Equatable {
  case missingAuthorizationBearer
  case invalidURL
  case invalidResponse
  case backend(
    code: String,
    correlationId: String? = nil,
    retryable: Bool? = nil,
    statusCode: Int? = nil
  )
}

public actor FluxBackendClient {
  private struct EmptyBody: Encodable {}
  private struct BackendErrorPayload: Decodable {
    let error: String?
    let correlationId: String?
    let retryable: Bool?
    let statusCode: Int?
  }

  private let configuration: FluxBackendConfiguration
  private let sessionStore: FluxSessionStore
  private let session: URLSession
  private let encoder: JSONEncoder
  private let decoder: JSONDecoder

  public init(
    configuration: FluxBackendConfiguration,
    sessionStore: FluxSessionStore,
    session: URLSession = .shared
  ) {
    self.configuration = configuration
    self.sessionStore = sessionStore
    self.session = session

    let configuredEncoder = JSONEncoder()
    configuredEncoder.dateEncodingStrategy = .iso8601
    self.encoder = configuredEncoder

    let configuredDecoder = JSONDecoder()
    configuredDecoder.dateDecodingStrategy = .iso8601
    self.decoder = configuredDecoder
  }

  public func post<Body: Encodable, Response: Decodable>(
    path: String,
    body: Body,
    requiresAuthorization: Bool
  ) async throws -> Response {
    try await request(
      method: "POST",
      path: path,
      queryItems: [],
      body: body,
      requiresAuthorization: requiresAuthorization
    )
  }

  public func get<Response: Decodable>(
    path: String,
    queryItems: [URLQueryItem] = [],
    requiresAuthorization: Bool
  ) async throws -> Response {
    return try await request(
      method: "GET",
      path: path,
      queryItems: queryItems,
      body: EmptyBody(),
      requiresAuthorization: requiresAuthorization
    )
  }

  public func currentUserID() async -> String? {
    await sessionStore.currentUserID()
  }

  private func request<Body: Encodable, Response: Decodable>(
    method: String,
    path: String,
    queryItems: [URLQueryItem],
    body: Body,
    requiresAuthorization: Bool
  ) async throws -> Response {
    guard var components = URLComponents(
      url: configuration.baseURL.appendingPathComponent(path),
      resolvingAgainstBaseURL: false
    ) else {
      throw FluxBackendClientError.invalidURL
    }

    if queryItems.isEmpty == false {
      components.queryItems = queryItems
    }

    guard let url = components.url else {
      throw FluxBackendClientError.invalidURL
    }

    var request = URLRequest(url: url)
    request.httpMethod = method
    request.setValue(configuration.platform, forHTTPHeaderField: "x-flux-client-platform")
    request.setValue(configuration.clientVersion, forHTTPHeaderField: "x-flux-client-version")

    if method == "POST" {
      request.setValue("application/json", forHTTPHeaderField: "Content-Type")
      request.httpBody = try encoder.encode(body)
    }

    if requiresAuthorization {
      guard let token = await sessionStore.currentToken() else {
        throw FluxBackendClientError.missingAuthorizationBearer
      }
      request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
    }

    let (data, response) = try await session.data(for: request)
    guard let httpResponse = response as? HTTPURLResponse else {
      throw FluxBackendClientError.invalidResponse
    }

    guard (200...299).contains(httpResponse.statusCode) else {
      let backendError = extractBackendError(from: data)
      let headerCorrelationID = sanitizedCorrelationID(
        httpResponse.value(forHTTPHeaderField: "x-correlation-id")
      )
      throw FluxBackendClientError.backend(
        code: backendError?.error ?? "request_failed",
        correlationId: backendError?.correlationId ?? headerCorrelationID,
        retryable: backendError?.retryable ?? (httpResponse.statusCode >= 500),
        statusCode: backendError?.statusCode ?? httpResponse.statusCode
      )
    }

    return try decoder.decode(Response.self, from: data)
  }

  private func extractBackendError(from data: Data) -> BackendErrorPayload? {
    guard let payload = try? decoder.decode(BackendErrorPayload.self, from: data) else {
      return nil
    }
    if let errorCode = payload.error?.trimmingCharacters(in: .whitespacesAndNewlines),
       errorCode.isEmpty {
      return nil
    }
    return payload
  }

  private func sanitizedCorrelationID(_ value: String?) -> String? {
    guard let normalized = value?.trimmingCharacters(in: .whitespacesAndNewlines),
          normalized.isEmpty == false
    else {
      return nil
    }
    return normalized
  }
}
