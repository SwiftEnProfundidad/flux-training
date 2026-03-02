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
    expect(translate("domainFilterLabel")).toBe("Domain");
    expect(translate("roleLabel")).toBe("Role");
    expect(translate("roleAthlete")).toBe("Athlete");
    expect(translate("roleCoach")).toBe("Coach");
    expect(translate("roleAdmin")).toBe("Admin");
    expect(translate("recoverByEmail")).toBe("Recover by email");
    expect(translate("recoverBySMS")).toBe("Recover by SMS");
    expect(translate("retryRoleCapabilities")).toBe("Retry capabilities");
    expect(translate("domainOperations")).toBe("Operations");
    expect(translate("settingsTitle")).toBe("Settings");
    expect(translate("legalSectionTitle")).toBe("Privacy and consent");
    expect(translate("goalPickerLabel")).toBe("goal");
    expect(translate("exercisePickerLabel")).toBe("exercise");
    expect(translate("videoLocalePickerLabel")).toBe("video language");
    expect(translate("runtimeStateSectionTitle")).toBe("Enterprise runtime state by domain");
    expect(translate("runtimeStateModeLabel")).toBe("Runtime mode");
    expect(translate("runtimeStateRecoveryAction")).toBe("Recover domain");
    expect(translate("noModulesForSelectedDomain")).toBe(
      "No modules are available for the selected domain."
    );
  });

  it("exposes domain filter translations in spanish", () => {
    const translate = createTranslator("es");
    expect(translate("domainFilterLabel")).toBe("Dominio");
    expect(translate("roleLabel")).toBe("Rol");
    expect(translate("roleAthlete")).toBe("Atleta");
    expect(translate("roleCoach")).toBe("Coach");
    expect(translate("roleAdmin")).toBe("Admin");
    expect(translate("recoverByEmail")).toBe("Recuperar por email");
    expect(translate("recoverBySMS")).toBe("Recuperar por SMS");
    expect(translate("retryRoleCapabilities")).toBe("Reintentar capacidades");
    expect(translate("domainAll")).toBe("Todo");
    expect(translate("domainTraining")).toBe("Entrenamiento");
    expect(translate("domainOperations")).toBe("Operaciones");
    expect(translate("settingsTitle")).toBe("Ajustes");
    expect(translate("legalSectionTitle")).toBe("Privacidad y consentimiento");
    expect(translate("goalPickerLabel")).toBe("objetivo");
    expect(translate("exercisePickerLabel")).toBe("ejercicio");
    expect(translate("videoLocalePickerLabel")).toBe("idioma del video");
    expect(translate("runtimeStateSectionTitle")).toBe("Estado enterprise por dominio");
    expect(translate("runtimeStateModeLabel")).toBe("Modo runtime");
    expect(translate("runtimeStateRecoveryAction")).toBe("Recuperar dominio");
    expect(translate("noModulesForSelectedDomain")).toBe(
      "No hay modulos para el dominio seleccionado."
    );
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
    expect(humanizeStatus("validation_error", "es")).toBe("error de validacion");
    expect(humanizeStatus("validation_error", "en")).toBe("validation error");
    expect(humanizeStatus("consent_required", "es")).toBe("consentimiento requerido");
    expect(humanizeStatus("consent_required", "en")).toBe("consent required");
    expect(humanizeStatus("recovery_sent_email", "es")).toBe("recuperacion enviada por email");
    expect(humanizeStatus("recovery_sent_email", "en")).toBe("recovery sent by email");
    expect(humanizeStatus("recovery_sent_sms", "es")).toBe("recuperacion enviada por sms");
    expect(humanizeStatus("recovery_sent_sms", "en")).toBe("recovery sent by sms");
    expect(humanizeStatus("exported", "es")).toBe("exportado");
    expect(humanizeStatus("exported", "en")).toBe("exported");
    expect(humanizeStatus("deletion_requested", "es")).toBe("borrado solicitado");
    expect(humanizeStatus("deletion_requested", "en")).toBe("deletion requested");
    expect(humanizeStatus("loading", "es")).toBe("cargando");
    expect(humanizeStatus("loading", "en")).toBe("loading");
    expect(humanizeStatus("offline", "es")).toBe("sin conexion");
    expect(humanizeStatus("offline", "en")).toBe("offline");
    expect(humanizeStatus("denied", "es")).toBe("sin permiso");
    expect(humanizeStatus("denied", "en")).toBe("denied");
  });
});
