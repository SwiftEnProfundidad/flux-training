import XCTest
@testable import FluxTraining

@MainActor
final class AuthViewModelTests: XCTestCase {
  func test_signInWithApple_setsSignedInState() async {
    let useCase = CreateAuthSessionUseCase(authGateway: DemoAuthGateway())
    let viewModel = AuthViewModel(createAuthSessionUseCase: useCase)

    await viewModel.signInWithApple()

    XCTAssertEqual(viewModel.authStatus, "signed_in:apple")
  }

  func test_signInWithEmail_setsSignedInState() async {
    let useCase = CreateAuthSessionUseCase(authGateway: DemoAuthGateway())
    let viewModel = AuthViewModel(createAuthSessionUseCase: useCase)

    await viewModel.signInWithEmail(email: "user@example.com", password: "123456")

    XCTAssertEqual(viewModel.authStatus, "signed_in:email")
  }
}
