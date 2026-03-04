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

  func test_signInWithApple_whenGatewayIsOffline_setsOfflineStatus() async {
    let useCase = CreateAuthSessionUseCase(
      authGateway: FailingAuthGateway(error: URLError(.notConnectedToInternet))
    )
    let viewModel = AuthViewModel(createAuthSessionUseCase: useCase)

    await viewModel.signInWithApple()

    XCTAssertEqual(viewModel.authStatus, "offline")
  }

  func test_signInWithEmail_whenGatewayIsDenied_setsDeniedStatus() async {
    let useCase = CreateAuthSessionUseCase(
      authGateway: FailingAuthGateway(error: FluxBackendClientError.backend(code: "permission_denied"))
    )
    let viewModel = AuthViewModel(createAuthSessionUseCase: useCase)

    await viewModel.signInWithEmail(email: "user@example.com", password: "123456")

    XCTAssertEqual(viewModel.authStatus, "denied")
  }

  func test_verifyOTP_withValidCode_setsSuccessStatus() {
    let useCase = CreateAuthSessionUseCase(authGateway: DemoAuthGateway())
    let viewModel = AuthViewModel(createAuthSessionUseCase: useCase)

    viewModel.verifyOTP(code: "123456")

    XCTAssertEqual(viewModel.authStatus, "success")
  }

  func test_verifyOTP_withInvalidCode_setsValidationError() {
    let useCase = CreateAuthSessionUseCase(authGateway: DemoAuthGateway())
    let viewModel = AuthViewModel(createAuthSessionUseCase: useCase)

    viewModel.verifyOTP(code: "12A")

    XCTAssertEqual(viewModel.authStatus, "validation_error")
  }

  func test_resendOTP_setsRecoverySentSMSStatus() {
    let useCase = CreateAuthSessionUseCase(authGateway: DemoAuthGateway())
    let viewModel = AuthViewModel(createAuthSessionUseCase: useCase)

    viewModel.resendOTP()

    XCTAssertEqual(viewModel.authStatus, "recovery_sent_sms")
  }

  func test_markSessionExpired_setsSessionExpiredStatus_andClearsSession() async {
    let useCase = CreateAuthSessionUseCase(authGateway: DemoAuthGateway())
    let viewModel = AuthViewModel(createAuthSessionUseCase: useCase)
    await viewModel.signInWithApple()

    viewModel.markSessionExpired()

    XCTAssertEqual(viewModel.authStatus, "session_expired")
    XCTAssertNil(viewModel.currentUserID)
  }

  func test_backToSignInAfterSessionExpired_setsSignedOut_andClearsSession() async {
    let useCase = CreateAuthSessionUseCase(authGateway: DemoAuthGateway())
    let viewModel = AuthViewModel(createAuthSessionUseCase: useCase)
    await viewModel.signInWithApple()
    viewModel.markSessionExpired()

    viewModel.backToSignInAfterSessionExpired()

    XCTAssertEqual(viewModel.authStatus, "signed_out")
    XCTAssertNil(viewModel.currentUserID)
  }

  func test_openOfflineModeAfterSessionExpired_setsOffline_andClearsSession() async {
    let useCase = CreateAuthSessionUseCase(authGateway: DemoAuthGateway())
    let viewModel = AuthViewModel(createAuthSessionUseCase: useCase)
    await viewModel.signInWithApple()
    viewModel.markSessionExpired()

    viewModel.openOfflineModeAfterSessionExpired()

    XCTAssertEqual(viewModel.authStatus, "offline")
    XCTAssertNil(viewModel.currentUserID)
  }

  func test_openSupportTicket_setsOpenStatus() {
    let useCase = CreateAuthSessionUseCase(authGateway: DemoAuthGateway())
    let viewModel = AuthViewModel(createAuthSessionUseCase: useCase)

    viewModel.openSupportTicket()

    XCTAssertEqual(viewModel.authStatus, "open")
  }
}

private struct FailingAuthGateway: AuthGateway {
  let error: Error

  func createSessionWithApple() async throws -> AuthSession {
    throw error
  }

  func createSessionWithEmail(email: String, password: String) async throws -> AuthSession {
    throw error
  }
}
