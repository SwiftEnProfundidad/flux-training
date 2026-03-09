import Foundation

public enum EnterpriseRuntimeState: String, CaseIterable, Sendable {
  case success
  case loading
  case empty
  case error
  case offline
  case denied
}

public struct ExperienceDomainRuntimeStateStore: Sendable, Equatable {
  private(set) var states: [ExperienceDomain: EnterpriseRuntimeState]

  public init(states: [ExperienceDomain: EnterpriseRuntimeState] = [:]) {
    self.states = states
    for domain in ExperienceDomain.allCases where domain != .all {
      if self.states[domain] == nil {
        self.states[domain] = .success
      }
    }
  }

  public mutating func set(state: EnterpriseRuntimeState, for domain: ExperienceDomain) {
    guard domain != .all else {
      return
    }
    states[domain] = state
  }

  public mutating func reset(for domain: ExperienceDomain) {
    set(state: .success, for: domain)
  }

  public func state(for domain: ExperienceDomain) -> EnterpriseRuntimeState {
    if domain == .all {
      return .success
    }
    return states[domain] ?? .success
  }
}
