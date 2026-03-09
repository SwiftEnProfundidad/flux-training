import { memo } from "react";

type NutritionOverviewPanelProps = {
  screenId: string;
  routeId: string;
  statusId: string;
  title: string;
  datePlaceholder: string;
  nutritionDate: string;
  onNutritionDateChange: (value: string) => void;
  caloriesPlaceholder: string;
  calories: string;
  onCaloriesChange: (value: string) => void;
  proteinPlaceholder: string;
  proteinGrams: string;
  onProteinChange: (value: string) => void;
  carbsPlaceholder: string;
  carbsGrams: string;
  onCarbsChange: (value: string) => void;
  fatsPlaceholder: string;
  fatsGrams: string;
  onFatsChange: (value: string) => void;
  saveLabel: string;
  saveActionId: string;
  onSave: () => void;
  loadLabel: string;
  loadActionId: string;
  onLoad: () => void;
};

export const NutritionOverviewPanel = memo(function NutritionOverviewPanel({
  screenId,
  routeId,
  statusId,
  title,
  datePlaceholder,
  nutritionDate,
  onNutritionDateChange,
  caloriesPlaceholder,
  calories,
  onCaloriesChange,
  proteinPlaceholder,
  proteinGrams,
  onProteinChange,
  carbsPlaceholder,
  carbsGrams,
  onCarbsChange,
  fatsPlaceholder,
  fatsGrams,
  onFatsChange,
  saveLabel,
  saveActionId,
  onSave,
  loadLabel,
  loadActionId,
  onLoad
}: NutritionOverviewPanelProps) {
  return (
    <div className="form-grid" data-screen-id={screenId} data-route-id={routeId} data-status-id={statusId}>
      <p className="section-subtitle">{title}</p>
      <input
        aria-label={datePlaceholder}
        placeholder={datePlaceholder}
        value={nutritionDate}
        onChange={(event) => onNutritionDateChange(event.target.value)}
      />
      <div className="inline-inputs">
        <input
          aria-label={caloriesPlaceholder}
          placeholder={caloriesPlaceholder}
          value={calories}
          onChange={(event) => onCaloriesChange(event.target.value)}
        />
        <input
          aria-label={proteinPlaceholder}
          placeholder={proteinPlaceholder}
          value={proteinGrams}
          onChange={(event) => onProteinChange(event.target.value)}
        />
      </div>
      <div className="inline-inputs">
        <input
          aria-label={carbsPlaceholder}
          placeholder={carbsPlaceholder}
          value={carbsGrams}
          onChange={(event) => onCarbsChange(event.target.value)}
        />
        <input
          aria-label={fatsPlaceholder}
          placeholder={fatsPlaceholder}
          value={fatsGrams}
          onChange={(event) => onFatsChange(event.target.value)}
        />
      </div>
      <div className="inline-inputs">
        <button className="button primary" data-action-id={saveActionId} onClick={onSave} type="button">
          {saveLabel}
        </button>
        <button className="button ghost" data-action-id={loadActionId} onClick={onLoad} type="button">
          {loadLabel}
        </button>
      </div>
    </div>
  );
});
