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
    return language === "es" ? "acceso activo" : "access active";
  }

  switch (authStatus) {
    case "signed_out":
    case "session_required":
      return language === "es" ? "inicia sesion para continuar" : "sign in to continue";
    case "loading":
      return language === "es" ? "iniciando sesion..." : "signing in...";
    case "validation_error":
      return language === "es"
        ? "revisa correo y contrasena e intentalo de nuevo"
        : "check email and password and try again";
    case "auth_error":
      return language === "es"
        ? "no pudimos iniciar sesion. prueba de nuevo."
        : "we could not sign you in. please try again.";
    case "recovery_sent_email":
      return language === "es"
        ? "te enviamos instrucciones por correo"
        : "we sent recovery instructions by email";
    case "recovery_sent_sms":
      return language === "es"
        ? "te enviamos un codigo por sms"
        : "we sent a recovery code by sms";
    default:
      return humanizeStatus(authStatus, language);
  }
}
