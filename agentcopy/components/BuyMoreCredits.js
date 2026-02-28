'use client';

import Link from 'next/link';

// variant="full"   — shown in the chat input area when credits reach 0
// variant="banner" — shown at the top of the dashboard home screen
// variant="inline" — small button, e.g. in a nav bar or dropdown
export default function BuyMoreCredits({ variant = 'full' }) {
  if (variant === 'inline') {
    return (
      <Link
        href="/pricing"
        style={{ padding: '8px 16px', backgroundColor: 'var(--color-accent)', color: 'white', borderRadius: 6, fontSize: 14, fontWeight: 500, textDecoration: 'none', display: 'inline-block' }}
      >
        Buy Credits
      </Link>
    );
  }

  if (variant === 'banner') {
    return (
      <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: 10, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <p style={{ margin: 0, fontSize: 14, color: '#92400E', fontWeight: 500 }}>
          You&apos;ve used all your credits. Top up to keep writing.
        </p>
        <Link
          href="/pricing"
          style={{ padding: '8px 18px', backgroundColor: 'var(--color-accent)', color: 'white', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap', display: 'inline-block' }}
        >
          Buy credits
        </Link>
      </div>
    );
  }

  // Full variant — shown in chat area when credits hit 0
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', textAlign: 'center' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'var(--color-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, fontSize: 28 }}>
        💳
      </div>
      <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>
        You&apos;ve used all your credits
      </h3>
      <p style={{ fontSize: 15, color: 'var(--color-muted)', marginBottom: 24, maxWidth: 300 }}>
        Choose a credit pack to keep using AgentCopy. Packs start from $19 NZD.
      </p>
      <Link
        href="/pricing"
        style={{ padding: '14px 28px', backgroundColor: 'var(--color-accent)', color: 'white', borderRadius: 8, fontSize: 16, fontWeight: 600, textDecoration: 'none', display: 'inline-block', transition: 'opacity 0.15s' }}
      >
        View pricing
      </Link>
    </div>
  );
}
