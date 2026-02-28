import Foundation

public enum UXReadinessLabel: String, Sendable, Equatable {
  case readyToTrain = "ready_to_train"
  case warmingUp = "warming_up"
  case needsSetup = "needs_setup"
}

public enum UXReadinessTone: String, Sendable, Equatable {
  case positive
  case warning
  case critical
}

public struct UXReadinessSnapshot: Sendable, Equatable {
  public let score: Int
  public let label: UXReadinessLabel
  public let tone: UXReadinessTone

  public init(score: Int, label: UXReadinessLabel, tone: UXReadinessTone) {
    self.score = score
    self.label = label
    self.tone = tone
  }
}

public enum UXReadinessBuilder {
  public static func make(
    authStatus: String,
    onboardingStatus: String,
    trainingStatus: String,
    nutritionStatus: String,
    progressStatus: String,
    syncStatus: String,
    observabilityStatus: String,
    pendingQueueCount: Int
  ) -> UXReadinessSnapshot {
    var score = 0

    if authStatus.hasPrefix("signed_in") {
      score += 20
    }
    if onboardingStatus == "saved" {
      score += 15
    }
    if status(trainingStatus, containsAny: ["saved", "loaded"]) {
      score += 15
    }
    if status(nutritionStatus, containsAny: ["saved", "loaded"]) {
      score += 10
    }
    if progressStatus == "loaded" {
      score += 10
    }
    if syncStatus == "synced" {
      score += 10
    }
    if status(observabilityStatus, containsAny: ["loaded", "event_saved", "crash_saved"]) {
      score += 10
    }

    let queueScore = max(0, 10 - pendingQueueCount * 4)
    score += queueScore
    score = min(100, max(0, score))

    if score >= 85 {
      return UXReadinessSnapshot(score: score, label: .readyToTrain, tone: .positive)
    }
    if score >= 55 {
      return UXReadinessSnapshot(score: score, label: .warmingUp, tone: .warning)
    }
    return UXReadinessSnapshot(score: score, label: .needsSetup, tone: .warning)
  }

  private static func status(_ value: String, containsAny expectedValues: [String]) -> Bool {
    for expectedValue in expectedValues where value.contains(expectedValue) {
      return true
    }
    return false
  }
}
