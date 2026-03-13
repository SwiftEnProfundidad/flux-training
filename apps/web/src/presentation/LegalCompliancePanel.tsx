import { memo } from "react";
import type { AppLanguage } from "./i18n";

interface LegalCompliancePanelProps {
  screenId: string;
  routeId: string;
  statusId: string;
  title: string;
  status: string;
  statusLabel: string;
  summaryLabel: string;
  summaryValue: string;
  showStatus?: boolean;
  showSummary?: boolean;
  language: AppLanguage;
  privacyPolicyLabel: string;
  privacyPolicyAccepted: boolean;
  onPrivacyPolicyChange: (value: boolean) => void;
  termsLabel: string;
  termsAccepted: boolean;
  onTermsChange: (value: boolean) => void;
  medicalDisclaimerLabel: string;
  medicalDisclaimerAccepted: boolean;
  onMedicalDisclaimerChange: (value: boolean) => void;
  saveConsentLabel: string;
  exportDataLabel: string;
  requestDeletionLabel: string;
  saveConsentActionId: string;
  exportDataActionId: string;
  requestDeletionActionId: string;
  onSaveConsent: () => void;
  onExportData: () => void;
  onRequestDeletion: () => void;
}

export const LegalCompliancePanel = memo(function LegalCompliancePanel({
  screenId,
  routeId,
  statusId,
  title,
  status,
  statusLabel,
  summaryLabel,
  summaryValue,
  showStatus = true,
  showSummary = true,
  language,
  privacyPolicyLabel,
  privacyPolicyAccepted,
  onPrivacyPolicyChange,
  termsLabel,
  termsAccepted,
  onTermsChange,
  medicalDisclaimerLabel,
  medicalDisclaimerAccepted,
  onMedicalDisclaimerChange,
  saveConsentLabel,
  exportDataLabel,
  requestDeletionLabel,
  saveConsentActionId,
  exportDataActionId,
  requestDeletionActionId,
  onSaveConsent,
  onExportData,
  onRequestDeletion
}: LegalCompliancePanelProps) {
  return (
    <article
      className="module-card"
      data-language={language}
      data-route-id={routeId}
      data-screen-id={screenId}
      data-status-id={statusId}
    >
      <div className="section-heading">
        <h2>{title}</h2>
        {showStatus ? (
          <p>
            {statusLabel}: {status}
          </p>
        ) : null}
      </div>
      <div className="form-grid">
        {showSummary ? (
          <p>
            <span>{summaryLabel}</span>{" "}
            <strong>{summaryValue}</strong>
          </p>
        ) : null}
        <label>
          <input
            type="checkbox"
            checked={privacyPolicyAccepted}
            onChange={(event) => onPrivacyPolicyChange(event.target.checked)}
          />
          {privacyPolicyLabel}
        </label>
        <label>
          <input type="checkbox" checked={termsAccepted} onChange={(event) => onTermsChange(event.target.checked)} />
          {termsLabel}
        </label>
        <label>
          <input
            type="checkbox"
            checked={medicalDisclaimerAccepted}
            onChange={(event) => onMedicalDisclaimerChange(event.target.checked)}
          />
          {medicalDisclaimerLabel}
        </label>
        <div className="inline-inputs">
          <button
            className="button primary"
            data-action-id={saveConsentActionId}
            onClick={onSaveConsent}
            type="button"
          >
            {saveConsentLabel}
          </button>
          <button
            className="button ghost"
            data-action-id={exportDataActionId}
            onClick={onExportData}
            type="button"
          >
            {exportDataLabel}
          </button>
          <button
            className="button ghost"
            data-action-id={requestDeletionActionId}
            onClick={onRequestDeletion}
            type="button"
          >
            {requestDeletionLabel}
          </button>
        </div>
      </div>
    </article>
  );
});
