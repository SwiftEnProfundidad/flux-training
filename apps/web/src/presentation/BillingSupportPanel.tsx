import { memo } from "react";
import type {
  BillingInvoiceRow,
  BillingInvoiceStatus,
  BillingInvoiceStatusFilter,
  SupportIncidentRow,
  SupportIncidentSeverity,
  SupportIncidentSeverityFilter,
  SupportIncidentState,
  SupportIncidentStateFilter
} from "./billing-support";

type FilterOption<T extends string> = {
  value: T;
  label: string;
};

type BillingSupportPanelProps = {
  screenId: string;
  routeId: string;
  statusId: string;
  title: string;
  supportScreenId: string;
  supportRouteId: string;
  supportStatusId: string;
  loadDataLabel: string;
  billingLoadDataActionId: string;
  supportLoadDataActionId: string;
  onLoadData: () => void;
  resolveSelectedLabel: string;
  billingResolveSelectedActionId: string;
  supportResolveSelectedActionId: string;
  onResolveSelected: () => void;
  clearSelectionLabel: string;
  billingClearSelectionActionId: string;
  supportClearSelectionActionId: string;
  onClearSelection: () => void;
  clearFiltersLabel: string;
  billingClearFiltersActionId: string;
  supportClearFiltersActionId: string;
  onClearFilters: () => void;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  domainPlaceholder: string;
  domainValue: string;
  onDomainChange: (value: string) => void;
  invoiceStatusFilterLabel: string;
  invoiceStatusFilterValue: BillingInvoiceStatusFilter;
  invoiceStatusOptions: FilterOption<BillingInvoiceStatusFilter>[];
  onInvoiceStatusFilterChange: (value: BillingInvoiceStatusFilter) => void;
  incidentStateFilterLabel: string;
  incidentStateFilterValue: SupportIncidentStateFilter;
  incidentStateOptions: FilterOption<SupportIncidentStateFilter>[];
  onIncidentStateFilterChange: (value: SupportIncidentStateFilter) => void;
  incidentSeverityFilterLabel: string;
  incidentSeverityFilterValue: SupportIncidentSeverityFilter;
  incidentSeverityOptions: FilterOption<SupportIncidentSeverityFilter>[];
  onIncidentSeverityFilterChange: (value: SupportIncidentSeverityFilter) => void;
  invoicesLoadedLabel: string;
  invoicesLoadedValue: string;
  incidentsLoadedLabel: string;
  incidentsLoadedValue: string;
  incidentsSelectedLabel: string;
  incidentsSelectedValue: string;
  invoicesSectionTitle: string;
  noInvoicesLabel: string;
  invoiceRowsInfoLabel: string;
  invoiceRows: BillingInvoiceRow[];
  invoiceIdColumnLabel: string;
  accountColumnLabel: string;
  periodColumnLabel: string;
  amountColumnLabel: string;
  invoiceStatusColumnLabel: string;
  sourceColumnLabel: string;
  invoiceStatusHumanizer: (status: BillingInvoiceStatus) => string;
  invoiceSourceHumanizer: (source: BillingInvoiceRow["source"]) => string;
  invoiceStatusClassName: (status: BillingInvoiceStatus) => string;
  hasMoreInvoiceRows: boolean;
  loadMoreRowsLabel: string;
  onLoadMoreInvoiceRows: () => void;
  showAllRowsLabel: string;
  onShowAllInvoiceRows: () => void;
  incidentsSectionTitle: string;
  noIncidentsLabel: string;
  incidentRowsInfoLabel: string;
  incidentRows: SupportIncidentRow[];
  selectedIncidentIds: Set<string>;
  onToggleIncidentSelection: (incidentId: string) => void;
  incidentIdColumnLabel: string;
  openedAtColumnLabel: string;
  incidentDomainColumnLabel: string;
  incidentSeverityColumnLabel: string;
  incidentStateColumnLabel: string;
  incidentCorrelationColumnLabel: string;
  incidentSummaryColumnLabel: string;
  incidentSeverityHumanizer: (severity: SupportIncidentSeverity) => string;
  incidentStateHumanizer: (state: SupportIncidentState) => string;
  incidentSeverityClassName: (severity: SupportIncidentSeverity) => string;
  incidentStateClassName: (state: SupportIncidentState) => string;
  hasMoreIncidentRows: boolean;
  onLoadMoreIncidentRows: () => void;
  onShowAllIncidentRows: () => void;
};

