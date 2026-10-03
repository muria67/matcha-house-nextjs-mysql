"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ReceiptItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
  subtotal: number;
  emoji: string;
};

type Receipt = {
  transaction_id: number;
  customer_name: string;
  phone: string;
  items: ReceiptItem[];
  total: number;
  paid: number;
  change: number;
  payment_method: string;
  date: string;
};

export default function ReceiptPage() {
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  useEffect(() => {
    const savedReceipt = localStorage.getItem("matcha_receipt");

    if (savedReceipt) {
      setReceipt(JSON.parse(savedReceipt));
    }
  }, []);

  if (!receipt) {
    return (
      <main className="receipt-page">
        <div className="receipt-card">
          <h2>Struk tidak ditemukan</h2>

          <Link href="/" className="primary-btn">
            Kembali ke Menu
          </Link>
        </div>
      </main>
    );
  }

  const date = new Date(receipt.date);

  return (
    <main className="receipt-page">

      <div className="receipt-card">

        {/* HEADER */}
        <div className="receipt-header">
          <div className="receipt-logo">🍵</div>

          <h1>MATCHA HOUSE</h1>

          <p>Fresh Matcha, Happy Mood</p>
        </div>

        <div className="receipt-success">
          ✓ PEMBAYARAN BERHASIL
        </div>

        {/* INFO TRANSAKSI */}
        <div className="receipt-info">

          <div>
            <span>No. Transaksi</span>
            <strong>
              TRX-{String(receipt.transaction_id).padStart(4, "0")}
            </strong>
          </div>

          <div>
            <span>Tanggal</span>
            <strong>
              {date.toLocaleDateString("id-ID")}
            </strong>
          </div>

          <div>
            <span>Pelanggan</span>
            <strong>{receipt.customer_name}</strong>
          </div>

          {receipt.phone && (
            <div>
              <span>No. HP</span>
              <strong>{receipt.phone}</strong>
            </div>
          )}

        </div>

        <hr />

        {/* DAFTAR PRODUK */}
        <div className="receipt-items">

          {receipt.items.map((item) => (

            <div className="receipt-item" key={item.id}>

              <div className="receipt-item-name">

                <span className="receipt-emoji">
                  {item.emoji}
                </span>

                <div>
                  <strong>{item.name}</strong>

                  <small>
                    {item.qty} × Rp{" "}
                    {item.price.toLocaleString("id-ID")}
                  </small>
                </div>

              </div>

              <strong>
                Rp {item.subtotal.toLocaleString("id-ID")}
              </strong>

            </div>

          ))}

        </div>

        <hr />

        {/* PEMBAYARAN */}
        <div className="receipt-total">

          <div>
            <span>Subtotal</span>
            <span>
              Rp {receipt.total.toLocaleString("id-ID")}
            </span>
          </div>

          <div>
            <span>Metode Pembayaran</span>
            <span>{receipt.payment_method}</span>
          </div>

          <div>
            <span>Uang Dibayar</span>
            <span>
              Rp {receipt.paid.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="grand-total">
            <span>Total</span>

            <strong>
              Rp {receipt.total.toLocaleString("id-ID")}
            </strong>
          </div>

          <div className="change">
            <span>Kembalian</span>

            <strong>
              Rp {receipt.change.toLocaleString("id-ID")}
            </strong>
          </div>

        </div>

        <div className="receipt-footer">

          <p>Terima kasih sudah membeli di</p>

          <strong>MATCHA HOUSE 🍵</strong>

          <small>
            Simpan struk ini sebagai bukti pembayaran.
          </small>

        </div>

        {/* BUTTON */}
        <div className="receipt-actions">

          <button
            className="primary-btn"
            onClick={() => window.print()}
          >
            🖨️ Cetak Struk
          </button>

          <Link
            href="/"
            className="outline-btn"
          >
            ← Kembali ke Menu
          </Link>

        </div>

      </div>

    </main>
  );
}