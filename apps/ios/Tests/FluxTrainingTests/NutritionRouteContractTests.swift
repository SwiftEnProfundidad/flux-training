import XCTest
@testable import FluxTraining

final class NutritionRouteContractTests: XCTestCase {
  func test_routeIdentifiers_matchCanonicalValues() {
    XCTAssertEqual(NutritionRouteContract.nutritionHubDarkRouteID, "nutrition.route.hub")
    XCTAssertEqual(NutritionRouteContract.logMealDarkRouteID, "nutrition.route.logMeal")
    XCTAssertEqual(NutritionRouteContract.nutritionHubLightRouteID, "nutrition.route.hubLight")
    XCTAssertEqual(NutritionRouteContract.logMealLightRouteID, "nutrition.route.logMealLight")
    XCTAssertEqual(NutritionRouteContract.nutritionHubRouteID, "nutrition.route.hub")
    XCTAssertEqual(NutritionRouteContract.logMealRouteID, "nutrition.route.logMeal")
  }

  func test_screenIdentifiers_matchCanonicalValues() {
    XCTAssertEqual(NutritionRouteContract.nutritionHubDarkScreenID, "nutrition.hub.screen")
    XCTAssertEqual(NutritionRouteContract.logMealDarkScreenID, "nutrition.logMeal.screen")
    XCTAssertEqual(NutritionRouteContract.nutritionHubLightScreenID, "nutrition.hub.light.screen")
    XCTAssertEqual(NutritionRouteContract.logMealLightScreenID, "nutrition.logMeal.light.screen")
    XCTAssertEqual(NutritionRouteContract.nutritionHubScreenID, "nutrition.hub.screen")
    XCTAssertEqual(NutritionRouteContract.logMealScreenID, "nutrition.logMeal.screen")
  }
}
