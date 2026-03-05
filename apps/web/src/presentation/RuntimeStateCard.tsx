import { memo } from "react";
import { type DashboardDomain } from "./dashboard-domains";
import { type EnterpriseRuntimeState } from "./runtime-states";

type RuntimeStateOption = {
  id: EnterpriseRuntimeState;
  label: string;
};

type RuntimeStateCardProps = {
  title: string;
  statusClass: string;
  statusLabel: string;
  modeLabel: string;
  activeDomain: DashboardDomain;
  value: EnterpriseRuntimeState;
  options: RuntimeStateOption[];
  onChange: (value: EnterpriseRuntimeState) => void;
  recoverLabel: string;
  recoverDisabled: boolean;
  onRecover: () => void;
  copy: string;
};

export const RuntimeStateCard = memo(function RuntimeStateCard({
  title,
  statusClass,
  statusLabel,
  modeLabel,
  activeDomain,
  value,
  options,
  onChange,
  recoverLabel,
  recoverDisabled,
  onRecover,
  copy
}: RuntimeStateCardProps) {
  return (
    <section className="runtime-state-card">
      <header className="runtime-state-header">
        <p className="domain-filter-label">{title}</p>
        <span className={`status-pill status-${statusClass}`}>{statusLabel}</span>
      </header>
      <div className="inline-inputs">
        <label className="runtime-state-control">
          <span>{modeLabel}</span>
          <select
            aria-label={modeLabel}
            disabled={activeDomain === "all"}
            value={value}
            onChange={(event) => onChange(event.target.value as EnterpriseRuntimeState)}
          >
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <button className="button ghost" disabled={recoverDisabled} onClick={onRecover} type="button">
          {recoverLabel}
        </button>
      </div>
      <p className="runtime-state-copy">{copy}</p>
    </section>
  );
});
