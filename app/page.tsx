"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type P = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  emoji: string;
};

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Home() {
  const [p, setP] = useState<P[]>([]);
  const [c, setC] = useState<Record<number, number>>({});

  useEffect(() => {
    fetch(API + "/api/products")
      .then((r) => r.json())
      .then(setP);
  }, []);

  const count = Object.values(c).reduce((a, b) => a + b, 0);

  function add(x: P) {
    setC((v) => ({
      ...v,
      [x.id]: Math.min((v[x.id] || 0) + 1, x.stock),
    }));
  }

  function go() {
    localStorage.setItem("matcha_cart", JSON.stringify(c));
    location.href = "/checkout";
  }

  return (
    <main>
      <nav className="navbar">
        <Link href="/" className="brand">
          MATCHA<span>HOUSE</span>
        </Link>
        <div className="navlinks">
          <a href="#menu">Menu</a>
          <a href="#about">Tentang</a>
          <Link href="/login">Admin / Staff</Link>
          <button className="cart-btn" onClick={go}>
            🛒 {count}
          </button>
        </div>
      </nav>

      <section className="hero">
        <div>
          <p className="eyebrow">PREMIUM JAPANESE MATCHA</p>
          <h1>Secangkir matcha untuk menemani harimu.</h1>
          <p className="hero-text">Matcha creamy, fresh, dan dibuat saat kamu pesan.</p>
          <a href="#menu" className="primary-btn">
            Lihat Menu
          </a>
        </div>
        <div className="hero-cup">🍵</div>
      </section>

      <section id="menu" className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">OUR MENU</p>
            <h2>Menu Matcha</h2>
          </div>
          <button className="outline-btn" onClick={go}>
            Checkout ({count})
          </button>
        </div>

        <div className="product-grid">
          {p.map((x) => (
            <article className="product-card" key={x.id}>
              <div className="product-emoji">{x.emoji}</div>
              <div className="product-info">
                <span className="tag">{x.category}</span>
                <h3>{x.name}</h3>
                <p>{x.description}</p>
                <div className="product-bottom">
                  <strong>Rp {Number(x.price).toLocaleString("id-ID")}</strong>
                  <button disabled={!x.stock} onClick={() => add(x)}>
                    {x.stock ? "Tambah" : "Habis"}
                  </button>
                </div>
                <small>Stok {x.stock}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="about section">
        <p className="eyebrow">ABOUT US</p>
        <h2>Matcha sederhana, rasa istimewa.</h2>
        <p>Kami menyajikan minuman berbasis matcha dengan rasa creamy dan seimbang.</p>
      </section>

      <footer>© 2026 Matcha House</footer>
    </main>
  );
}
