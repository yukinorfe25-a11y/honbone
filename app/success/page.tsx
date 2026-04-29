import Link from 'next/link';

export default function Success({ searchParams }: { searchParams: { session_id?: string } }) {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{ maxWidth: 560, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <h1 className="display" style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}>
          ORDER<br />RECEIVED
        </h1>
        <p className="mono" style={{ fontSize: 12, color: 'var(--ash)', letterSpacing: '.08em' }}>
          ご注文ありがとうございます。確認メールを送信しました。
          <br />
          通常 72時間以内に発送いたします。
        </p>
        {searchParams.session_id && (
          <div className="mono" style={{ fontSize: 10, color: 'var(--ash)', letterSpacing: '.14em', textTransform: 'uppercase' }}>
            REF // {searchParams.session_id}
          </div>
        )}
        <Link href="/" className="btn" style={{ alignSelf: 'center', marginTop: 12 }}>
          BACK TO STORE <span className="arr">→</span>
        </Link>
      </div>
    </main>
  );
}
