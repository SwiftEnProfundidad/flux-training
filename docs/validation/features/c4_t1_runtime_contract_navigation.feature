Feature: C4 T1 runtime integration with screen contracts
  Como equipo de producto
  Quiero que runtime iOS y web inicialicen estado desde contratos de pantalla
  Para mantener consistencia entre board, contratos y ejecución

  Scenario: iOS inicializa estados desde contratos C2 C3
    Given ExperienceHubView
    When se inicia la vista
    Then los estados base de auth onboarding nutrition ai y legal deben provenir de contratos

  Scenario: Web inicializa runtime desde contratos C2 C3
    Given App.tsx
    When se inicia la app
    Then los valores base de auth onboarding training nutrition y legal deben venir de contratos
