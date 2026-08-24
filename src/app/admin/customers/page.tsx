import { getAdminCustomers } from "@/lib/store-data";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function AdminCustomersPage() {
  const customerList = await getAdminCustomers();

  return (
    <section className="admin-section">
      <header className="admin-heading">
        <div>
          <span>CRM / CLIENTES</span>
          <h1>CLIENTES</h1>
        </div>
        <div className="admin-count">{customerList.length} REGISTRADOS</div>
      </header>

      {customerList.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table customer-table">
            <thead>
              <tr>
                <th>NOMBRE</th>
                <th>CORREO</th>
                <th>TELÉFONO</th>
                <th>CIUDAD</th>
                <th>ROL</th>
                <th>DESDE</th>
              </tr>
            </thead>
            <tbody>
              {customerList.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email || "—"}</td>
                  <td>{customer.phone || "—"}</td>
                  <td>{customer.city || "—"}</td>
                  <td><span className="status-pill">{customer.role}</span></td>
                  <td>{formatDate(customer.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-empty">Aún no hay clientes registrados.</div>
      )}
    </section>
  );
}
