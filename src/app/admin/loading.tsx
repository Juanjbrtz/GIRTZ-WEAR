import "../ux-states.css";

export default function AdminLoading() {
  return (
    <section className="admin-section" aria-busy="true" aria-live="polite">
      <div className="ux-loading-copy">
        <span>GIRTZ ADMIN</span>
        <h1>Cargando panel.</h1>
      </div>
      <div className="admin-loading-grid" aria-hidden="true">
        {[0, 1, 2].map((item) => <div className="admin-loading-box" key={item} />)}
      </div>
    </section>
  );
}
