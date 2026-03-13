import { memo } from "react";

type ProductAlertCenterTone = "critical" | "warning" | "neutral";

type ProductAlertCenterItem = {
  id: string;
  title: string;
  meta: string;
  tone: ProductAlertCenterTone;
  actionLabel: string;
  onPress: () => void;
};

type ProductAlertCenterPanelProps = {
  screenId: string;
  routeId: string;
  status: string;
  items: ProductAlertCenterItem[];
  emptyLabel: string;
  footerTitle: string;
  footerMeta: string;
};

export const ProductAlertCenterPanel = memo(function ProductAlertCenterPanel({
  screenId,
  routeId,
  status,
  items,
  emptyLabel,
  footerTitle,
  footerMeta
}: ProductAlertCenterPanelProps) {
  return (
    <section
      className="product-alert-center-shell"
      data-screen-id={screenId}
      data-route-id={routeId}
      data-screen-state={status}
    >
      {items.length === 0 ? (
        <div className="product-alert-center-empty">{emptyLabel}</div>
      ) : (
        <div className="product-alert-center-list">
          {items.map((item) => (
            <article key={item.id} className={`product-alert-center-item tone-${item.tone}`}>
              <div className="product-alert-center-item-copy">
                <strong>{item.title}</strong>
                <span>{item.meta}</span>
              </div>
              <button className={`button ghost product-alert-center-action tone-${item.tone}`} type="button" onClick={item.onPress}>
                {item.actionLabel}
              </button>
            </article>
          ))}
        </div>
      )}
      <div className="product-alert-center-footer">
        <span className="product-alert-center-footer-icon" aria-hidden="true">
          ✓
        </span>
        <div className="product-alert-center-footer-copy">
          <strong>{footerTitle}</strong>
          <span>{footerMeta}</span>
        </div>
      </div>
    </section>
  );
});
