import { memo } from "react";
import type {
  GovernancePrincipal,
  RoleCapabilityCoverage,
  GovernanceRoleFilter
} from "./admin-governance";

type GovernanceRoleOption = {
  id: GovernanceRoleFilter;
  label: string;
};

type AdminUsersPanelProps = {
  screenId: string;
  routeId: string;
  statusId: string;
  title: string;
  deniedDescription: string;
  isDenied: boolean;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  roleFilterLabel: string;
  roleFilterValue: GovernanceRoleFilter;
  roleOptions: GovernanceRoleOption[];
  onRoleFilterChange: (value: GovernanceRoleFilter) => void;
  loadCapabilitiesLabel: string;
  loadCapabilitiesActionId: string;
  onLoadCapabilities: () => void;
  assignAthleteLabel: string;
  assignAthleteActionId: string;
  onAssignAthlete: () => void;
  assignCoachLabel: string;
  assignCoachActionId: string;
  onAssignCoach: () => void;
  assignAdminLabel: string;
  assignAdminActionId: string;
  onAssignAdmin: () => void;
  clearSelectionLabel: string;
  clearSelectionActionId: string;
  onClearSelection: () => void;
  usersLoadedLabel: string;
  usersLoadedValue: string;
  usersSelectedLabel: string;
  usersSelectedValue: string;
  noUsersLabel: string;
  rowsInfoLabel: string;
  principals: GovernancePrincipal[];
  selectedPrincipalIds: Set<string>;
  onTogglePrincipalSelection: (principalId: string) => void;
  principalColumnLabel: string;
  roleColumnLabel: string;
  sourceColumnLabel: string;
  countsColumnLabel: string;
  allowedDomainsLabel: string;
  riskColumnLabel: string;
  sourceOperatorLabel: string;
  sourceActivityLabel: string;
  riskNormalLabel: string;
  riskAttentionLabel: string;
  roleHumanizer: (role: string) => string;
  hasMoreRows: boolean;
  loadMoreRowsLabel: string;
  onLoadMoreRows: () => void;
  showAllRowsLabel: string;
  onShowAllRows: () => void;
  coverageTitle: string;
  coverageRows: RoleCapabilityCoverage[];
};

function toStatusClass(isAttention: boolean): string {
  return isAttention ? "warning" : "positive";
}

