import Foundation

private struct ListRoleCapabilitiesResponse: Decodable {
  struct Capabilities: Decodable {
    let role: String
    let allowedDomains: [String]
  }

  let capabilities: Capabilities
}

public actor RemoteRoleCapabilitiesGateway {
  private let client: FluxBackendClient

  public init(client: FluxBackendClient) {
    self.client = client
  }

  public func listAllowedDomainRawValues(roleRawValue: String) async throws -> Set<String> {
    let response: ListRoleCapabilitiesResponse = try await client.get(
      path: "listRoleCapabilities",
      queryItems: [URLQueryItem(name: "role", value: roleRawValue)],
      requiresAuthorization: true
    )
    return Set(response.capabilities.allowedDomains)
  }
}
