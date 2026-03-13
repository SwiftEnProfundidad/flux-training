import { memo } from "react";

type ProductQuickActionTone = "neutral" | "positive" | "critical";

type ProductQuickActionItem = {
  id: string;
  icon: string;
  title: string;
  meta: string;
  tone: ProductQuickActionTone;
  onPress: () => void;
};

type ProductQuickActionsPanelProps = {
  screenId: string;
  routeId: string;
  status: string;
  title: string;
  actions: ProductQuickActionItem[];
};

export const ProductQuickActionsPanel = memo(function ProductQuickActionsPanel({
  screenId,
  routeId,
  status,
  title,
  actions
}: ProductQuickActionsPanelProps) {
  return (
    <section
      className="product-quick-actions-shell"
      data-screen-id={screenId}
      data-route-id={routeId}
      data-screen-state={status}
    >
      <header className="product-quick-actions-header">
        <h2>{title}</h2>
      </header>
      <div className="product-quick-actions-grid">
        {actions.map((action) => (
          <button
            key={action.id}
            className={`product-quick-action-card tone-${action.tone}`}
            type="button"
            onClick={action.onPress}
          >
            <span className="product-quick-action-icon" aria-hidden="true">
              {action.icon}
            </span>
            <strong>{action.title}</strong>
            <span>{action.meta}</span>
          </button>
        ))}
      </div>
    </section>
  );
});
