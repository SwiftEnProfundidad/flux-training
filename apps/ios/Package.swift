// swift-tools-version: 6.0
import PackageDescription

let package = Package(
  name: "FluxTraining",
  platforms: [
    .iOS(.v17),
    .macOS(.v14)
  ],
  products: [
    .library(
      name: "FluxTraining",
      targets: ["FluxTraining"]
    )
  ],
  targets: [
    .target(
      name: "FluxTraining",
      path: "Sources"
    ),
    .testTarget(
      name: "FluxTrainingTests",
      dependencies: ["FluxTraining"],
      path: "Tests/FluxTrainingTests"
    )
  ]
)

