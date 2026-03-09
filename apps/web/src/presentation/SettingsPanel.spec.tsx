import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { SettingsPanel } from "./SettingsPanel";

describe("SettingsPanel", () => {
  it("renders settings toggles and save action", () => {
    const markup = renderToStaticMarkup(
      <SettingsPanel
        screenId="web.settings.screen"
        routeId="web.route.settings"
        statusId="web.settings.status"
        title="Ajustes"
        status="inactivo"
        statusLabel="Ajustes"
        notificationsEnabled={true}
        onNotificationsChange={vi.fn()}
        notificationsLabel="Notificaciones activas"
        watchSyncEnabled={true}
        onWatchSyncChange={vi.fn()}
        watchSyncLabel="Sincronizar Apple Watch"
        calendarSyncEnabled={false}
        onCalendarSyncChange={vi.fn()}
        calendarSyncLabel="Sincronizar calendario"
        saveLabel="Guardar ajustes"
        saveActionId="web.settings.save"
        onSave={vi.fn()}
      />
    );

    expect(markup).toContain("Ajustes");
    expect(markup).toContain("Notificaciones activas");
    expect(markup).toContain("Sincronizar Apple Watch");
    expect(markup).toContain("Sincronizar calendario");
    expect(markup).toContain("web.settings.save");
  });

  it("renders saved state copy in header", () => {
    const markup = renderToStaticMarkup(
      <SettingsPanel
        screenId="web.settings.screen"
        routeId="web.route.settings"
        statusId="web.settings.status"
        title="Ajustes"
        status="guardado"
        statusLabel="Ajustes"
        notificationsEnabled={false}
        onNotificationsChange={vi.fn()}
        notificationsLabel="Notificaciones activas"
        watchSyncEnabled={false}
        onWatchSyncChange={vi.fn()}
        watchSyncLabel="Sincronizar Apple Watch"
        calendarSyncEnabled={true}
        onCalendarSyncChange={vi.fn()}
        calendarSyncLabel="Sincronizar calendario"
        saveLabel="Guardar ajustes"
        saveActionId="web.settings.save"
        onSave={vi.fn()}
      />
    );

    expect(markup).toContain("guardado");
    expect(markup).toContain("checked");
  });
});
