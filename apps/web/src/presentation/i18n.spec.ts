import { describe, expect, it } from "vitest";
import { createTranslator, humanizeStatus, resolveLanguage } from "./i18n";

describe("i18n", () => {
  it("uses spanish as base language", () => {
    const translate = createTranslator("es");
    expect(translate("heroTitle")).toBe("Entrena con foco y seguimiento real");
    expect(translate("trainingSectionTitle")).toBe("Entrenamiento");
  });

  it("supports english language", () => {
    const translate = createTranslator("en");
    expect(translate("heroTitle")).toBe("Train with focus and real tracking");
    expect(translate("trainingSectionTitle")).toBe("Training");
  });

  it("resolves preferred language from locale", () => {
    expect(resolveLanguage("es-ES")).toBe("es");
    expect(resolveLanguage("en-GB")).toBe("en");
    expect(resolveLanguage("fr-FR")).toBe("es");
  });

  it("humanizes statuses in both languages", () => {
    expect(humanizeStatus("signed_out", "es")).toBe("sin sesion");
    expect(humanizeStatus("signed_out", "en")).toBe("signed out");
    expect(humanizeStatus("upgrade_required", "es")).toBe("actualizacion requerida");
    expect(humanizeStatus("upgrade_required", "en")).toBe("upgrade required");
  });
});
