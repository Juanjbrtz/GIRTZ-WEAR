import "../../ux-states.css";

export default function ProductLoading() {
  return (
    <main className="ux-loading-shell" aria-busy="true" aria-live="polite">
      <div className="ux-loading-copy">
        <span>GIRTZ / PRODUCTO</span>
        <h1>Cargando modelo.</h1>
      </div>
      <div className="ux-skeleton-grid" aria-hidden="true">
        <div className="ux-skeleton-card"><div className="ux-skeleton-media" /></div>
        <div className="ux-skeleton-card">
          <div className="ux-skeleton-lines" style={{ minHeight: 280, alignContent: "center" }}>
            <div className="ux-skeleton-line short" />
            <div className="ux-skeleton-line" />
            <div className="ux-skeleton-line medium" />
            <div className="ux-skeleton-line" />
          </div>
        </div>
      </div>
    </main>
  );
}
