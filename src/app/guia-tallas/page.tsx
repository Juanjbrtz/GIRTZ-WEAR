import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Guía de tallas" };

const menRows = [
  ["37", "7 / 7.5", "40", "25"],
  ["38", "8 / 8.5", "41", "26"],
  ["39 / 40", "8.5 / 9", "42", "26.5"],
  ["41", "9.5 / 10", "43", "27"],
  ["42", "10 / 10.5", "44", "28"],
];

const womenRows = [
  ["35", "5 / 5.5", "36", "22.5"],
  ["36", "6 / 6.5", "37", "23.5"],
  ["37", "6.5 / 7", "38", "24"],
  ["38", "7.5 / 8", "39", "24.5"],
];

function SizeTable({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <section className={styles.tableBlock} aria-label={`Tabla de tallas ${title.toLowerCase()}`}>
      <div className={styles.sectionTitle}>{title}</div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>COL</th>
            <th>US</th>
            <th className={styles.eur}>EUR</th>
            <th>CM</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${title}-${row.join("-")}`}>
              <td>{row[0]}</td>
              <td>{row[1]}</td>
              <td className={styles.eur}>{row[2]}</td>
              <td>{row[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default function SizeGuidePage() {
  return (
    <main className={styles.page}>
      <SiteHeader />

      <section className={styles.shell}>
        <article className={styles.guide}>
          <header className={styles.brand}>
            <div className={styles.brandName}>GIRTZ WEAR<sup>®</sup></div>
            <span className={styles.brandLine} aria-hidden="true" />
          </header>

          <h1 className={styles.title}>GUÍA DE TALLAS</h1>
          <p className={styles.subtitle}>Talla principal de referencia: EUR</p>

          <SizeTable title="HOMBRE" rows={menRows} />
          <SizeTable title="MUJER" rows={womenRows} />

          <section className={styles.reference} aria-label="Referencia de marquilla interna">
            <div className={styles.tongue} aria-hidden="true">
              <div className={styles.label}>
                <div className={styles.labelRule} />
                <div className={styles.labelSizes}>
                  <span>US</span><span>UK</span><span>EUR</span><span>CM</span>
                </div>
                <div className={styles.labelValues}>
                  <span>10</span><span>9</span><span>44</span><span>28</span>
                </div>
                <div className={styles.barcode} />
              </div>
            </div>
            <div className={styles.callout}>Referencia en la marquilla interna</div>
          </section>

          <p className={styles.footerNote}>
            Guía referencial. El tallaje puede variar según la marca y el modelo.<br />
            Para mayor precisión, compártenos una foto de la marquilla interna de uno de tus tenis.
          </p>

          <div className={styles.actions}>
            <Link href="/shop">VER CATÁLOGO Y TALLAS ↗</Link>
          </div>
        </article>
      </section>

      <SiteFooter />
    </main>
  );
}
