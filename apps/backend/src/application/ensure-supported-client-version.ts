export class ClientUpdateRequiredError extends Error {
  readonly code = "client_update_required";

  constructor(
    readonly platform: "web" | "ios",
    readonly minimumVersion: string,
    readonly clientVersion: string
  ) {
    super("client_update_required");
  }
}

type SupportedPlatform = "web" | "ios";

type EnsureSupportedClientVersionInput = {
  platform: string;
  clientVersion: string;
};

type EnsureSupportedClientVersionConfig = {
  webMinimumVersion: string;
  iosMinimumVersion: string;
};

function normalizeSemanticVersion(version: string): [number, number, number] | null {
  const cleanedVersion = version.trim();
  if (cleanedVersion.length === 0) {
    return null;
  }

  const rawParts = cleanedVersion.split(".");
  if (rawParts.length > 3) {
    return null;
  }

  const normalizedParts = [0, 0, 0] satisfies [number, number, number];
  for (const [index, rawPart] of rawParts.entries()) {
    if (/^\d+$/.test(rawPart) === false) {
      return null;
    }
    normalizedParts[index] = Number(rawPart);
  }

  return normalizedParts;
}

function compareSemanticVersions(left: string, right: string): number | null {
  const leftVersion = normalizeSemanticVersion(left);
  const rightVersion = normalizeSemanticVersion(right);
  if (leftVersion === null || rightVersion === null) {
    return null;
  }

  for (const index of [0, 1, 2] as const) {
    const leftPart = leftVersion[index];
    const rightPart = rightVersion[index];
    if (leftPart > rightPart) {
      return 1;
    }
    if (leftPart < rightPart) {
      return -1;
    }
  }

  return 0;
}

export class EnsureSupportedClientVersionUseCase {
  private readonly minimumVersionByPlatform: Record<SupportedPlatform, string>;

  constructor(config: EnsureSupportedClientVersionConfig) {
    this.minimumVersionByPlatform = {
      web: config.webMinimumVersion,
      ios: config.iosMinimumVersion
    };
  }

  execute(input: EnsureSupportedClientVersionInput): void {
    const normalizedPlatform = input.platform.trim().toLowerCase();
    if (normalizedPlatform !== "web" && normalizedPlatform !== "ios") {
      return;
    }

    const minimumVersion = this.minimumVersionByPlatform[normalizedPlatform];
    const comparison = compareSemanticVersions(input.clientVersion, minimumVersion);
    if (comparison !== null && comparison >= 0) {
      return;
    }

    throw new ClientUpdateRequiredError(
      normalizedPlatform,
      minimumVersion,
      input.clientVersion
    );
  }
}
