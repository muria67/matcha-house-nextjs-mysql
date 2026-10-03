"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type P = {
  id: number;
  name: string;
  price: number;
  stock: number;
  emoji: string;
};

type Receipt = {
  transaction_id: number;
  customer_name: string;
  phone: string;
  items: {
    id: number;
    name: string;
    price: number;
    qty: number;
    subtotal: number;
    emoji: string;
  }[];
  total: number;
  paid: number;
  change: number;
  payment_method: string;
  date: string;
};

export default function Checkout() {
  const [products, setProducts] = useState<P[]>([]);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [paid, setPaid] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("matcha_cart");

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    fetch(API + "/api/products")
      .then((r) => r.json())
      .then((data) => setProducts(data))
      .catch(() => {
        setMsg("Gagal mengambil data produk.");
      });
  }, []);

  const rows = products
    .filter((product) => cart[product.id])
    .map((product) => ({
      ...product,
      qty: cart[product.id],
      subtotal: Number(product.price) * cart[product.id],
    }));

  const total = rows.reduce(
    (sum, product) => sum + product.subtotal,
    0
  );

  function qty(id: number, newQty: number) {
    const next = { ...cart };

    if (newQty <= 0) {
      delete next[id];
    } else {
      next[id] = newQty;
    }

    setCart(next);

    localStorage.setItem(
      "matcha_cart",
      JSON.stringify(next)
    );
  }

  async function pay() {
    setMsg("");

    if (!name.trim()) {
      setMsg("Nama wajib diisi.");
      return;
    }

    if (!total) {
      setMsg("Keranjang kosong.");
      return;
    }

    if (!paid || Number(paid) < total) {
      setMsg("Pembayaran kurang.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        API + "/api/public/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_name: name,
            phone,
            paid: Number(paid),
            items: rows.map((product) => ({
              product_id: product.id,
              qty: product.qty,
            })),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMsg(data.message || "Pembayaran gagal.");
        setLoading(false);
        return;
      }

      /*
        SIMPAN DATA UNTUK STRUK
      */

      const receipt: Receipt = {
        transaction_id: data.transaction_id,
        customer_name: name,
        phone: phone,
        items: rows.map((product) => ({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          qty: product.qty,
          subtotal: product.subtotal,
          emoji: product.emoji,
        })),
        total: total,
        paid: Number(paid),
        change: Number(data.change),
        payment_method: "Tunai",
        date: new Date().toISOString(),
      };

      localStorage.setItem(
        "matcha_receipt",
        JSON.stringify(receipt)
      );

      localStorage.removeItem("matcha_cart");

      setCart({});

      /*
        PINDAH KE HALAMAN STRUK
      */

      window.location.href = "/receipt";

    } catch (error) {
      console.error(error);
      setMsg(
        "Tidak dapat terhubung ke server. Pastikan backend berjalan."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-wrap">

      {/* NAVBAR */}

      <nav className="navbar">

        <Link href="/" className="brand">
          MATCHA<span>HOUSE</span>
        </Link>

        <Link href="/">
          ← Menu
        </Link>

      </nav>

      {/* CHECKOUT */}

      <section className="checkout-layout">

        {/* =========================
            PESANAN
        ========================= */}

        <div className="panel">

          <p className="eyebrow">
            CHECKOUT
          </p>

          <h1>
            Pesanan kamu
          </h1>

          {rows.length === 0 ? (

            <div className="empty-cart">

              <div className="empty-cart-icon">
                🍵
              </div>

              <h3>
                Keranjang masih kosong
              </h3>

              <p>
                Yuk pilih minuman matcha favorit kamu.
              </p>

              <Link
                href="/"
                className="primary-btn"
              >
                Lihat Menu
              </Link>

            </div>

          ) : (

            <>

              {rows.map((product) => (

                <div
                  className="cart-row"
                  key={product.id}
                >

                  <div className="mini-emoji">
                    {product.emoji}
                  </div>

                  <div className="cart-product">

                    <b>
                      {product.name}
                    </b>

                    <span>
                      Rp{" "}
                      {Number(
                        product.price
                      ).toLocaleString("id-ID")}
                    </span>

                  </div>

                  <div className="qty">

                    <button
                      type="button"
                      onClick={() =>
                        qty(
                          product.id,
                          product.qty - 1
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {product.qty}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        qty(
                          product.id,
                          product.qty + 1
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                  <strong>
                    Rp{" "}
                    {product.subtotal.toLocaleString(
                      "id-ID"
                    )}
                  </strong>

                </div>

              ))}

              <div className="total-line">

                <span>
                  Total
                </span>

                <b>
                  Rp{" "}
                  {total.toLocaleString(
                    "id-ID"
                  )}
                </b>

              </div>

            </>

          )}

        </div>


        {/* =========================
            DATA PELANGGAN
        ========================= */}

        <div className="panel">

          <p className="eyebrow">
            PELANGGAN
          </p>

          <h2>
            Data pemesan
          </h2>

          <label>
            Nama

            <input
              type="text"
              placeholder="Masukkan nama"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </label>


          <label>
            No. HP

            <input
              type="text"
              placeholder="08xxxxxxxxxx"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
            />

          </label>


          <label>
            Total Pembayaran

            <div className="payment-total">
              Rp{" "}
              {total.toLocaleString(
                "id-ID"
              )}
            </div>

          </label>


          <label>
            Uang Dibayar

            <input
              type="number"
              placeholder="Masukkan jumlah uang"
              value={paid}
              onChange={(e) =>
                setPaid(e.target.value)
              }
            />

          </label>


          {/* KEMBALIAN */}

          {Number(paid) >= total &&
            total > 0 && (

              <div className="change-preview">

                <span>
                  Kembalian
                </span>

                <strong>
                  Rp{" "}
                  {(
                    Number(paid) - total
                  ).toLocaleString(
                    "id-ID"
                  )}
                </strong>

              </div>

            )}


          {/* MESSAGE */}

          {msg && (

            <p className="message">
              {msg}
            </p>

          )}


          {/* BUTTON */}

          <button
            className="primary-btn wide"
            onClick={pay}
            disabled={loading || rows.length === 0}
          >

            {loading
              ? "Memproses Pembayaran..."
              : "💳 Bayar Sekarang"}

          </button>

        </div>

      </section>

    </main>
  );
}