import Foundation
import XCTest
@testable import FluxTraining

final class FluxTrainingAppConfigurationTests: XCTestCase {
  private func makeSUT(
    processEnvironment: [String: String] = [:],
    currentDirectoryPath: String,
    file: StaticString = #filePath,
    line: UInt = #line
  ) -> FluxTrainingAppConfiguration {
    let sut = FluxTrainingAppConfiguration.makeProduction(
      processEnvironment: processEnvironment,
      currentDirectoryPath: currentDirectoryPath
    )
    trackForMemoryLeaks(file: file, line: line)
    return sut
  }

  func test_makeProduction_readsValuesFromLocalEnvironmentFile() throws {
    let fixture = try EnvironmentFixture()
    trackForMemoryLeaks(fixture)
    try fixture.writeEnvironmentFile(
      """
      FLUX_BACKEND_BASE_URL=https://example.com/flux
      FLUX_FIREBASE_WEB_API_KEY=file-key
      FLUX_IOS_CLIENT_VERSION=9.9.9
      FLUX_DEFAULT_USER_ID=file-user
      """
    )

    let sut = makeSUT(currentDirectoryPath: fixture.repositoryRoot.path)

    XCTAssertEqual(sut.defaultUserID, "file-user")
    XCTAssertEqual(sut.backendConfiguration.baseURL.absoluteString, "https://example.com/flux")
    XCTAssertEqual(sut.backendConfiguration.firebaseWebAPIKey, "file-key")
    XCTAssertEqual(sut.backendConfiguration.clientVersion, "9.9.9")
  }

  func test_makeProduction_prioritizesProcessEnvironmentOverLocalEnvironmentFile() throws {
    let fixture = try EnvironmentFixture()
    trackForMemoryLeaks(fixture)
    try fixture.writeEnvironmentFile(
      """
      FLUX_BACKEND_BASE_URL=https://example.com/file
      FLUX_FIREBASE_WEB_API_KEY=file-key
      FLUX_IOS_CLIENT_VERSION=1.0.0
      FLUX_DEFAULT_USER_ID=file-user
      """
    )

    let sut = makeSUT(
      processEnvironment: [
        "FLUX_BACKEND_BASE_URL": "https://example.com/process",
        "FLUX_FIREBASE_WEB_API_KEY": "process-key",
        "FLUX_IOS_CLIENT_VERSION": "2.0.0",
        "FLUX_DEFAULT_USER_ID": "process-user",
      ],
      currentDirectoryPath: fixture.repositoryRoot.path
    )

    XCTAssertEqual(sut.defaultUserID, "process-user")
    XCTAssertEqual(sut.backendConfiguration.baseURL.absoluteString, "https://example.com/process")
    XCTAssertEqual(sut.backendConfiguration.firebaseWebAPIKey, "process-key")
    XCTAssertEqual(sut.backendConfiguration.clientVersion, "2.0.0")
  }

  func test_merged_returnsCatalogFlagsFromLocalEnvironmentFile() throws {
    let fixture = try EnvironmentFixture()
    trackForMemoryLeaks(fixture)
    try fixture.writeEnvironmentFile(
      """
      FLUX_IOS_ALLOW_CATALOG=1
      FLUX_IOS_QA_UI_ENABLED=1
      """
    )

    let environment = FluxLocalEnvironment.merged(
      processEnvironment: [:],
      currentDirectoryPath: fixture.repositoryRoot.path
    )

    XCTAssertEqual(environment["FLUX_IOS_ALLOW_CATALOG"], "1")
    XCTAssertEqual(environment["FLUX_IOS_QA_UI_ENABLED"], "1")
  }
}

private final class EnvironmentFixture {
  let repositoryRoot: URL
  private let environmentURL: URL

  init() throws {
    repositoryRoot = FileManager.default.temporaryDirectory
      .appendingPathComponent(UUID().uuidString, isDirectory: true)
    environmentURL = repositoryRoot.appendingPathComponent("apps/ios/.env.local")
    try FileManager.default.createDirectory(
      at: environmentURL.deletingLastPathComponent(),
      withIntermediateDirectories: true
    )
  }

  func writeEnvironmentFile(_ contents: String) throws {
    try contents.write(to: environmentURL, atomically: true, encoding: .utf8)
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

  func trackForMemoryLeaks(
    file: StaticString = #filePath,
    line: UInt = #line
  ) {
    _ = (file, line)
  }
}
