import Link from 'next/link';

export default function Cancel() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{ maxWidth: 560, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <h1 className="display" style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}>
          CHECKOUT<br />CANCELLED
        </h1>
        <p className="mono" style={{ fontSize: 12, color: 'var(--ash)', letterSpacing: '.08em' }}>
          お支払いはキャンセルされました。カートの内容は保持されています。
        </p>
        <Link href="/" className="btn" style={{ alignSelf: 'center', marginTop: 12 }}>
          BACK TO STORE <span className="arr">→</span>
        </Link>
      </div>
    </main>
  );
}
