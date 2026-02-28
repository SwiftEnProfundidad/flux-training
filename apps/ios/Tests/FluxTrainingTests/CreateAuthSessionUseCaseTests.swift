import XCTest
@testable import FluxTraining

final class CreateAuthSessionUseCaseTests: XCTestCase {
  func test_execute_withApple_returnsAppleSession() async throws {
    let useCase = CreateAuthSessionUseCase(authGateway: DemoAuthGateway())

    let session = try await useCase.execute(method: .apple)

    XCTAssertEqual(session.identity.provider, .apple)
    XCTAssertEqual(session.userID, "apple-demo-user")
  }

  func test_execute_withEmail_returnsEmailSession() async throws {
    let useCase = CreateAuthSessionUseCase(authGateway: DemoAuthGateway())

    let session = try await useCase.execute(method: .email(email: "u@e.com", password: "123456"))

    XCTAssertEqual(session.identity.provider, .email)
    XCTAssertEqual(session.userID, "u@e.com")
  }
}

