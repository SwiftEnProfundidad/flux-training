import Foundation

public actor FluxSessionStore {
  private var currentSession: AuthSession?

  public init() {}

  public func save(session: AuthSession) {
    currentSession = session
  }

  public func clear() {
    currentSession = nil
  }

  public func currentToken() -> String? {
    currentSession?.token
  }

  public func currentUserID() -> String? {
    currentSession?.userID
  }
}
