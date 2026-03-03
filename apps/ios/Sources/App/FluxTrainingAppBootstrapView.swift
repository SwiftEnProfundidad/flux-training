import SwiftUI

@available(iOS 17, macOS 14, *)
public struct FluxTrainingAppBootstrapView: View {
  private let configuration: FluxTrainingAppConfiguration

  public init(
    configuration: FluxTrainingAppConfiguration = .production
  ) {
    self.configuration = configuration
  }

  public var body: some View {
    ExperienceHubView.makeProduction(configuration: configuration)
  }
}
