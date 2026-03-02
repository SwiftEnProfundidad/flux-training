import Foundation

public enum ExperienceDomain: String, CaseIterable, Sendable {
  case all
  case onboarding
  case training
  case nutrition
  case progress
  case operations
}

public enum ExperienceModule: String, CaseIterable, Sendable {
  case readiness
  case auth
  case onboarding
  case training
  case nutrition
  case progress
  case settings
  case legal
  case offlineSync
  case observability
  case recommendations

  public var domain: ExperienceDomain {
    switch self {
    case .readiness, .auth, .onboarding:
      return .onboarding
    case .training:
      return .training
    case .nutrition:
      return .nutrition
    case .progress:
      return .progress
    case .settings, .legal, .offlineSync, .observability, .recommendations:
      return .operations
    }
  }
}

public enum ExperienceRole: String, CaseIterable, Sendable {
  case athlete
  case coach
  case admin
}

public struct ExperienceSectionShell: Sendable, Equatable {
  public private(set) var activeDomain: ExperienceDomain

  public init(activeDomain: ExperienceDomain = .all) {
    self.activeDomain = activeDomain
  }

  public init(persistedDomainRawValue: String?) {
    if let persistedDomainRawValue, let domain = ExperienceDomain(rawValue: persistedDomainRawValue) {
      activeDomain = domain
    } else {
      activeDomain = .all
    }
  }

  public mutating func select(domain: ExperienceDomain) {
    activeDomain = domain
  }

  public func isModuleVisible(_ module: ExperienceModule) -> Bool {
    activeDomain == .all || module.domain == activeDomain
  }

  public func visibleModules(from modules: [ExperienceModule] = ExperienceModule.allCases) -> [ExperienceModule] {
    modules.filter { isModuleVisible($0) }
  }
}
