import XCTest
@testable import FluxTraining

final class EvaluateParQUseCaseTests: XCTestCase {
  func test_execute_returnsLowRiskWhenAllAnswersAreFalse() throws {
    let useCase = EvaluateParQUseCase()

    let screening = try useCase.execute(
      userID: "user-1",
      responses: [
        ParQResponse(questionID: "parq-1", answer: false),
        ParQResponse(questionID: "parq-2", answer: false)
      ]
    )

    XCTAssertEqual(screening.risk, .low)
  }

  func test_execute_returnsModerateRiskWhenAnyAnswerIsTrue() throws {
    let useCase = EvaluateParQUseCase()

    let screening = try useCase.execute(
      userID: "user-1",
      responses: [
        ParQResponse(questionID: "parq-1", answer: false),
        ParQResponse(questionID: "parq-2", answer: true)
      ]
    )

    XCTAssertEqual(screening.risk, .moderate)
  }
}

