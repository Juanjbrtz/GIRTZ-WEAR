import "./ux-states.css";

export default function Loading() {
  return (
    <main className="ux-loading-shell" aria-busy="true" aria-live="polite">
      <div className="ux-loading-copy">
        <span>GIRTZ WEAR</span>
        <h1>Cargando.</h1>
      </div>
      <div className="ux-skeleton-grid" aria-hidden="true">
        {[0, 1, 2, 3].map((item) => (
          <div className="ux-skeleton-card" key={item}>
            <div className="ux-skeleton-media" />
            <div className="ux-skeleton-lines">
              <div className="ux-skeleton-line short" />
              <div className="ux-skeleton-line" />
              <div className="ux-skeleton-line medium" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
