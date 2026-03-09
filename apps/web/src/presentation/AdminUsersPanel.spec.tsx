import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AdminUsersPanel } from "./AdminUsersPanel";

describe("AdminUsersPanel", () => {
  it("renders empty governance state", () => {
    const markup = renderToStaticMarkup(
      <AdminUsersPanel
        screenId="web.adminUsers.screen"
        routeId="web.route.adminUsers"
        statusId="web.adminUsers.status"
        title="Usuarios + roles + RBAC"
        deniedDescription="Sin permiso"
        isDenied={false}
        searchPlaceholder="buscar usuario"
        searchValue=""
        onSearchChange={vi.fn()}
        roleFilterLabel="filtro de rol"
        roleFilterValue="all"
        roleOptions={[
          { id: "all", label: "todos los roles" },
          { id: "athlete", label: "Atleta" }
        ]}
        onRoleFilterChange={vi.fn()}
        loadCapabilitiesLabel="Cargar matriz RBAC"
        loadCapabilitiesActionId="web.adminUsers.loadCapabilities"
        onLoadCapabilities={vi.fn()}
        assignAthleteLabel="Asignar atleta"
        assignAthleteActionId="web.adminUsers.assignAthlete"
        onAssignAthlete={vi.fn()}
        assignCoachLabel="Asignar coach"
        assignCoachActionId="web.adminUsers.assignCoach"
        onAssignCoach={vi.fn()}
        assignAdminLabel="Asignar admin"
        assignAdminActionId="web.adminUsers.assignAdmin"
        onAssignAdmin={vi.fn()}
        clearSelectionLabel="Limpiar seleccion governance"
        clearSelectionActionId="web.adminUsers.clearSelection"
        onClearSelection={vi.fn()}
        usersLoadedLabel="Usuarios cargados"
        usersLoadedValue="0"
        usersSelectedLabel="Usuarios seleccionados"
        usersSelectedValue="0"
        noUsersLabel="No hay usuarios"
        rowsInfoLabel="Filas visibles 0/0"
        principals={[]}
        selectedPrincipalIds={new Set()}
        onTogglePrincipalSelection={vi.fn()}
        principalColumnLabel="Usuario"
        roleColumnLabel="Rol"
        sourceColumnLabel="Origen"
        countsColumnLabel="Carga"
        allowedDomainsLabel="Dominios permitidos"
        riskColumnLabel="Riesgo"
        sourceOperatorLabel="Operador"
        sourceActivityLabel="Actividad"
        riskNormalLabel="Normal"
        riskAttentionLabel="Atencion"
        roleHumanizer={(value) => value}
        hasMoreRows={false}
        loadMoreRowsLabel="Cargar mas"
        onLoadMoreRows={vi.fn()}
        showAllRowsLabel="Mostrar todo"
        onShowAllRows={vi.fn()}
        coverageTitle="Cobertura RBAC por rol"
        coverageRows={[]}
      />
    );

    expect(markup).toContain("Usuarios + roles + RBAC");
    expect(markup).toContain("No hay usuarios");
    expect(markup).toContain("web.adminUsers.loadCapabilities");
    expect(markup).toContain("web.adminUsers.assignAthlete");
  });

  it("renders governance rows and coverage cards", () => {
    const markup = renderToStaticMarkup(
      <AdminUsersPanel
        screenId="web.adminUsers.screen"
        routeId="web.route.adminUsers"
        statusId="web.adminUsers.status"
        title="Usuarios + roles + RBAC"
        deniedDescription="Sin permiso"
        isDenied={false}
        searchPlaceholder="buscar usuario"
        searchValue="demo"
        onSearchChange={vi.fn()}
        roleFilterLabel="filtro de rol"
        roleFilterValue="all"
        roleOptions={[
          { id: "all", label: "todos los roles" },
          { id: "athlete", label: "Atleta" }
        ]}
        onRoleFilterChange={vi.fn()}
        loadCapabilitiesLabel="Cargar matriz RBAC"
        loadCapabilitiesActionId="web.adminUsers.loadCapabilities"
        onLoadCapabilities={vi.fn()}
        assignAthleteLabel="Asignar atleta"
        assignAthleteActionId="web.adminUsers.assignAthlete"
        onAssignAthlete={vi.fn()}
        assignCoachLabel="Asignar coach"
        assignCoachActionId="web.adminUsers.assignCoach"
        onAssignCoach={vi.fn()}
        assignAdminLabel="Asignar admin"
        assignAdminActionId="web.adminUsers.assignAdmin"
        onAssignAdmin={vi.fn()}
        clearSelectionLabel="Limpiar seleccion governance"
        clearSelectionActionId="web.adminUsers.clearSelection"
        onClearSelection={vi.fn()}
        usersLoadedLabel="Usuarios cargados"
        usersLoadedValue="1"
        usersSelectedLabel="Usuarios seleccionados"
        usersSelectedValue="1"
        noUsersLabel="No hay usuarios"
        rowsInfoLabel="Filas visibles 1/1"
        principals={[
          {
            userId: "demo-user",
            assignedRole: "athlete",
            source: "operator",
            plansCount: 1,
            sessionsCount: 0,
            nutritionLogsCount: 0
          }
        ]}
        selectedPrincipalIds={new Set(["demo-user"])}
        onTogglePrincipalSelection={vi.fn()}
        principalColumnLabel="Usuario"
        roleColumnLabel="Rol"
        sourceColumnLabel="Origen"
        countsColumnLabel="Carga"
        allowedDomainsLabel="Dominios permitidos"
        riskColumnLabel="Riesgo"
        sourceOperatorLabel="Operador"
        sourceActivityLabel="Actividad"
        riskNormalLabel="Normal"
        riskAttentionLabel="Atencion"
        roleHumanizer={(value) => value}
        hasMoreRows={false}
        loadMoreRowsLabel="Cargar mas"
        onLoadMoreRows={vi.fn()}
        showAllRowsLabel="Mostrar todo"
        onShowAllRows={vi.fn()}
        coverageTitle="Cobertura RBAC por rol"
        coverageRows={[
          {
            role: "athlete",
            allowedDomainsCount: 2,
            allowedDomains: "onboarding, training"
          }
        ]}
      />
    );

    expect(markup).toContain("demo-user");
    expect(markup).toContain("Operador");
    expect(markup).toContain("1/0/0");
    expect(markup).toContain("Atencion");
    expect(markup).toContain("onboarding, training");
    expect(markup).toContain("checked");
  });
});
