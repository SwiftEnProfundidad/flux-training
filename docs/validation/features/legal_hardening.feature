Feature: Hardening legal de privacidad, consentimiento y borrado
  Como usuario final
  Quiero aceptar consentimientos obligatorios y solicitar borrado de datos
  Para cumplir requisitos de privacidad y operar de forma segura en beta

  Scenario: Registro de consentimiento legal completo
    Given un usuario "demo-user"
    And acepta privacidad, terminos y disclaimer medico
    When envia su consentimiento legal
    Then el backend persiste el consentimiento

  Scenario: Rechazo de consentimiento incompleto
    Given un usuario "demo-user"
    And no acepta todos los consentimientos requeridos
    When envia su consentimiento legal
    Then el backend rechaza la solicitud con error de validacion

  Scenario: Solicitud de borrado de datos
    Given un usuario "demo-user"
    When solicita borrado de datos desde la app
    Then el backend registra una peticion de borrado pendiente
