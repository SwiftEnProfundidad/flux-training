import XCTest
@testable import FluxTraining

final class LocalizedCopyTests: XCTestCase {
  func test_spanishIsBaseLanguage() {
    let copy = LocalizedCopy(language: .es)

    XCTAssertEqual(copy.text(.heroTitle), "Entrena con foco y seguimiento real")
    XCTAssertEqual(copy.text(.trainingTitle), "Entrenamiento")
    XCTAssertEqual(copy.humanStatus("signed_out"), "sin sesion")
  }

  func test_englishTranslationsAreAvailable() {
    let copy = LocalizedCopy(language: .en)

    XCTAssertEqual(copy.text(.heroTitle), "Train with focus and real tracking")
    XCTAssertEqual(copy.text(.trainingTitle), "Training")
    XCTAssertEqual(copy.humanStatus("signed_out"), "signed out")
  }
}
