import SwiftUI

@available(iOS 17, macOS 14, *)
public struct ObservabilityView: View {
  @State private var viewModel: ObservabilityViewModel
  private let userID: String
  private let copy: LocalizedCopy

  public init(
    viewModel: ObservabilityViewModel,
    userID: String = "demo-user",
    copy: LocalizedCopy = LocalizedCopy(language: .es)
  ) {
    _viewModel = State(initialValue: viewModel)
    self.userID = userID
    self.copy = copy
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      Text(copy.text(.observabilityTitle))
        .font(.title2)

      HStack {
        Button(copy.text(.trackEvent)) {
          Task { await viewModel.trackDemoEvent(userID: userID) }
        }
        Button(copy.text(.reportCrash)) {
          Task { await viewModel.reportDemoCrash(userID: userID) }
        }
        Button(copy.text(.loadData)) {
          Task { await viewModel.refresh(userID: userID) }
        }
      }

      Text("\(copy.text(.statusLabel)): \(copy.humanStatus(viewModel.status))")
        .foregroundStyle(.secondary)
      Text("\(copy.text(.analyticsEventsLabel)): \(viewModel.analyticsEvents.count)")
      Text("\(copy.text(.crashReportsLabel)): \(viewModel.crashReports.count)")
      Text("\(copy.text(.supportIncidentsLabel)): \(viewModel.supportIncidents.count)")

      if viewModel.supportIncidents.isEmpty {
        Text(copy.text(.noSupportIncidents))
          .foregroundStyle(.secondary)
      } else {
        LazyVStack(alignment: .leading, spacing: 8) {
          ForEach(viewModel.supportIncidents) { incident in
            VStack(alignment: .leading, spacing: 4) {
              Text(incident.id)
                .font(.footnote.bold())
              Text(
                "\(copy.text(.incidentDomainLabel)): \(incident.domain)"
              )
              .font(.caption)
              .foregroundStyle(.secondary)
              Text(
                "\(copy.text(.incidentSeverityLabel)): \(copy.humanStatus(incident.severity.rawValue))"
              )
              .font(.caption)
              .foregroundStyle(.secondary)
              Text(
                "\(copy.text(.incidentStateLabel)): \(copy.humanStatus(incident.state.rawValue))"
              )
              .font(.caption)
              .foregroundStyle(.secondary)
              Text(
                "\(copy.text(.incidentCorrelationLabel)): \(incident.correlationID)"
              )
              .font(.caption)
              .foregroundStyle(.secondary)
              Text(
                "\(copy.text(.incidentSummaryLabel)): \(incident.summary)"
              )
              .font(.caption)
              .foregroundStyle(.secondary)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(10)
            .background(.ultraThinMaterial)
            .clipShape(.rect(cornerRadius: 10))
          }
        }
      }
    }
    .padding()
  }
}
