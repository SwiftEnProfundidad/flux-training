import { describe, expect, it } from "vitest";
import { readWebRuntimeMode } from "./web-runtime-mode";

function createMemoryStorage(initial: Record<string, string> = {}) {
  const memory = new Map(Object.entries(initial));
  return {
    getItem(key: string) {
      return memory.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      memory.set(key, value);
    },
    removeItem(key: string) {
      memory.delete(key);
    }
  };
}

describe("readWebRuntimeMode", () => {
  it("returns qa when env flags are enabled and route is unlocked", () => {
    const storage = createMemoryStorage();
    const mode = readWebRuntimeMode({
      envMode: "qa",
      qaUIEnabled: "1",
      pathname: "/__qa",
      search: "?unlockQa=1&qa=1",
      hostname: "localhost",
      storage
    });

    expect(mode).toBe("qa");
  });

  it("falls back to local qa on localhost when route is explicitly unlocked", () => {
    const storage = createMemoryStorage();
    const mode = readWebRuntimeMode({
      envMode: "product",
      qaUIEnabled: "0",
      pathname: "/__qa",
      search: "?unlockQa=1&qa=1",
      hostname: "127.0.0.1",
      storage
    });

    expect(mode).toBe("qa");
  });

  it("keeps product mode on non-local hosts without qa env", () => {
    const storage = createMemoryStorage();
    const mode = readWebRuntimeMode({
      envMode: "product",
      qaUIEnabled: "0",
      pathname: "/__qa",
      search: "?unlockQa=1&qa=1",
      hostname: "flux.app",
      storage
    });

    expect(mode).toBe("product");
  });
});
