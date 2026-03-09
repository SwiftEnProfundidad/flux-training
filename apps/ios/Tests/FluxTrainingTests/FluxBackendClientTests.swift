import Foundation
import XCTest
@testable import FluxTraining

private final class FluxBackendClientURLProtocol: URLProtocol {
  nonisolated(unsafe) static var requestHandler: ((URLRequest) throws -> (HTTPURLResponse, Data))?

  override class func canInit(with request: URLRequest) -> Bool {
    true
  }

  override class func canonicalRequest(for request: URLRequest) -> URLRequest {
    request
  }

  override func startLoading() {
    guard let requestHandler = Self.requestHandler else {
      client?.urlProtocol(self, didFailWithError: URLError(.badServerResponse))
      return
    }

    do {
      let (response, data) = try requestHandler(request)
      client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)
      client?.urlProtocol(self, didLoad: data)
      client?.urlProtocolDidFinishLoading(self)
    } catch {
      client?.urlProtocol(self, didFailWithError: error)
    }
  }

  override func stopLoading() {}
}

final class FluxBackendClientTests: XCTestCase {
  private struct EmptyBody: Encodable {}
  private struct EmptyResponse: Decodable {}

  override func tearDown() {
    FluxBackendClientURLProtocol.requestHandler = nil
    super.tearDown()
  }

  func test_post_whenBackendReturnsStructuredError_throwsBackendErrorWithCorrelationMetadata() async throws {
    let client = try await makeClientWithSession()
    FluxBackendClientURLProtocol.requestHandler = { request in
      let response = HTTPURLResponse(
        url: try XCTUnwrap(request.url),
        statusCode: 401,
        httpVersion: nil,
        headerFields: [
          "Content-Type": "application/json",
          "x-correlation-id": "corr-header-401"
        ]
      )!
      let payload = """
      {"error":"invalid_authorization_bearer","correlationId":"corr-body-401","retryable":false,"statusCode":401}
      """
      return (response, Data(payload.utf8))
    }

    do {
      let _: EmptyResponse = try await client.post(
        path: "listTrainingPlans",
        body: EmptyBody(),
        requiresAuthorization: true
      )
      XCTFail("expected backend error")
    } catch let error as FluxBackendClientError {
      XCTAssertEqual(
        error,
        .backend(
          code: "invalid_authorization_bearer",
          correlationId: "corr-body-401",
          retryable: false,
          statusCode: 401
        )
      )
    } catch {
      XCTFail("unexpected error: \(error)")
    }
  }

  func test_post_whenBackendErrorPayloadHasNoCorrelation_fallsBackToResponseHeader() async throws {
    let client = try await makeClientWithSession()
    FluxBackendClientURLProtocol.requestHandler = { request in
      let response = HTTPURLResponse(
        url: try XCTUnwrap(request.url),
        statusCode: 503,
        httpVersion: nil,
        headerFields: [
          "Content-Type": "application/json",
          "x-correlation-id": "corr-header-503"
        ]
      )!
      let payload = """
      {"error":"request_failed"}
      """
      return (response, Data(payload.utf8))
    }

    do {
      let _: EmptyResponse = try await client.post(
        path: "listTrainingPlans",
        body: EmptyBody(),
        requiresAuthorization: true
      )
      XCTFail("expected backend error")
    } catch let error as FluxBackendClientError {
      XCTAssertEqual(
        error,
        .backend(
          code: "request_failed",
          correlationId: "corr-header-503",
          retryable: true,
          statusCode: 503
        )
      )
    } catch {
      XCTFail("unexpected error: \(error)")
    }
  }

  private func makeClientWithSession() async throws -> FluxBackendClient {
    let sessionStore = FluxSessionStore()
    await sessionStore.save(session: AuthSession(
      userID: "user-123",
      sessionID: "session-123",
      token: "token-123",
      issuedAt: Date(timeIntervalSince1970: 1),
      expiresAt: Date(timeIntervalSince1970: 2),
      rotationRequiredAt: Date(timeIntervalSince1970: 3),
      absoluteExpiresAt: Date(timeIntervalSince1970: 4),
      sessionPolicy: AuthSession.Policy(
        maxIdleSeconds: 1800,
        rotationIntervalSeconds: 600,
        absoluteTTLSeconds: 43200
      ),
      identity: AuthIdentity(
        provider: .email,
        providerUserID: "provider-user-123",
        email: "user@example.com",
        displayName: "User"
      )
    ))
    let configuration = URLSessionConfiguration.ephemeral
    configuration.protocolClasses = [FluxBackendClientURLProtocol.self]
    let session = URLSession(configuration: configuration)
    return FluxBackendClient(
      configuration: FluxBackendConfiguration(
        baseURL: try XCTUnwrap(URL(string: "https://flux.local/")),
        clientVersion: "0.1.0"
      ),
      sessionStore: sessionStore,
      session: session
    )
  }
}
