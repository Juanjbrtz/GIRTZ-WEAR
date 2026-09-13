import Link from "next/link";

const AccountIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="8" r="3.25" />
    <path d="M5.5 19c.8-3.6 3-5.4 6.5-5.4s5.7 1.8 6.5 5.4" />
  </svg>
);

export function AccountMenu({ signedIn, isAdmin, name }: { signedIn: boolean; isAdmin: boolean; name?: string | null }) {
  const accountHref = signedIn ? "/account" : "/auth/sign-in";
  const accountLabel = signedIn ? "Ir a mi cuenta" : "Iniciar sesión o crear cuenta";

  return (
    <>
      <details className="account-menu account-menu-desktop">
        <summary aria-label={signedIn ? "Abrir menú de cuenta" : "Iniciar sesión o crear cuenta"}>
          <AccountIcon />
        </summary>
        <div className="account-menu-popover">
          {signedIn ? (
            <>
              <div className="account-menu-head"><span>CUENTA</span><strong>{name || "GIRTZ"}</strong></div>
              <nav>
                <Link href="/account">MI CUENTA</Link>
                <Link href="/account#pedidos">MIS PEDIDOS</Link>
                <Link href="/account#configuracion">MIS DATOS</Link>
                <Link href="/account#cerrar-sesion">CERRAR SESIÓN</Link>
              </nav>
              {isAdmin ? (
                <div className="account-menu-admin">
                  <span>ADMINISTRACIÓN</span>
                  <nav>
                    <Link href="/admin">RESUMEN DE VENTAS</Link>
                    <Link href="/admin/products">SUBIR / EDITAR PRODUCTOS</Link>
                    <Link href="/admin/inventory">INVENTARIO Y COSTOS</Link>
                    <Link href="/admin/sales">VENTAS Y UTILIDAD</Link>
                    <Link href="/admin/providers">PROVEEDORES</Link>
                  </nav>
                </div>
              ) : null}
            </>
          ) : (
            <>
              <div className="account-menu-head"><span>GIRTZ WEAR</span><strong>TU CUENTA</strong></div>
              <nav><Link href="/auth/sign-in">INICIAR SESIÓN</Link><Link href="/auth/sign-up">CREAR CUENTA</Link></nav>
            </>
          )}
        </div>
      </details>

      <Link className="account-menu-mobile-link" href={accountHref} aria-label={accountLabel}>
        <AccountIcon />
      </Link>
    </>
  );
}
