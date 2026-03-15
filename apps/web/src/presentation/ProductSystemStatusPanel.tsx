import { memo } from "react";

type ProductSystemStatusTone = "positive" | "warning";

type ProductSystemStatusCard = {
  id: string;
  label: string;
  status: string;
  detail: string;
  tone: ProductSystemStatusTone;
};

type ProductSystemStatusEvent = {
  id: string;
  occurredAt: string;
  summary: string;
};

type ProductSystemStatusPanelProps = {
  screenId: string;
  routeId: string;
  status: string;
  cards: readonly ProductSystemStatusCard[];
  eventsTitle: string;
  events: readonly ProductSystemStatusEvent[];
};

export const ProductSystemStatusPanel = memo(function ProductSystemStatusPanel({
  screenId,
  routeId,
  status,
  cards,
  eventsTitle,
  events
}: ProductSystemStatusPanelProps) {
  return (
    <section
      className="product-system-status-shell"
      data-screen-id={screenId}
      data-route-id={routeId}
      data-screen-state={status}
    >
      <div className="product-system-status-grid">
        {cards.map((card) => (
          <article key={card.id} className={`product-system-status-card tone-${card.tone}`}>
            <span>{card.label}</span>
            <strong>{card.status}</strong>
            <p>{card.detail}</p>
          </article>
        ))}
      </div>
      <section className="product-system-events-card">
        <header className="product-system-events-header">
          <h2>{eventsTitle}</h2>
        </header>
        <div className="product-system-events-list">
          {events.map((event) => (
            <article key={event.id} className="product-system-event-row">
              <span>{event.occurredAt}</span>
              <strong>{event.summary}</strong>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
});
