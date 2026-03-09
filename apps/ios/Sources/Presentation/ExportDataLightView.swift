import SwiftUI

@available(iOS 17, macOS 14, *)
public struct ExportDataLightView: View {
  private let viewModel: ExportDataViewModel
  private let userID: String
  private let copy: LocalizedCopy

  public init(
    viewModel: ExportDataViewModel,
    userID: String,
    copy: LocalizedCopy
  ) {
    self.viewModel = viewModel
    self.userID = userID
    self.copy = copy
  }

  public var body: some View {
    ExportDataView(
      viewModel: viewModel,
      userID: userID,
      copy: copy,
      screenAccessibilityID: SettingsRouteContract.exportDataLightScreenID
    )
    .preferredColorScheme(.light)
  }
}
