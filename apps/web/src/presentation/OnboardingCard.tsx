import { memo } from "react";
import { Goal } from "@flux/contracts";

type OnboardingCardProps = {
  title: string;
  statusLabel: string;
  statusValue: string;
  statusClass: string;
  displayNameLabel: string;
  displayName: string;
  onDisplayNameChange: (value: string) => void;
  ageLabel: string;
  age: string;
  onAgeChange: (value: string) => void;
  heightLabel: string;
  height: string;
  onHeightChange: (value: string) => void;
  weightLabel: string;
  weight: string;
  onWeightChange: (value: string) => void;
  daysPerWeekLabel: string;
  daysPerWeek: string;
  onDaysPerWeekChange: (value: string) => void;
  goalLabel: string;
  goal: Goal;
  goalOptions: {
    fatLoss: string;
    recomposition: string;
    muscleGain: string;
    habit: string;
  };
  onGoalChange: (goal: Goal) => void;
  parQ1Label: string;
  parQ1: boolean;
  onParQ1Change: (value: boolean) => void;
  parQ2Label: string;
  parQ2: boolean;
  onParQ2Change: (value: boolean) => void;
  privacyPolicyLabel: string;
  privacyPolicyAccepted: boolean;
  onPrivacyPolicyChange: (value: boolean) => void;
  termsLabel: string;
  termsAccepted: boolean;
  onTermsChange: (value: boolean) => void;
  medicalDisclaimerLabel: string;
  medicalDisclaimerAccepted: boolean;
  onMedicalDisclaimerChange: (value: boolean) => void;
  completeLabel: string;
  onComplete: () => void;
  saveConsentLabel: string;
  onSaveConsent: () => void;
  exportDataLabel: string;
  onExportData: () => void;
};

export const OnboardingCard = memo(function OnboardingCard({
  title,
  statusLabel,
  statusValue,
  statusClass,
  displayNameLabel,
  displayName,
  onDisplayNameChange,
  ageLabel,
  age,
  onAgeChange,
  heightLabel,
  height,
  onHeightChange,
  weightLabel,
  weight,
  onWeightChange,
  daysPerWeekLabel,
  daysPerWeek,
  onDaysPerWeekChange,
  goalLabel,
  goal,
  goalOptions,
  onGoalChange,
  parQ1Label,
  parQ1,
  onParQ1Change,
  parQ2Label,
  parQ2,
  onParQ2Change,
  privacyPolicyLabel,
  privacyPolicyAccepted,
  onPrivacyPolicyChange,
  termsLabel,
  termsAccepted,
  onTermsChange,
  medicalDisclaimerLabel,
  medicalDisclaimerAccepted,
  onMedicalDisclaimerChange,
  completeLabel,
  onComplete,
  saveConsentLabel,
  onSaveConsent,
  exportDataLabel,
  onExportData
}: OnboardingCardProps) {
  return (
    <article className="module-card">
      <header className="module-header">
        <h2>{title}</h2>
        <p>
          {statusLabel}: <span className={`status-pill status-${statusClass}`}>{statusValue}</span>
        </p>
      </header>
      <div className="form-grid">
        <input
          aria-label={displayNameLabel}
          placeholder={displayNameLabel}
          value={displayName}
          onChange={(event) => onDisplayNameChange(event.target.value)}
        />
        <div className="inline-inputs">
          <input
            aria-label={ageLabel}
            placeholder={ageLabel}
            value={age}
            onChange={(event) => onAgeChange(event.target.value)}
          />
          <input
            aria-label={heightLabel}
            placeholder={heightLabel}
            value={height}
            onChange={(event) => onHeightChange(event.target.value)}
          />
        </div>
        <div className="inline-inputs">
          <input
            aria-label={weightLabel}
            placeholder={weightLabel}
            value={weight}
            onChange={(event) => onWeightChange(event.target.value)}
          />
          <input
            aria-label={daysPerWeekLabel}
            placeholder={daysPerWeekLabel}
            value={daysPerWeek}
            onChange={(event) => onDaysPerWeekChange(event.target.value)}
          />
        </div>
        <select aria-label={goalLabel} value={goal} onChange={(event) => onGoalChange(event.target.value as Goal)}>
          <option value="fat_loss">{goalOptions.fatLoss}</option>
          <option value="recomposition">{goalOptions.recomposition}</option>
          <option value="muscle_gain">{goalOptions.muscleGain}</option>
          <option value="habit">{goalOptions.habit}</option>
        </select>
        <label>
          <input type="checkbox" checked={parQ1} onChange={(event) => onParQ1Change(event.target.checked)} />
          {parQ1Label}
        </label>
        <label>
          <input type="checkbox" checked={parQ2} onChange={(event) => onParQ2Change(event.target.checked)} />
          {parQ2Label}
        </label>
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
        <button className="button primary" onClick={onComplete} type="button">
          {completeLabel}
        </button>
        <div className="inline-inputs">
          <button className="button primary" onClick={onSaveConsent} type="button">
            {saveConsentLabel}
          </button>
          <button className="button ghost" onClick={onExportData} type="button">
            {exportDataLabel}
          </button>
        </div>
      </div>
    </article>
  );
});
