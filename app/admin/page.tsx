"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Admin() {
  const [u, setU] = useState<any>(null);
  const [s, setS] = useState<any>(null);

  useEffect(() => {
    const x = localStorage.getItem("matcha_user");

    if (!x) {
      location.href = "/login";
      return;
    }

    setU(JSON.parse(x));

    fetch(API + "/api/dashboard")
      .then((r) => r.json())
      .then(setS)
      .catch((err) => {
        console.error("Gagal mengambil data dashboard:", err);
      });
  }, []);

  function logout() {
    localStorage.removeItem("matcha_user");
    location.href = "/login";
  }

  return (
    <main className="admin-layout">
      <aside className="sidebar">
        <Link href="/admin" className="brand">
          MATCHA<span>HOUSE</span>
        </Link>

        <Link href="/admin" className="side-link active">
          📊 Dashboard
        </Link>

        <Link href="/admin/products" className="side-link">
          🍵 Menu & Stok
        </Link>

        <Link href="/admin/transactions" className="side-link">
          🧾 Transaksi
        </Link>

        <Link href="/admin/reports" className="side-link">
          📈 Laporan
        </Link>

        {u?.role === "admin" && (
          <Link href="/admin/users" className="side-link">
            👥 Pengguna
          </Link>
        )}

        <button className="logout" onClick={logout}>
          Keluar
        </button>
      </aside>

      <section className="admin-content">
        <div className="admin-top">
          <div>
            <p className="eyebrow">DASHBOARD</p>

            <h1>
              Halo, {u?.name || "Staff"} 👋
            </h1>
          </div>

          <Link href="/" className="outline-btn">
            Lihat Website
          </Link>
        </div>

        <div className="stat-grid">
          <div className="stat">
            <span>Total Menu</span>
            <b>{s?.products ?? "-"}</b>
          </div>

          <div className="stat">
            <span>Total Stok</span>
            <b>{s?.stock ?? "-"}</b>
          </div>

          <div className="stat">
            <span>Transaksi</span>
            <b>{s?.transactions ?? "-"}</b>
          </div>

          <div className="stat">
            <span>Penjualan</span>
            <b>
              Rp{" "}
              {Number(s?.revenue || 0).toLocaleString("id-ID")}
            </b>
          </div>
        </div>

        <div className="admin-card">
          <h2>Matcha House Admin</h2>

          <p>
            Kelola menu, stok, transaksi, pengguna, dan laporan
            dari sini.
          </p>
        </div>
      </section>
    </main>
  );
}