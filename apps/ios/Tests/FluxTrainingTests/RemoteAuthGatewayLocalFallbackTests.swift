import Foundation
import XCTest
@testable import FluxTraining

final class RemoteAuthGatewayLocalFallbackTests: XCTestCase {
  func test_shouldUseLocalDemoAuthFallback_whenHostIsLoopback_returnsTrue() throws {
    let localhostURL = try XCTUnwrap(URL(string: "http://localhost:8787"))
    let loopbackURL = try XCTUnwrap(URL(string: "http://127.0.0.1:8787"))

    XCTAssertTrue(shouldUseLocalDemoAuthFallback(baseURL: localhostURL))
    XCTAssertTrue(shouldUseLocalDemoAuthFallback(baseURL: loopbackURL))
  }

  func test_shouldUseLocalDemoAuthFallback_whenHostIsRemote_returnsFalse() throws {
    let remoteURL = try XCTUnwrap(
      URL(string: "https://us-central1-flux-training.cloudfunctions.net/flux-training")
    )

    XCTAssertFalse(shouldUseLocalDemoAuthFallback(baseURL: remoteURL))
  }
}
