'use client';

import { useState, useEffect, useMemo } from 'react';
import { PRODUCTS, HOT_SKUS, yen, type Product } from '@/lib/products';

type CartItem = {
  sku: string;
  name: string;
  price: number;
  img: string;
  variant: string;
  q: number;
};

const COLORWAYS = [
  { c: '#e8e3d6', label: 'BONE / 01' },
  { c: '#0f0f0f', label: 'OBSIDIAN / 02' },
  { c: '#7a6f5e', label: 'BUNKER / 03' },
  { c: '#b71d0d', label: 'HAZARD / 04' },
];

const SIZES = [
  { label: 'S · 60mm', oos: false },
  { label: 'M · 90mm', oos: false },
  { label: 'L · 120mm', oos: false },
  { label: 'XL · 150mm', oos: true },
];

const FILTERS = ['ALL', 'KEYRINGS', 'PENDANTS', 'RINGS', 'OBJECTS', 'ARCHIVE'];

const GALLERY = [
  { src: '/assets/02.png', tag: '// 01_CONCRETE', cls: 'main' },
  { src: '/assets/01.png', tag: '// 02_MACRO', cls: 'side1' },
  { src: '/assets/04.png', tag: '// 03_LIGHT', cls: 'side2' },
  { src: '/assets/03.png', tag: '// 04_LEATHER', cls: 'strip1' },
  { src: '/assets/06.png', tag: '// 05_BLOCK', cls: 'strip2' },
  { src: '/assets/05.png', tag: '// 06_WORN', cls: 'strip3' },
];

function badgeClass(badge: string, sku: string) {
  if (badge === '1 OF 1') return 'hot';
  if (HOT_SKUS.includes(sku)) return 'dim';
  return '';
}

