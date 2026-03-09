import FluxTraining
import SwiftUI

@main
struct FluxTrainingHostApp: App {
  var body: some Scene {
    WindowGroup {
      if #available(iOS 17.0, *) {
        FluxTrainingAppBootstrapView()
      } else {
        Text("Flux Training requires iOS 17 or newer")
      }
    }
  }
}
