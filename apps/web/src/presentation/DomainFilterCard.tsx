import { memo } from "react";
import { type DashboardDomain, type DashboardRole } from "./dashboard-domains";

type DomainTabOption = {
  id: DashboardDomain;
  label: string;
};

type RoleOption = {
  id: DashboardRole;
  label: string;
};

type DomainFilterCardProps = {
  label: string;
  tabs: DomainTabOption[];
  activeDomain: DashboardDomain;
  onDomainSelect: (domain: DashboardDomain) => void;
  roleLabel: string;
  activeRole: DashboardRole;
  roleOptions: RoleOption[];
  onRoleChange: (role: DashboardRole) => void;
  roleCapabilitySummary: string;
  roleCapabilitiesStatus: string;
  retryRoleCapabilitiesLabel: string;
  onRetryRoleCapabilities: () => void;
};

export const DomainFilterCard = memo(function DomainFilterCard({
  label,
  tabs,
  activeDomain,
  onDomainSelect,
  roleLabel,
  activeRole,
  roleOptions,
  onRoleChange,
  roleCapabilitySummary,
  roleCapabilitiesStatus,
  retryRoleCapabilitiesLabel,
  onRetryRoleCapabilities
}: DomainFilterCardProps) {
  return (
    <section className="domain-filter-card">
      <p className="domain-filter-label">{label}</p>
      <div className="domain-filter-tabs" role="tablist" aria-label={label}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`button ghost domain-tab ${activeDomain === tab.id ? "active" : ""}`}
            onClick={() => onDomainSelect(tab.id)}
            type="button"
            role="tab"
            aria-selected={activeDomain === tab.id}
            aria-controls="dashboard-grid"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="inline-inputs">
        <label className="runtime-state-control">
          <span>{roleLabel}</span>
          <select
            aria-label={roleLabel}
            value={activeRole}
            onChange={(event) => onRoleChange(event.target.value as DashboardRole)}
          >
            {roleOptions.map((role) => (
              <option key={role.id} value={role.id}>
                {role.label}
              </option>
            ))}
          </select>
        </label>
        <article className="metric-item">
          <p>{roleLabel}</p>
          <strong title={roleLabel}>{roleCapabilitySummary}</strong>
        </article>
        {roleCapabilitiesStatus === "error" ? (
          <button className="button ghost" onClick={onRetryRoleCapabilities} type="button">
            {retryRoleCapabilitiesLabel}
          </button>
        ) : null}
      </div>
    </section>
  );
});
