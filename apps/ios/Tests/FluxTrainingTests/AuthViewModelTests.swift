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

  func test_signInWithEmail_withInvalidPayload_setsValidationError() async {
    let useCase = CreateAuthSessionUseCase(authGateway: DemoAuthGateway())
    let viewModel = AuthViewModel(createAuthSessionUseCase: useCase)

    await viewModel.signInWithEmail(email: "invalid-email", password: "123")

    XCTAssertEqual(viewModel.authStatus, "validation_error")
  }

  func test_requestRecovery_withValidEmail_setsRecoveryStatus() {
    let useCase = CreateAuthSessionUseCase(authGateway: DemoAuthGateway())
    let viewModel = AuthViewModel(createAuthSessionUseCase: useCase)

    viewModel.requestRecovery(email: "user@example.com", channel: .email)
    XCTAssertEqual(viewModel.authStatus, "recovery_sent_email")

    viewModel.requestRecovery(email: "user@example.com", channel: .sms)
    XCTAssertEqual(viewModel.authStatus, "recovery_sent_sms")
  }

  func test_requestRecovery_withInvalidEmail_setsValidationError() {
    let useCase = CreateAuthSessionUseCase(authGateway: DemoAuthGateway())
    let viewModel = AuthViewModel(createAuthSessionUseCase: useCase)

    viewModel.requestRecovery(email: "bad-email", channel: .email)

    XCTAssertEqual(viewModel.authStatus, "validation_error")
  }
}
