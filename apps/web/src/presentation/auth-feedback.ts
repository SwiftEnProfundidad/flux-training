import { humanizeStatus, type AppLanguage } from "./i18n";

type AuthHeroStatusInput = {
  authStatus: string;
  hasAuthenticatedSession: boolean;
  language: AppLanguage;
};

export function resolveAuthHeroStatus({
  authStatus,
  hasAuthenticatedSession,
  language
}: AuthHeroStatusInput): string {
  if (hasAuthenticatedSession) {
    return language === "es" ? "sesion activa" : "active session";
  }

  switch (authStatus) {
    case "signed_out":
    case "session_required":
      return language === "es" ? "listo para iniciar" : "ready to sign in";
    case "loading":
      return language === "es" ? "iniciando sesion..." : "signing in...";
    case "validation_error":
      return language === "es"
        ? "revisa correo y contrasena"
        : "check email and password";
    case "auth_error":
      return language === "es"
        ? "no pudimos iniciar sesion. revisa credenciales o configuracion."
        : "could not sign in. check credentials or configuration.";
    default:
      return humanizeStatus(authStatus, language);
  }
}