export const BillingSupportPanel = memo(function BillingSupportPanel({
  screenId,
  routeId,
  statusId,
  title,
  supportScreenId,
  supportRouteId,
  supportStatusId,
  loadDataLabel,
  billingLoadDataActionId,
  supportLoadDataActionId,
  onLoadData,
  resolveSelectedLabel,
  billingResolveSelectedActionId,
  supportResolveSelectedActionId,
  onResolveSelected,
  clearSelectionLabel,
  billingClearSelectionActionId,
  supportClearSelectionActionId,
  onClearSelection,
  clearFiltersLabel,
  billingClearFiltersActionId,
  supportClearFiltersActionId,
  onClearFilters,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  domainPlaceholder,
  domainValue,
  onDomainChange,
  invoiceStatusFilterLabel,
  invoiceStatusFilterValue,
  invoiceStatusOptions,
  onInvoiceStatusFilterChange,
  incidentStateFilterLabel,
  incidentStateFilterValue,
  incidentStateOptions,
  onIncidentStateFilterChange,
  incidentSeverityFilterLabel,
  incidentSeverityFilterValue,
  incidentSeverityOptions,
  onIncidentSeverityFilterChange,
  invoicesLoadedLabel,
  invoicesLoadedValue,
  incidentsLoadedLabel,
  incidentsLoadedValue,
  incidentsSelectedLabel,
  incidentsSelectedValue,
  invoicesSectionTitle,
  noInvoicesLabel,
  invoiceRowsInfoLabel,
  invoiceRows,
  invoiceIdColumnLabel,
  accountColumnLabel,
  periodColumnLabel,
  amountColumnLabel,
  invoiceStatusColumnLabel,
  sourceColumnLabel,
  invoiceStatusHumanizer,
  invoiceSourceHumanizer,
  invoiceStatusClassName,
  hasMoreInvoiceRows,
  loadMoreRowsLabel,
  onLoadMoreInvoiceRows,
  showAllRowsLabel,
  onShowAllInvoiceRows,
  incidentsSectionTitle,
  noIncidentsLabel,
  incidentRowsInfoLabel,
  incidentRows,
  selectedIncidentIds,
  onToggleIncidentSelection,
  incidentIdColumnLabel,
  openedAtColumnLabel,
  incidentDomainColumnLabel,
  incidentSeverityColumnLabel,
  incidentStateColumnLabel,
  incidentCorrelationColumnLabel,
  incidentSummaryColumnLabel,
  incidentSeverityHumanizer,
  incidentStateHumanizer,
  incidentSeverityClassName,
  incidentStateClassName,
  hasMoreIncidentRows,
  onLoadMoreIncidentRows,
  onShowAllIncidentRows
}: BillingSupportPanelProps) {
  return (
    <div className="form-grid" data-screen-id={screenId} data-route-id={routeId} data-status-id={statusId}>
      <p className="section-subtitle">{title}</p>
      <div className="inline-inputs">
        <button
          className="button ghost"
          data-action-id={billingLoadDataActionId}
          onClick={onLoadData}
          type="button"
        >
          {loadDataLabel}
        </button>
        <button
          className="button primary"
          data-action-id={billingResolveSelectedActionId}
          onClick={onResolveSelected}
          type="button"
        >
          {resolveSelectedLabel}
        </button>
        <button
          className="button ghost"
          data-action-id={billingClearSelectionActionId}
          onClick={onClearSelection}
          type="button"
        >
          {clearSelectionLabel}
        </button>
        <button
          className="button ghost"
          data-action-id={billingClearFiltersActionId}
          onClick={onClearFilters}
          type="button"
        >
          {clearFiltersLabel}
        </button>
      </div>
      <div className="inline-inputs">
        <input
          aria-label={searchPlaceholder}
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <input
          aria-label={domainPlaceholder}
          placeholder={domainPlaceholder}
          value={domainValue}
          onChange={(event) => onDomainChange(event.target.value)}
        />
      </div>
      <div className="inline-inputs">
        <label className="compact-label">
          {invoiceStatusFilterLabel}
          <select
            aria-label={invoiceStatusFilterLabel}
            value={invoiceStatusFilterValue}
            onChange={(event) =>
              onInvoiceStatusFilterChange(event.target.value as BillingInvoiceStatusFilter)
            }
          >
            {invoiceStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="compact-label">
          {incidentStateFilterLabel}
          <select
            aria-label={incidentStateFilterLabel}
            value={incidentStateFilterValue}
            onChange={(event) =>
              onIncidentStateFilterChange(event.target.value as SupportIncidentStateFilter)
            }
          >
            {incidentStateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="compact-label">
          {incidentSeverityFilterLabel}
          <select
            aria-label={incidentSeverityFilterLabel}
            value={incidentSeverityFilterValue}
            onChange={(event) =>
              onIncidentSeverityFilterChange(event.target.value as SupportIncidentSeverityFilter)
            }
          >
            {incidentSeverityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="stat-line"><span>{invoicesLoadedLabel}</span><strong>{invoicesLoadedValue}</strong></p>
      <p className="stat-line"><span>{incidentsLoadedLabel}</span><strong>{incidentsLoadedValue}</strong></p>
      <p className="stat-line"><span>{incidentsSelectedLabel}</span><strong>{incidentsSelectedValue}</strong></p>
      <p className="section-subtitle">{invoicesSectionTitle}</p>
      {invoiceRows.length === 0 ? (
        <p className="empty-state">{noInvoicesLabel}</p>
      ) : (
        <>
          <p className="dense-table-info">{invoiceRowsInfoLabel}</p>
          <div className="operations-table">
            <header className="operations-table-row operations-table-header billing-table-row">
              <span>{invoiceIdColumnLabel}</span>
              <span>{accountColumnLabel}</span>
              <span>{periodColumnLabel}</span>
              <span>{amountColumnLabel}</span>
              <span>{invoiceStatusColumnLabel}</span>
              <span>{sourceColumnLabel}</span>
            </header>
            {invoiceRows.map((invoice) => (
              <div key={invoice.id} className="operations-table-row billing-table-row">
                <span>{invoice.id}</span>
                <span>{invoice.accountId}</span>
                <span>{invoice.period}</span>
                <span>{invoice.amountEUR.toFixed(2)}</span>
                <span className={`status-pill status-${invoiceStatusClassName(invoice.status)}`}>
                  {invoiceStatusHumanizer(invoice.status)}
                </span>
                <span>{invoiceSourceHumanizer(invoice.source)}</span>
              </div>
            ))}
          </div>
          {hasMoreInvoiceRows ? (
            <div className="dense-table-actions">
              <button className="button ghost" onClick={onLoadMoreInvoiceRows} type="button">
                {loadMoreRowsLabel}
              </button>
              <button className="button ghost" onClick={onShowAllInvoiceRows} type="button">
                {showAllRowsLabel}
              </button>
            </div>
          ) : null}
        </>
      )}
      <section
        data-screen-id={supportScreenId}
        data-route-id={supportRouteId}
        data-status-id={supportStatusId}
      >
        <p className="section-subtitle">{incidentsSectionTitle}</p>
        <div className="inline-inputs">
          <button
            className="button ghost"
            data-action-id={supportLoadDataActionId}
            onClick={onLoadData}
            type="button"
          >
            {loadDataLabel}
          </button>
          <button
            className="button primary"
            data-action-id={supportResolveSelectedActionId}
            onClick={onResolveSelected}
            type="button"
          >
            {resolveSelectedLabel}
          </button>
          <button
            className="button ghost"
            data-action-id={supportClearSelectionActionId}
            onClick={onClearSelection}
            type="button"
          >
            {clearSelectionLabel}
          </button>
          <button
            className="button ghost"
            data-action-id={supportClearFiltersActionId}
            onClick={onClearFilters}
            type="button"
          >
            {clearFiltersLabel}
          </button>
        </div>
        {incidentRows.length === 0 ? (
          <p className="empty-state">{noIncidentsLabel}</p>
        ) : (
          <>
            <p className="dense-table-info">{incidentRowsInfoLabel}</p>
            <div className="operations-table">
              <header className="operations-table-row operations-table-header support-table-row">
                <span>{incidentIdColumnLabel}</span>
                <span>{openedAtColumnLabel}</span>
                <span>{incidentDomainColumnLabel}</span>
                <span>{incidentSeverityColumnLabel}</span>
                <span>{incidentStateColumnLabel}</span>
                <span>{incidentCorrelationColumnLabel}</span>
                <span>{incidentSummaryColumnLabel}</span>
              </header>
              {incidentRows.map((incident) => (
                <label key={incident.id} className="operations-table-row support-table-row">
                  <div className="operations-athlete-cell">
                    <input
                      type="checkbox"
                      checked={selectedIncidentIds.has(incident.id)}
                      onChange={() => onToggleIncidentSelection(incident.id)}
                    />
                    <strong>{incident.id}</strong>
                  </div>
                  <span>{incident.openedAt}</span>
                  <span>{incident.domain}</span>
                  <span className={`status-pill status-${incidentSeverityClassName(incident.severity)}`}>
                    {incidentSeverityHumanizer(incident.severity)}
                  </span>
                  <span className={`status-pill status-${incidentStateClassName(incident.state)}`}>
                    {incidentStateHumanizer(incident.state)}
                  </span>
                  <span>{incident.correlationId}</span>
                  <span>{incident.summary}</span>
                </label>
              ))}
            </div>
            {hasMoreIncidentRows ? (
              <div className="dense-table-actions">
                <button className="button ghost" onClick={onLoadMoreIncidentRows} type="button">
                  {loadMoreRowsLabel}
                </button>
                <button className="button ghost" onClick={onShowAllIncidentRows} type="button">
                  {showAllRowsLabel}
                </button>
              </div>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
});
