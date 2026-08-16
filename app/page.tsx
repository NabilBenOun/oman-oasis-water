"use client";

import { useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  desc: string;
  price: number;
  volume: string;
  tone: string;
  shape: "jug" | "large" | "small" | "pack" | "premium" | "sparkling";
  imageUrl: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Pure Gallon Jug 5L",
    desc: "Refillable family jug for kitchens, majlis rooms, and daily use.",
    price: 0.5,
    volume: "5L",
    tone: "aqua",
    shape: "jug",
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
  },
  {
    id: 2,
    name: "Oasis 1.5L Bottle",
    desc: "Crisp family bottle for meals, trips, and office refrigerators.",
    price: 0.15,
    volume: "1.5L",
    tone: "blue",
    shape: "large",
    imageUrl: "https://images.unsplash.com/photo-1600271572559-5f774f73fa48?w=400&q=80",
  },
  {
    id: 3,
    name: "Oasis 500ml Bottle",
    desc: "Single-serving bottle for daily hydration on the move.",
    price: 0.08,
    volume: "500ml",
    tone: "mint",
    shape: "small",
    imageUrl: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80",
  },
  {
    id: 4,
    name: "Mineral Spring 330ml",
    desc: "Compact bottle for hospitality trays, events, and children.",
    price: 0.06,
    volume: "330ml",
    tone: "gold",
    shape: "small",
    imageUrl: "https://images.unsplash.com/photo-1606168094336-48f205e182a8?w=400&q=80",
  },
  {
    id: 5,
    name: "Office Cooler Jug 19L",
    desc: "Large cooler replacement delivered fresh to your workplace.",
    price: 1.5,
    volume: "19L",
    tone: "aqua",
    shape: "jug",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  },
  {
    id: 6,
    name: "Family Pack 1.5L",
    desc: "Six-bottle value pack for weekly home stocking.",
    price: 0.8,
    volume: "6 pack",
    tone: "blue",
    shape: "pack",
    imageUrl: "https://images.unsplash.com/photo-1624958219527-9c2be66ca0c9?w=400&q=80",
  },
  {
    id: 7,
    name: "Premium Still 750ml",
    desc: "Elegant table bottle for restaurants and premium service.",
    price: 0.12,
    volume: "750ml",
    tone: "mint",
    shape: "premium",
    imageUrl: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&q=80",
  },
  {
    id: 8,
    name: "Sparkling Mineral 500ml",
    desc: "Light sparkle for dining, hosting, and refreshment.",
    price: 0.1,
    volume: "500ml",
    tone: "gold",
    shape: "sparkling",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80",
  },
];

const governorates = [
  "Muscat",
  "Dhofar",
  "Musandam",
  "Al Buraimi",
  "Al Dakhiliyah",
  "North Al Batinah",
  "South Al Batinah",
  "North Ash Sharqiyah",
  "South Ash Sharqiyah",
  "Al Dhahirah",
  "Al Wusta",
];

const faqs = [
  [
    "How fast is delivery?",
    "Muscat orders are usually confirmed the same day. Other governorates are scheduled based on route availability.",
  ],
  [
    "Can I order for an office?",
    "Yes. Weekly, biweekly, and monthly delivery plans are available for offices, clinics, restaurants, and retail teams.",
  ],
  [
    "Do you collect empty cooler bottles?",
    "Yes. Empty 19L bottles are collected during the next delivery and rotated through the refill program.",
  ],
  [
    "Which payment methods are available?",
    "You can confirm by phone or WhatsApp and choose card, transfer, or cash on delivery depending on your area.",
  ],
];

function money(value: number) {
  return `ر.ع. ${value.toFixed(3)}`;
}

