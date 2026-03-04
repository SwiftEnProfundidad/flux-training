import Foundation

private struct CreateAuthSessionRequest: Encodable {
  let providerToken: String
}

private struct FirebaseEmailSignInRequest: Encodable {
  let email: String
  let password: String
  let returnSecureToken: Bool
}

private struct FirebaseEmailSignInResponse: Decodable {
  let idToken: String
}

private struct CreateAuthSessionResponse: Decodable {
  struct PayloadSessionPolicy: Decodable {
    let maxIdleSeconds: Int
    let rotationIntervalSeconds: Int
    let absoluteTtlSeconds: Int
  }

  struct PayloadIdentity: Decodable {
    let provider: String
    let providerUserId: String
    let email: String?
    let displayName: String?
  }

  struct PayloadSession: Decodable {
    let userId: String
    let sessionId: String
    let token: String
    let issuedAt: Date
    let expiresAt: Date
    let rotationRequiredAt: Date
    let absoluteExpiresAt: Date
    let sessionPolicy: PayloadSessionPolicy
    let identity: PayloadIdentity
  }

  let session: PayloadSession
}

public struct RemoteAuthGateway: AuthGateway {
  private let client: FluxBackendClient
  private let sessionStore: FluxSessionStore
  private let configuration: FluxBackendConfiguration

  public init(
    client: FluxBackendClient,
    sessionStore: FluxSessionStore,
    configuration: FluxBackendConfiguration
  ) {
    self.client = client
    self.sessionStore = sessionStore
    self.configuration = configuration
  }

  public func createSessionWithApple() async throws -> AuthSession {
    let providerToken = configuration.appleProviderToken
      .trimmingCharacters(in: .whitespacesAndNewlines)
    if providerToken.isEmpty || providerToken == "ios-apple-provider-token" {
      throw FluxBackendClientError.backend(code: "missing_apple_provider_token")
    }
    return try await createSession(providerToken: providerToken)
  }

  public func createSessionWithEmail(email: String, password: String) async throws -> AuthSession {
    let providerToken = try await requestFirebaseEmailProviderToken(
      email: email,
      password: password
    )
    return try await createSession(providerToken: providerToken)
  }

  private func createSession(providerToken: String) async throws -> AuthSession {
    let payload: CreateAuthSessionResponse = try await client.post(
      path: "createAuthSession",
      body: CreateAuthSessionRequest(providerToken: providerToken),
      requiresAuthorization: false
    )

    let provider = payload.session.identity.provider == "apple" ? AuthProvider.apple : .email
    let session = AuthSession(
      userID: payload.session.userId,
      sessionID: payload.session.sessionId,
      token: payload.session.token,
      issuedAt: payload.session.issuedAt,
      expiresAt: payload.session.expiresAt,
      rotationRequiredAt: payload.session.rotationRequiredAt,
      absoluteExpiresAt: payload.session.absoluteExpiresAt,
      sessionPolicy: AuthSession.Policy(
        maxIdleSeconds: payload.session.sessionPolicy.maxIdleSeconds,
        rotationIntervalSeconds: payload.session.sessionPolicy.rotationIntervalSeconds,
        absoluteTTLSeconds: payload.session.sessionPolicy.absoluteTtlSeconds
      ),
      identity: AuthIdentity(
        provider: provider,
        providerUserID: payload.session.identity.providerUserId,
        email: payload.session.identity.email,
        displayName: payload.session.identity.displayName
      )
    )

    await sessionStore.save(session: session)
    return session
  }

  private func requestFirebaseEmailProviderToken(
    email: String,
    password: String
  ) async throws -> String {
    let normalizedAPIKey = configuration.firebaseWebAPIKey
      .trimmingCharacters(in: .whitespacesAndNewlines)
    guard normalizedAPIKey.isEmpty == false else {
      throw FluxBackendClientError.backend(code: "missing_firebase_web_api_key")
    }

    var components = URLComponents(
      string: "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword"
    )
    components?.queryItems = [URLQueryItem(name: "key", value: normalizedAPIKey)]
    guard let url = components?.url else {
      throw FluxBackendClientError.invalidURL
    }

    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.httpBody = try JSONEncoder().encode(
      FirebaseEmailSignInRequest(
        email: email.trimmingCharacters(in: .whitespacesAndNewlines),
        password: password,
        returnSecureToken: true
      )
    )

    let (data, response) = try await URLSession.shared.data(for: request)
    guard let httpResponse = response as? HTTPURLResponse else {
      throw FluxBackendClientError.invalidResponse
    }

    guard (200...299).contains(httpResponse.statusCode) else {
      throw FluxBackendClientError.backend(code: "firebase_email_sign_in_failed")
    }

    let payload = try JSONDecoder().decode(FirebaseEmailSignInResponse.self, from: data)
    guard payload.idToken.isEmpty == false else {
      throw FluxBackendClientError.backend(code: "firebase_email_sign_in_failed")
    }
    return payload.idToken
  }
}