export default function Page() {
  const [cart, setCart] = useState<CartItem[]>([
    { sku: 'BREE-ERT-001', name: 'BONE KEYRING', price: 18400, img: '/assets/02.png', variant: 'BONE / 01 · M · 90mm', q: 1 },
    { sku: 'BREE-ERT-002', name: 'RIB PENDANT', price: 14200, img: '/assets/04.png', variant: 'OBSIDIAN / 02', q: 1 },
  ]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [color, setColor] = useState(COLORWAYS[0]);
  const [size, setSize] = useState(SIZES[1]);
  const [qty, setQty] = useState(1);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [tokyoTime, setTokyoTime] = useState('--:--');
  const [galleryImages, setGalleryImages] = useState(GALLERY);

  const total = useMemo(() => cart.reduce((s, c) => s + c.price * c.q, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((s, c) => s + c.q, 0), [cart]);

  useEffect(() => {
    const tick = () => {
      const t = new Date().toLocaleTimeString('en-GB', {
        timeZone: 'Asia/Tokyo',
        hour: '2-digit',
        minute: '2-digit',
      });
      setTokyoTime(t);
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  function addToCart(p: Product, variant = 'DEFAULT', q = 1) {
    setCart((prev) => {
      const ex = prev.find((c) => c.sku === p.sku && c.variant === variant);
      if (ex) {
        return prev.map((c) =>
          c.sku === p.sku && c.variant === variant ? { ...c, q: c.q + q } : c,
        );
      }
      return [...prev, { sku: p.sku, name: p.name, price: p.price, img: p.image_url, variant, q }];
    });
    setDrawerOpen(true);
  }

  function removeFromCart(idx: number) {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  }

  function swapGalleryMain(idx: number) {
    setGalleryImages((prev) => {
      const arr = [...prev];
      [arr[0], arr[idx]] = [arr[idx], arr[0]];
      return arr;
    });
  }

  return (
    <>
      {/* TOPBAR */}
      <header className="topbar">
        <div className="left">
          <a href="#" className="brand">BREE</a>
          <a href="#shop" className="nav-link">Shop</a>
          <a href="#drop" className="nav-link">Drop 001</a>
          <a href="#manifesto" className="nav-link">Doctrine</a>
          <a href="#editorial" className="nav-link">Editorial</a>
        </div>
        <div className="right">
          <span className="pill meta"><span className="dot"></span>LIVE / TOKYO {tokyoTime}</span>
          <a className="meta" href="#">JP / EN</a>
          <a className="meta" href="#">Search</a>
          <button className="iconbtn" onClick={() => setDrawerOpen(true)}>
            Cart [<span className="cart-count">{String(cartCount).padStart(2, '0')}</span>]
          </button>
        </div>
      </header>

      <div className="marq">
        <div className="marq-track">
          <span><b>DROP 001</b> — BRUTAL RAW EQUIPMENT</span>
          <span>FREE SHIPPING OVER <b>¥5,000</b></span>
          <span><b>BREE-ERT-001</b> NOW SHIPPING WORLDWIDE</span>
          <span>HAND FINISHED IN <b>OSAKA</b></span>
          <span>EDITION OF <b>240</b></span>
          <span><b>DROP 001</b> — BRUTAL RAW EQUIPMENT</span>
          <span>FREE SHIPPING OVER <b>¥5,000</b></span>
          <span><b>BREE-ERT-001</b> NOW SHIPPING WORLDWIDE</span>
          <span>HAND FINISHED IN <b>OSAKA</b></span>
          <span>EDITION OF <b>240</b></span>
        </div>
      </div>

      {/* HERO */}
      <section className="hero" id="top">
        <div className="hero-grid"></div>
        <div className="hero-readout">
          <div>OBJECT_ID <b>// BREE-ERT-001</b></div>
          <div>CATALOG <b>// SS26 / DROP-001</b></div>
          <div>EDITION <b>// 240 UNITS</b></div>
          <div>STATUS <b>// LIVE</b></div>
        </div>
        <div className="hero-inner">
          <div className="hero-meta">
            <div className="stamp">BREE<b>BRUTAL RAW EQUIPMENT</b></div>
            <h1 className="hero-title">
              <span className="row">BONE</span>
              <span className="row"><em>KEY</em><span className="slash">/</span>RING</span>
            </h1>
            <div className="hero-sub">
              <p><b>OBJECT 001 — </b>3Dプリントによる骨格構造の身体装具。コンクリート、鉄、皮膚に呼応するために設計された、生のままの装備品。</p>
              <p><b>EDITION OF 240 — </b>各個体は手仕上げにより微細な差異を持つ。同じものは二つと存在しない。Made in Osaka.</p>
            </div>
            <div className="hero-cta">
              <a href="#drop" className="btn">SHOP DROP 001 <span className="arr">→</span></a>
              <a href="#manifesto" className="btn ghost">READ DOCTRINE</a>
            </div>
          </div>
          <div className="hero-img">
            <img src="/assets/02.png" alt="BREE-ERT-001 on concrete" />
            <span className="corner c1"></span><span className="corner c2"></span><span className="corner c3"></span><span className="corner c4"></span>
            <div className="crosshair"></div>
            <div className="tag">REF // BREE-ERT-001 · CONCRETE STUDY</div>
          </div>
        </div>
      </section>

      {/* DROP / PDP */}
      <section id="drop">
        <div className="section-head">
          <div className="section-num">[ 01 ]</div>
          <h2 className="section-title">DROP <em>001</em> / OBJECT 001</h2>
          <div className="section-meta">240 / 240 <b>AVAILABLE</b><br />SHIPS WITHIN 72H</div>
        </div>
        <div className="drop">
          <div className="drop-gallery">
            {galleryImages.map((g, i) => (
              <div
                key={g.src + i}
                className={`g ${g.cls}`}
                onClick={() => i !== 0 && swapGalleryMain(i)}
              >
                <img src={g.src} alt="" />
                <div className="gtag">{g.tag}</div>
              </div>
            ))}
          </div>

          <aside className="pdp">
            <div className="obj-id">
              <span>OBJECT_ID <b>BREE-ERT-001</b></span>
              <span>EDITION <b>240</b></span>
            </div>
            <h2>BONE<br />KEYRING</h2>
            <p className="lede">
              <b>身体の装具として再構築された骨格。</b>
              3Dプリント特有の積層を意図的に残した raw finish。
              コットンロープ、ステンレスリング、アルミバックル付属。
              各個体に手刻みのシリアルナンバー。
            </p>

            <div className="price-row">
              <div className="price">¥18,400 <small>JPY · TAX INCL.</small></div>
              <div className="stock">IN STOCK</div>
            </div>

            <div className="opt-grp">
              <h4>COLORWAY <em>{color.label}</em></h4>
              <div className="swatches">
                {COLORWAYS.map((cw) => (
                  <button
                    key={cw.label}
                    className={`sw ${color.label === cw.label ? 'active' : ''}`}
                    style={{ ['--c' as any]: cw.c } as React.CSSProperties}
                    onClick={() => setColor(cw)}
                  >
                    <span className="dot"></span>
                    <span className="lab">{cw.label.split(' / ')[1]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="opt-grp">
              <h4>SIZE / FORMAT</h4>
              <div className="sizes">
                {SIZES.map((sz) => (
                  <button
                    key={sz.label}
                    className={`sz ${size.label === sz.label ? 'active' : ''} ${sz.oos ? 'oos' : ''}`}
                    onClick={() => !sz.oos && setSize(sz)}
                  >
                    {sz.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="opt-grp">
              <h4>QUANTITY</h4>
              <div className="qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                <input value={qty} onChange={(e) => setQty(Math.max(1, Math.min(99, +e.target.value || 1)))} />
                <button onClick={() => setQty((q) => Math.min(99, q + 1))}>+</button>
              </div>
            </div>

            <div className="actions">
              <button
                className="btn"
                onClick={() => {
                  const p = PRODUCTS[0];
                  addToCart(p, `${color.label} · ${size.label}`, qty);
                }}
              >
                ADD TO CART <span className="arr">→</span>
              </button>
              <button className="btn ghost" title="Save">♡</button>
            </div>

            <div className="specs">
              <div><span>MATERIAL</span><span>PLA-X / RAW</span></div>
              <div><span>WEIGHT</span><span>72g</span></div>
              <div><span>LENGTH</span><span>90mm</span></div>
              <div><span>HARDWARE</span><span>SUS304</span></div>
              <div><span>ORIGIN</span><span>OSAKA / JP</span></div>
              <div><span>EDITION</span><span>240 UNITS</span></div>
            </div>

            <div className="accord">
              <details open>
                <summary>DESCRIPTION</summary>
                <div className="ac-body">
                  <b>BONE KEYRING</b> は身体に対する違和感を装具として記録する装置。
                  人体の脊椎・肋骨・骨盤の構造をリミックスし、3Dプリンタで直接出力。
                  研磨を最小限に留めた raw finish により、機械の手跡を皮膚で直接読み取れる。
                </div>
              </details>
              <details>
                <summary>CARE / HANDLING</summary>
                <div className="ac-body">
                  高温環境下での放置を避けてください（耐熱 60°C）。
                  汚れは中性洗剤と柔らかい布で。研磨剤・有機溶剤の使用は <b>禁止</b>。
                  ロープ部分は手洗い乾燥。
                </div>
              </details>
              <details>
                <summary>SHIPPING / RETURNS</summary>
                <div className="ac-body">
                  国内 72時間以内発送。
                  ¥5,000 以上で送料無料（未満は ¥800）。
                  未使用に限り 14日以内の返品可。エディションナンバーが破損したものは対象外。
                </div>
              </details>
              <details>
                <summary>AUTHENTICITY</summary>
                <div className="ac-body">
                  各個体に <b>BREE-ERT-001 / NNN-240</b> の手刻みシリアル。
                  付属の認証カードで生産ログ・出力時間・素材ロットが照合可能。
                </div>
              </details>
            </div>
          </aside>
        </div>
      </section>

      {/* CATALOG */}
      <section id="shop" style={{ paddingTop: 40 }}>
        <div className="section-head">
          <div className="section-num">[ 02 ]</div>
          <h2 className="section-title">CATALOG / <em>EQUIPMENT</em></h2>
          <div className="section-meta">{PRODUCTS.length} / {PRODUCTS.length} <b>OBJECTS</b><br />UPDATED 04.29.26</div>
        </div>
        <div className="filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`chip ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
          <button className="chip" style={{ marginLeft: 'auto' }}>SORT / NEWEST ↓</button>
        </div>
        <div className="catalog">
          {PRODUCTS.map((it) => (
            <div key={it.sku} className="card">
              <div className="card-img">
                <img className="main" src={it.image_url} alt={it.name} loading="lazy" />
                <img className="alt" src={it.image_alt_url} alt={it.name + ' alt'} loading="lazy" />
                {it.badge && <span className={`badge ${badgeClass(it.badge, it.sku)}`}>{it.badge}</span>}
                <button
                  className="qa"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(it, 'DEFAULT', 1);
                  }}
                >
                  + QUICK ADD
                </button>
              </div>
              <div className="card-meta"><span>{it.sku}</span><span>ED / {it.edition_total}</span></div>
              <h3>{it.name}</h3>
              <div className="pp">
                <span className="pr">{yen(it.price)}</span>
                <span className="swp">
                  <i style={{ background: '#e8e3d6' }}></i>
                  <i style={{ background: '#0f0f0f' }}></i>
                  <i style={{ background: '#7a6f5e' }}></i>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="manifesto" id="manifesto">
        <div className="manifesto-inner">
          <h2>WE<br />BUILD<br /><em>EQUIPMENT,</em><br /><span className="hot">NOT</span><br />JEWELRY.</h2>
          <div className="manifesto-body">
            <p><b>BREE = BRUTAL RAW EQUIPMENT.</b></p>
            <p>BREEは身体のための装具を作るスタジオです。装飾ではなく、装備。コンクリートと皮膚、鉄と布、骨と機械の境界を、最小限のオブジェクトで翻訳します。</p>
            <p className="pull">&quot;装備は嘘をつかない。&quot;</p>
            <p>すべてのオブジェクトは大阪の小さなラボで、3Dプリンタと手仕事の往復によって生まれます。研磨で消える前の機械の手跡、レイヤーラインの質感、わずかな歪み——それらは欠陥ではなく、出力ログそのものです。</p>
            <p><b>240</b> という数字は、私たちが一度に責任を持てる単位です。量産はしません。エディションが終わった OBJECT は、再びリリースされません。</p>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section>
        <div className="section-head">
          <div className="section-num">[ 03 ]</div>
          <h2 className="section-title">PROCESS / <em>04 STEPS</em></h2>
          <div className="section-meta">FROM CAD TO HAND<br /><b>72H AVERAGE</b></div>
        </div>
        <div className="process">
          <div className="step"><div className="n">01</div><h3>SCAN / SCULPT</h3><p>CTスキャンと彫塑の往復。骨格の構造を解体し、装具として再構築する。</p></div>
          <div className="step"><div className="n"><em>02</em></div><h3>PRINT / RAW</h3><p>FDM 3Dプリンタで直接出力。レイヤーラインは消さない。機械の手跡が素材になる。</p></div>
          <div className="step"><div className="n">03</div><h3>FINISH / HAND</h3><p>大阪のラボで手仕上げ。バリ取りとロープ・金具の組み付けを 1点ずつ行う。</p></div>
          <div className="step"><div className="n"><em>04</em></div><h3>SERIAL / SHIP</h3><p>個体番号を手刻み。認証カードと共に 72時間以内にお届け。</p></div>
        </div>
      </section>

      {/* EDITORIAL */}
      <section id="editorial">
        <div className="section-head">
          <div className="section-num">[ 04 ]</div>
          <h2 className="section-title">EDITORIAL / <em>FIELD</em></h2>
          <div className="section-meta">PHOTOGRAPHED IN<br /><b>OSAKA / KYOTO / TOKYO</b></div>
        </div>
        <div className="ed">
          <div className="ed-cell tall"><img src="/assets/05.png" alt="" /><div className="stamp">FIELD_01<b>WORN ON BODY</b><i>SS26 — TOKYO</i></div></div>
          <div className="ed-cell"><img src="/assets/04.png" alt="" /><div className="stamp">FIELD_02<b>SUSPENDED</b><i>SS26 — KYOTO</i></div></div>
          <div className="ed-cell"><img src="/assets/03.png" alt="" /><div className="stamp">FIELD_03<b>STILL LIFE / LEATHER</b><i>SS26 — OSAKA</i></div></div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="news">
        <div className="news-inner">
          <h2>JOIN THE <em>SIGNAL</em></h2>
          <p>新作 OBJECT のリリース、エディションの再発、フィールドテストへの招待を最初に受け取る。</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = e.currentTarget;
              const btn = f.querySelector('button');
              const input = f.querySelector('input') as HTMLInputElement | null;
              if (btn) btn.textContent = 'RECEIVED ✓';
              if (input) input.value = '';
            }}
          >
            <input type="email" placeholder="YOU@DOMAIN.COM" required />
            <button type="submit">TRANSMIT →</button>
          </form>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '.16em', color: 'var(--ash)', textTransform: 'uppercase' }}>
            NO SPAM. NO ALGORITHMS. UNSUBSCRIBE ANYTIME.
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="foot-top">
          <div className="foot-brand">
            <div className="lg">BR<em>EE</em></div>
            <p>BRUTAL RAW EQUIPMENT — 大阪を拠点とする身体装具スタジオ。エディションは 240 体まで。</p>
          </div>
          <div className="foot-col">
            <h4>SHOP</h4>
            <ul><li><a href="#">DROP 001</a></li><li><a href="#">CATALOG</a></li><li><a href="#">ARCHIVE</a></li><li><a href="#">GIFT CARD</a></li></ul>
          </div>
          <div className="foot-col">
            <h4>STUDIO</h4>
            <ul><li><a href="#">DOCTRINE</a></li><li><a href="#">PROCESS</a></li><li><a href="#">EDITORIAL</a></li><li><a href="#">PRESS</a></li></ul>
          </div>
          <div className="foot-col">
            <h4>SUPPORT</h4>
            <ul><li><a href="#">SHIPPING</a></li><li><a href="#">RETURNS</a></li><li><a href="#">AUTHENTICITY</a></li><li><a href="#">CONTACT</a></li></ul>
          </div>
        </div>
        <div className="foot-bot">
          <div>© 2026 BREE STUDIO / OSAKA · BREE-ERT-001</div>
          <div>TERMS · PRIVACY · IG / @bree.equipment</div>
        </div>
      </footer>

      {/* CART DRAWER */}
      <div className={`drawer-back ${drawerOpen ? 'on' : ''}`} onClick={() => setDrawerOpen(false)}></div>
      <aside className={`drawer ${drawerOpen ? 'on' : ''}`}>
        <div className="drawer-head">
          <span>CART [ <b>{String(cartCount).padStart(2, '0')}</b> ]</span>
          <button onClick={() => setDrawerOpen(false)}>×</button>
        </div>
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="mono" style={{ color: 'var(--ash)', fontSize: 11, textAlign: 'center', padding: '40px 0' }}>
              CART EMPTY
            </div>
          ) : (
            cart.map((c, i) => (
              <div key={c.sku + c.variant + i} className="ci">
                <img src={c.img} alt="" />
                <div className="info">
                  <b>{c.name}</b>
                  <span>{c.sku}</span>
                  <span>{c.variant}</span>
                  <span>QTY · {c.q}</span>
                  <button className="iconbtn" style={{ marginTop: 6, width: 'fit-content', fontSize: 10 }} onClick={() => removeFromCart(i)}>
                    REMOVE
                  </button>
                </div>
                <div className="pr">{yen(c.price * c.q)}</div>
              </div>
            ))
          )}
        </div>
        <div className="drawer-foot">
          <div className="row"><span>SUBTOTAL</span><span>{yen(total)}</span></div>
          <div className="row"><span>SHIPPING</span><span>{total >= 5000 ? 'FREE' : yen(800)}</span></div>
          <div className="row tot"><span>TOTAL</span><span>{yen(total + (total >= 5000 ? 0 : total > 0 ? 800 : 0))}</span></div>
          <button
            className="btn hot"
            onClick={async () => {
              if (cart.length === 0) return;
              try {
                const res = await fetch('/api/checkout', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ items: cart.map((c) => ({ sku: c.sku, qty: c.q })) }),
                });
                const data = await res.json();
                if (data.url) window.location.href = data.url;
                else alert(data.error || 'Checkout failed');
              } catch (err) {
                alert('Checkout error');
              }
            }}
          >
            CHECKOUT — <span className="arr">→</span>
          </button>
          <button className="btn ghost" onClick={() => setDrawerOpen(false)}>CONTINUE BROWSING</button>
        </div>
      </aside>
    </>
  );
}