export const AdminUsersPanel = memo(function AdminUsersPanel({
  screenId,
  routeId,
  statusId,
  title,
  deniedDescription,
  isDenied,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  roleFilterLabel,
  roleFilterValue,
  roleOptions,
  onRoleFilterChange,
  loadCapabilitiesLabel,
  loadCapabilitiesActionId,
  onLoadCapabilities,
  assignAthleteLabel,
  assignAthleteActionId,
  onAssignAthlete,
  assignCoachLabel,
  assignCoachActionId,
  onAssignCoach,
  assignAdminLabel,
  assignAdminActionId,
  onAssignAdmin,
  clearSelectionLabel,
  clearSelectionActionId,
  onClearSelection,
  usersLoadedLabel,
  usersLoadedValue,
  usersSelectedLabel,
  usersSelectedValue,
  noUsersLabel,
  rowsInfoLabel,
  principals,
  selectedPrincipalIds,
  onTogglePrincipalSelection,
  principalColumnLabel,
  roleColumnLabel,
  sourceColumnLabel,
  countsColumnLabel,
  allowedDomainsLabel,
  riskColumnLabel,
  sourceOperatorLabel,
  sourceActivityLabel,
  riskNormalLabel,
  riskAttentionLabel,
  roleHumanizer,
  hasMoreRows,
  loadMoreRowsLabel,
  onLoadMoreRows,
  showAllRowsLabel,
  onShowAllRows,
  coverageTitle,
  coverageRows
}: AdminUsersPanelProps) {
  return (
    <div className="form-grid" data-screen-id={screenId} data-route-id={routeId} data-status-id={statusId}>
      <p className="section-subtitle">{title}</p>
      {isDenied ? <p className="empty-state">{deniedDescription}</p> : null}
      <div className="inline-inputs">
        <input
          aria-label={searchPlaceholder}
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <label className="compact-label">
          {roleFilterLabel}
          <select
            aria-label={roleFilterLabel}
            value={roleFilterValue}
            onChange={(event) => onRoleFilterChange(event.target.value as GovernanceRoleFilter)}
          >
            {roleOptions.map((role) => (
              <option key={role.id} value={role.id}>
                {role.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="inline-inputs">
        <button
          className="button ghost"
          data-action-id={loadCapabilitiesActionId}
          onClick={onLoadCapabilities}
          type="button"
        >
          {loadCapabilitiesLabel}
        </button>
        <button
          className="button primary"
          data-action-id={assignAthleteActionId}
          onClick={onAssignAthlete}
          type="button"
        >
          {assignAthleteLabel}
        </button>
        <button
          className="button primary"
          data-action-id={assignCoachActionId}
          onClick={onAssignCoach}
          type="button"
        >
          {assignCoachLabel}
        </button>
        <button
          className="button primary"
          data-action-id={assignAdminActionId}
          onClick={onAssignAdmin}
          type="button"
        >
          {assignAdminLabel}
        </button>
        <button
          className="button ghost"
          data-action-id={clearSelectionActionId}
          onClick={onClearSelection}
          type="button"
        >
          {clearSelectionLabel}
        </button>
      </div>
      <p className="stat-line">
        <span>{usersLoadedLabel}</span>
        <strong>{usersLoadedValue}</strong>
      </p>
      <p className="stat-line">
        <span>{usersSelectedLabel}</span>
        <strong>{usersSelectedValue}</strong>
      </p>
      {principals.length === 0 ? (
        <p className="empty-state">{noUsersLabel}</p>
      ) : (
        <>
          <p className="dense-table-info">{rowsInfoLabel}</p>
          <div className="operations-table">
            <header className="operations-table-row operations-table-header">
              <span>{principalColumnLabel}</span>
              <span>{roleColumnLabel}</span>
              <span>{sourceColumnLabel}</span>
              <span>{countsColumnLabel}</span>
              <span>{allowedDomainsLabel}</span>
              <span>{riskColumnLabel}</span>
            </header>
            {principals.map((principal) => {
              const isAttention =
                principal.sessionsCount === 0 || principal.nutritionLogsCount === 0;
              return (
                <label key={principal.userId} className="operations-table-row">
                  <div className="operations-athlete-cell">
                    <input
                      type="checkbox"
                      checked={selectedPrincipalIds.has(principal.userId)}
                      onChange={() => onTogglePrincipalSelection(principal.userId)}
                    />
                    <strong>{principal.userId}</strong>
                  </div>
                  <span>{roleHumanizer(principal.assignedRole)}</span>
                  <span>
                    {principal.source === "operator"
                      ? sourceOperatorLabel
                      : sourceActivityLabel}
                  </span>
                  <span>
                    {principal.plansCount}/{principal.sessionsCount}/{principal.nutritionLogsCount}
                  </span>
                  <span>{coverageRows.find((row) => row.role === principal.assignedRole)?.allowedDomainsCount ?? 0}</span>
                  <span className={`status-pill status-${toStatusClass(isAttention)}`}>
                    {isAttention ? riskAttentionLabel : riskNormalLabel}
                  </span>
                </label>
              );
            })}
          </div>
          {hasMoreRows ? (
            <div className="dense-table-actions">
              <button className="button ghost" onClick={onLoadMoreRows} type="button">
                {loadMoreRowsLabel}
              </button>
              <button className="button ghost" onClick={onShowAllRows} type="button">
                {showAllRowsLabel}
              </button>
            </div>
          ) : null}
        </>
      )}
      <p className="section-subtitle">{coverageTitle}</p>
      <div className="history-list">
        {coverageRows.map((coverage) => (
          <article key={coverage.role} className="history-item">
            <strong>{roleHumanizer(coverage.role)}</strong>
            <div className="history-values">
              <span>
                {allowedDomainsLabel} {coverage.allowedDomainsCount}
              </span>
              <span>{coverage.allowedDomains.length === 0 ? "-" : coverage.allowedDomains}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
});
