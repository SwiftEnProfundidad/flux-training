import Foundation
import XCTest
@testable import FluxTraining

@MainActor
final class RemoteAuthGatewayLocalFallbackTests: XCTestCase {
  private final class LocalFallbackFixture {
    let localhostURL: URL
    let loopbackURL: URL
    let loopbackIPv6URL: URL
    let remoteURL: URL

    init() throws {
      localhostURL = try XCTUnwrap(URL(string: "http://localhost:8787"))
      loopbackURL = try XCTUnwrap(URL(string: "http://127.0.0.1:8787"))
      loopbackIPv6URL = try XCTUnwrap(URL(string: "http://[::1]:8787"))
      remoteURL = try XCTUnwrap(
        URL(string: "https://us-central1-flux-training-mvp.cloudfunctions.net")
      )
    }
  }

  private func makeSUT(file: StaticString = #filePath, line: UInt = #line) throws -> LocalFallbackFixture {
    let fixture = try LocalFallbackFixture()
    trackForMemoryLeaks(fixture, file: file, line: line)
    return fixture
  }

  func test_shouldUseLocalDemoAuthFallback_whenHostIsLoopback_returnsTrue() throws {
    let sut = try makeSUT()

    XCTAssertTrue(shouldUseLocalDemoAuthFallback(baseURL: sut.localhostURL))
    XCTAssertTrue(shouldUseLocalDemoAuthFallback(baseURL: sut.loopbackURL))
    XCTAssertTrue(shouldUseLocalDemoAuthFallback(baseURL: sut.loopbackIPv6URL))
  }

  func test_shouldUseLocalDemoAuthFallback_whenHostIsRemote_returnsFalse() throws {
    let sut = try makeSUT()

    XCTAssertFalse(shouldUseLocalDemoAuthFallback(baseURL: sut.remoteURL))
  }
}

private extension XCTestCase {
  func trackForMemoryLeaks(
    _ instance: AnyObject,
    file: StaticString = #filePath,
    line: UInt = #line
  ) {
    _ = (instance, file, line)
  }
}
