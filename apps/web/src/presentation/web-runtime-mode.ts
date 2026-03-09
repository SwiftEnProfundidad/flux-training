function isLocalRuntimeHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

type ReadWebRuntimeModeInput = {
  envMode?: string;
  qaUIEnabled?: string;
  pathname: string;
  search: string;
  hostname: string;
  storage: Pick<Storage, "getItem" | "setItem" | "removeItem">;
};

export function readWebRuntimeMode(input: ReadWebRuntimeModeInput): "qa" | "product" {
  const params = new URLSearchParams(input.search);
  const qaUnlockStorageKey = "flux.web.qa.unlock";
  const unlockParam = params.get("unlockQa");
  if (unlockParam === "1") {
    input.storage.setItem(qaUnlockStorageKey, "1");
  } else if (unlockParam === "0") {
    input.storage.removeItem(qaUnlockStorageKey);
  }

  const isQaRoute = input.pathname.startsWith("/__qa");
  const isQaUnlocked = input.storage.getItem(qaUnlockStorageKey) === "1";
  const qaRequested = params.get("qa") === "1";
  const localQaFallback =
    isLocalRuntimeHost(input.hostname) && isQaRoute && isQaUnlocked && qaRequested;

  const rawValue = String(input.envMode ?? "product").trim().toLowerCase();
  const qaUIEnabled = String(input.qaUIEnabled ?? "0").trim() === "1";
  if (rawValue === "qa" && qaUIEnabled) {
    return localQaFallback || (isQaRoute && isQaUnlocked && qaRequested) ? "qa" : "product";
  }

  return localQaFallback ? "qa" : "product";
}