export default function Home() {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const cartItems = useMemo(
    () =>
      products
        .map((product) => ({ ...product, quantity: cart[product.id] ?? 0 }))
        .filter((product) => product.quantity > 0),
    [cart],
  );

  const total = cartItems.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0,
  );

  function addToCart(id: number) {
    setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));
    setCartOpen(true);
  }

  function updateQuantity(id: number, direction: 1 | -1) {
    setCart((current) => {
      const next = (current[id] ?? 0) + direction;
      const copy = { ...current };
      if (next <= 0) {
        delete copy[id];
      } else {
        copy[id] = next;
      }
      return copy;
    });
  }

  return (
    <main className="site-shell">
      <header className="header-wrap">
        <nav className="topbar" aria-label="Main navigation">
          <a className="brand" href="#home" aria-label="Oasis Oman Water home">
            <span className="brand-mark">و</span>
            <span>
              <strong>مياه الواحة</strong>
              <small>Oman Al Waha Water</small>
            </span>
          </a>
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#products">Products</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="nav-tools">
            <select aria-label="Language selector" defaultValue="en">
              <option value="en">English</option>
              <option value="ar">العربية</option>
              <option value="hi">हिन्दी</option>
              <option value="ur">اردو</option>
            </select>
            <button
              className="cart-button"
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
            >
              Cart
              <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </button>
          </div>
        </nav>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy">
          <p className="hero-badge">Oman's premium water delivery</p>
          <h1>Pure hydration, delivered.</h1>
          <p className="hero-text">
            Premium bottled water for your family and office across the
            governorates of Oman.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#products">
              Order Now
            </a>
            <a className="secondary-button" href="#products">
              View Products
            </a>
          </div>
          <div className="hero-stats" aria-label="Service highlights">
            <span>
              <strong>10k+</strong>
              Families
            </span>
            <span>
              <strong>11</strong>
              Governorates
            </span>
            <span>
              <strong>ISO</strong>
              Certified
            </span>
            <span>
              <strong>Free</strong>
              Delivery
            </span>
          </div>
        </div>
        <div className="hero-card" aria-label="Water products preview">
          <img src="/hero-water.png" alt="Premium bottled water products" />
          <div className="hero-product-strip">
            <span>330ml</span>
            <span>500ml</span>
            <span>1.5L</span>
            <span>19L</span>
          </div>
        </div>
      </section>

      <section className="section about-section" id="about">
        <div className="about-media">
          <img src="/hero-water.png" alt="Water bottle lineup" />
        </div>
        <div>
          <p className="eyebrow">About Us</p>
          <h2>Fresh water, simple ordering, reliable routes.</h2>
          <p>
            We deliver carefully packed bottled water to homes, offices, and
            events with a clean ordering experience, quick confirmation, and
            flexible delivery scheduling.
          </p>
          <div className="feature-list">
            <span>Quality checked source</span>
            <span>Home and office plans</span>
            <span>Cooler bottle exchange</span>
          </div>
        </div>
      </section>

      <section className="section products-section" id="products">
        <div className="section-heading center">
          <p className="eyebrow">Our Premium Selection</p>
          <h2>Choose your water.</h2>
          <p>
            Every product card behaves like the old shop: browse, add, review
            your cart, then continue to delivery details.
          </p>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <div
                className={`product-visual ${product.tone} ${product.shape}`}
                aria-label={`${product.name} product image`}
              >
                <img src={product.imageUrl} alt={product.name} />
                <span className="volume-label">{product.volume}</span>
              </div>
              <div className="product-copy">
                <h3>{product.name}</h3>
                <p>{product.desc}</p>
              </div>
              <div className="price-row">
                <strong>{money(product.price)}</strong>
                <button type="button" onClick={() => addToCart(product.id)}>
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section delivery-section" id="delivery">
        <div className="section-heading center">
          <p className="eyebrow">Free Delivery</p>
          <h2>Across all governorates and states of Oman.</h2>
        </div>
        <div className="map-panel">
          <div className="map-card">
            <span className="map-pin">Muscat</span>
            <span className="map-pin second">Dhofar</span>
            <span className="map-pin third">Batinah</span>
            <div className="map-rings" />
          </div>
          <div className="region-grid">
            {governorates.map((region) => (
              <span key={region}>{region}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <div className="section-heading center">
          <p className="eyebrow">FAQ</p>
          <h2>Questions before checkout?</h2>
        </div>
        <div className="faq-list">
          {faqs.map(([question, answer], index) => (
            <details key={question} open={index === 0}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section contact-section" id="contact">
        <div className="section-heading center">
          <p className="eyebrow">Contact Us</p>
          <h2>We are here to help.</h2>
        </div>
        <div className="contact-grid">
          <div className="contact-cards">
            <a href="tel:+96893649190">Phone: +968 9364 9190</a>
            <a href="https://wa.me/96893649190">WhatsApp: +968 9364 9190</a>
            <a href="mailto:info@aquapure.om">Email: info@aquapure.om</a>
            <span>Location: Muscat, Sultanate of Oman</span>
            <span>Hours: Sat - Thu, 8:00 AM - 10:00 PM</span>
          </div>
          <form
            className="contact-form"
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
          >
            {sent ? (
              <div className="success-message">
                Message sent. We will get back to you within 24 hours.
              </div>
            ) : (
              <>
                <label>
                  Your Name
                  <input placeholder="Enter your name" />
                </label>
                <label>
                  Email Address
                  <input type="email" placeholder="your@email.com" />
                </label>
                <label>
                  Message
                  <textarea placeholder="How can we help?" />
                </label>
                <button type="submit">Send Message</button>
              </>
            )}
          </form>
        </div>
      </section>

      <footer className="footer">
        <div>
          <strong>مياه الواحة</strong>
          <p>Premium hydration delivered across Oman.</p>
        </div>
        <nav aria-label="Policy links">
          <a href="#home">Privacy Policy</a>
          <a href="#home">Terms & Conditions</a>
          <a href="#delivery">Delivery Policy</a>
          <a href="#contact">Refund Policy</a>
        </nav>
      </footer>

      <a className="floating-whatsapp" href="https://wa.me/96893649190">
        WhatsApp
      </a>

      {cartOpen && (
        <div className="drawer-backdrop" onClick={() => setCartOpen(false)}>
          <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2>Your Cart</h2>
              <button type="button" onClick={() => setCartOpen(false)}>
                Close
              </button>
            </div>
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <strong>Your cart is empty.</strong>
                <p>Add some products to get started.</p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <div>
                        <strong>{item.name}</strong>
                        <span>{money(item.price)}</span>
                      </div>
                      <div className="quantity">
                        <button type="button" onClick={() => updateQuantity(item.id, -1)}>
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, 1)}>
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-total">
                  <span>Total</span>
                  <strong>{money(total)}</strong>
                </div>
                <button
                  className="checkout-button"
                  type="button"
                  onClick={() => {
                    setCartOpen(false);
                    setCheckoutOpen(true);
                  }}
                >
                  Proceed to Checkout
                </button>
              </>
            )}
          </aside>
        </div>
      )}

      {checkoutOpen && (
        <div className="drawer-backdrop" onClick={() => setCheckoutOpen(false)}>
          <aside className="checkout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <h2>Delivery Information</h2>
                <p>Fill in your details and we will deliver to your door.</p>
              </div>
              <button type="button" onClick={() => setCheckoutOpen(false)}>
                Close
              </button>
            </div>
            <form className="checkout-grid">
              <label>
                Full Name
                <input placeholder="Enter your full name" />
              </label>
              <label>
                Mobile Number
                <input placeholder="+968 XXXX XXXX" />
              </label>
              <label>
                Email Address
                <input type="email" placeholder="your@email.com" />
              </label>
              <label>
                Governorate
                <select defaultValue="">
                  <option value="" disabled>
                    Select your governorate
                  </option>
                  {governorates.map((region) => (
                    <option key={region}>{region}</option>
                  ))}
                </select>
              </label>
              <label className="wide">
                Full Delivery Address
                <textarea placeholder="Street, building, area..." />
              </label>
              <div className="order-summary wide">
                <span>{cartItems.length} items</span>
                <strong>{money(total)}</strong>
              </div>
              <button className="checkout-button wide" type="button">
                Pay Now
              </button>
              <p className="free-note wide">
                Free delivery to all governorates and states of Oman.
              </p>
            </form>
          </aside>
        </div>
      )}
    </main>
  );
}
