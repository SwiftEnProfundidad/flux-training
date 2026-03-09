import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { OfflineSyncPanel } from "./OfflineSyncPanel";

describe("OfflineSyncPanel", () => {
  it("renders sync actions and empty idempotency state", () => {
    const markup = renderToStaticMarkup(
      <OfflineSyncPanel
        screenId="web.offlineSync.screen"
        routeId="web.route.offlineSync"
        statusId="web.offlineSync.status"
        title="Offline + sync"
        status="idle"
        statusLabel="Sync"
        summary="Estado de sincronizacion local."
        syncLabel="Sincronizar cola"
        syncActionId="web.systemStatus.syncQueue"
        onSync={vi.fn()}
        refreshLabel="Refrescar cola"
        refreshActionId="web.offlineSync.refreshQueue"
        onRefresh={vi.fn()}
        pendingActionsLabel="Acciones pendientes"
        pendingActionsValue="0"
        rejectedLastSyncLabel="Rechazadas en ultimo sync"
        rejectedLastSyncValue="0"
        idempotencyKeyLabel="Clave idempotencia"
        idempotencyKeyValue="-"
        idempotencyReplayLabel="Replay idempotente"
        idempotencyReplayValue="-"
        idempotencyTtlLabel="TTL idempotencia"
        idempotencyTtlValue="-"
      />
    );

    expect(markup).toContain("Estado de sincronizacion local.");
    expect(markup).toContain("web.systemStatus.syncQueue");
    expect(markup).toContain("web.offlineSync.refreshQueue");
    expect(markup).toContain("Acciones pendientes");
    expect(markup).toContain("Clave idempotencia");
  });

  it("renders idempotency details and counters", () => {
    const markup = renderToStaticMarkup(
      <OfflineSyncPanel
        screenId="web.offlineSync.screen"
        routeId="web.route.offlineSync"
        statusId="web.offlineSync.status"
        title="Offline + sync"
        status="synced"
        statusLabel="Sync"
        summary="Sincronizacion completada."
        syncLabel="Sincronizar cola"
        syncActionId="web.systemStatus.syncQueue"
        onSync={vi.fn()}
        refreshLabel="Refrescar cola"
        refreshActionId="web.offlineSync.refreshQueue"
        onRefresh={vi.fn()}
        pendingActionsLabel="Acciones pendientes"
        pendingActionsValue="3"
        rejectedLastSyncLabel="Rechazadas en ultimo sync"
        rejectedLastSyncValue="1"
        idempotencyKeyLabel="Clave idempotencia"
        idempotencyKeyValue="sync-123"
        idempotencyReplayLabel="Replay idempotente"
        idempotencyReplayValue="si"
        idempotencyTtlLabel="TTL idempotencia"
        idempotencyTtlValue="120s"
      />
    );

    expect(markup).toContain("Sincronizacion completada.");
    expect(markup).toContain("sync-123");
    expect(markup).toContain("120s");
    expect(markup).toContain(">3<");
    expect(markup).toContain(">1<");
  });
});
