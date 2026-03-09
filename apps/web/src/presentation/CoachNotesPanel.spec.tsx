import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { CoachNotesPanel } from "./CoachNotesPanel";

describe("CoachNotesPanel", () => {
  it("renders empty state and actions when no athlete is selected", () => {
    const markup = renderToStaticMarkup(
      <CoachNotesPanel
        screenId="web.coachNotes.screen"
        routeId="web.route.coachNotes"
        statusId="web.coachNotes.status"
        title="Notas de coach"
        loadNotesLabel="Cargar notas"
        loadNotesActionId="web.coachNotes.loadNotes"
        onLoadNotes={vi.fn()}
        saveFollowUpLabel="Guardar seguimiento"
        saveFollowUpActionId="web.coachNotes.saveFollowUp"
        onSaveFollowUp={vi.fn()}
        clearSelectionLabel="Limpiar seleccion"
        clearSelectionActionId="web.coachNotes.clearSelection"
        onClearSelection={vi.fn()}
        hasSelection={false}
        hasRows={false}
        emptyLabel="Selecciona un atleta"
        noRowsLabel="No hay notas"
        occurredAtLabel="fecha"
        sourceLabel="origen"
        outcomeLabel="resultado"
        summaryLabel="resumen"
        rows={[]}
      />
    );

    expect(markup).toContain("Notas de coach");
    expect(markup).toContain("Selecciona un atleta");
    expect(markup).toContain("web.coachNotes.loadNotes");
    expect(markup).toContain("web.coachNotes.saveFollowUp");
    expect(markup).toContain("web.coachNotes.clearSelection");
  });

  it("renders note rows when athlete has follow-up notes", () => {
    const markup = renderToStaticMarkup(
      <CoachNotesPanel
        screenId="web.coachNotes.screen"
        routeId="web.route.coachNotes"
        statusId="web.coachNotes.status"
        title="Notas de coach"
        loadNotesLabel="Cargar notas"
        loadNotesActionId="web.coachNotes.loadNotes"
        onLoadNotes={vi.fn()}
        saveFollowUpLabel="Guardar seguimiento"
        saveFollowUpActionId="web.coachNotes.saveFollowUp"
        onSaveFollowUp={vi.fn()}
        clearSelectionLabel="Limpiar seleccion"
        clearSelectionActionId="web.coachNotes.clearSelection"
        onClearSelection={vi.fn()}
        hasSelection={true}
        hasRows={true}
        emptyLabel="Selecciona un atleta"
        noRowsLabel="No hay notas"
        occurredAtLabel="fecha"
        sourceLabel="origen"
        outcomeLabel="resultado"
        summaryLabel="resumen"
        rows={[
          {
            id: "note-1",
            occurredAt: "2026-03-06 18:00",
            source: "coach",
            outcome: "seguimiento",
            summary: "ajustar volumen"
          }
        ]}
      />
    );

    expect(markup).toContain("2026-03-06 18:00");
    expect(markup).toContain("origen coach");
    expect(markup).toContain("resultado seguimiento");
    expect(markup).toContain("resumen ajustar volumen");
  });
});
