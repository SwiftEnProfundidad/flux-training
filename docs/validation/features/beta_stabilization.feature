Feature: Beta cerrada y estabilizacion por version de cliente
  Como responsable de release
  Quiero bloquear clientes por debajo de una version minima
  Para evitar regresiones en usuarios beta con builds antiguas

  Scenario: Cliente web en version soportada
    Given una version minima web "0.1.0"
    And una request web con version "0.1.3"
    When se evalua compatibilidad de version
    Then el backend permite la operacion

  Scenario: Cliente web desactualizado
    Given una version minima web "0.1.0"
    And una request web con version "0.0.9"
    When se evalua compatibilidad de version
    Then el backend rechaza la operacion con "client_update_required"

  Scenario: UI web muestra mensaje accionable en upgrade requerido
    Given una respuesta de API con codigo "client_update_required"
    When la capa web mapea el error de infraestructura
    Then la UI recibe el estado "upgrade_required"
