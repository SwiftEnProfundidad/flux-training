import Observation
import SwiftUI

@available(iOS 17, macOS 14, *)
public struct ExportDataView: View {
  @Bindable private var viewModel: ExportDataViewModel
  private let userID: String
  private let copy: LocalizedCopy
  private let screenAccessibilityID: String

  public init(
    viewModel: ExportDataViewModel,
    userID: String,
    copy: LocalizedCopy,
    screenAccessibilityID: String = SettingsRouteContract.exportDataDarkScreenID
  ) {
    self.viewModel = viewModel
    self.userID = userID
    self.copy = copy
    self.screenAccessibilityID = screenAccessibilityID
  }

  public var body: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: 14) {
        Text(copy.text(.exportDataTitle))
          .font(.system(size: 32, weight: .black, design: .rounded))
          .foregroundStyle(.white)

        Text(copy.text(.exportStatusLabel))
          .font(.subheadline.weight(.medium))
          .foregroundStyle(.white.opacity(0.74))

        FluxCard {
          VStack(alignment: .leading, spacing: 10) {
            metricRow(copy.text(.exportGeneratedAtLabel), viewModel.generatedAtISO8601)
              .accessibilityIdentifier("export.generatedAt")
            metricRow(copy.text(.exportPayloadBytesLabel), "\(viewModel.payloadBytes)")
              .accessibilityIdentifier("export.payloadBytes")
          }
        }

        Button(copy.text(.exportData)) {
          Task { await viewModel.export(userID: userID) }
        }
        .buttonStyle(FluxPrimaryButtonStyle())
        .accessibilityIdentifier("export.action")

        FluxCard {
          Text("\(copy.text(.exportStatusLabel)): \(copy.humanStatus(viewModel.status))")
            .font(.footnote.weight(.semibold))
            .foregroundStyle(.white.opacity(0.82))
            .accessibilityIdentifier("export.status")
        }

        FluxCard {
          VStack(alignment: .leading, spacing: 10) {
            Text(copy.text(.exportPayloadPreviewLabel))
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.white.opacity(0.82))
            if viewModel.payloadPreview.isEmpty {
              Text(copy.text(.exportNoPayloadPreview))
                .font(.footnote)
                .foregroundStyle(.white.opacity(0.7))
                .accessibilityIdentifier("export.preview.empty")
            } else {
              ScrollView(.horizontal) {
                Text(viewModel.payloadPreview)
                  .font(.system(.footnote, design: .monospaced))
                  .foregroundStyle(.white.opacity(0.88))
                  .textSelection(.enabled)
                  .accessibilityIdentifier("export.preview.value")
              }
            }
          }
        }
      }
    }
    .padding(16)
    .navigationTitle(copy.text(.exportDataTitle))
    .fluxScreenStyle()
    .accessibilityIdentifier(screenAccessibilityID)
    .task(id: userID) {
      await viewModel.refresh(userID: userID)
    }
  }

  @ViewBuilder
  private func metricRow(_ title: String, _ value: String) -> some View {
    HStack(alignment: .firstTextBaseline) {
      Text(title)
        .foregroundStyle(.white.opacity(0.7))
      Spacer(minLength: 12)
      Text(value)
        .font(.body.weight(.semibold))
        .foregroundStyle(.white)
    }
  }
}
