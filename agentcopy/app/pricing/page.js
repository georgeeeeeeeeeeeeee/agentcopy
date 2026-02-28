'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CREDIT_PACKS } from '@/lib/config';

const WORKFLOWS = [
  { icon: '📝', name: 'TradeMe Listings', desc: 'Professional property descriptions' },
  { icon: '✉️', name: 'Email Templates', desc: 'Vendor updates & buyer follow-ups' },
  { icon: '📱', name: 'Social Media Posts', desc: 'Instagram, Facebook & LinkedIn' },
  { icon: '🏠', name: 'Open Home Scripts', desc: 'Talking points & follow-up' },
  { icon: '📊', name: 'Market Updates', desc: 'Monthly vendor communications' },
  { icon: '🎯', name: 'Listing Presentations', desc: 'Win more listings' },
  { icon: '📞', name: 'Cold Calling Scripts', desc: 'Prospecting made easy' },
  { icon: '✨', name: 'Property Highlights', desc: 'Feature sheets & brochures' },
];

const BENEFITS = [
  'NZ-specific real estate terminology',
  'Compliant with REA guidelines',
  'No subscription — buy more when you need',
  'Works on desktop and mobile',
];

export default function PricingPage() {
  const [selectedPack, setSelectedPack] = useState(CREDIT_PACKS[1].id); // default: Standard
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId: selectedPack }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Could not start checkout. Please try again.');
        setLoading(false);
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const chosen = CREDIT_PACKS.find((p) => p.id === selectedPack);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', padding: '40px 20px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 400, color: 'var(--color-text)', marginBottom: 16 }}>
            AgentCopy
          </h1>
          <p style={{ fontSize: 20, color: 'var(--color-muted)', maxWidth: 500, margin: '0 auto' }}>
            AI-powered writing assistant built specifically for New Zealand real estate agents
          </p>
        </div>

        {/* Pack selector */}
        <div style={{ backgroundColor: 'var(--color-card)', borderRadius: 16, border: '1px solid var(--color-border)', padding: 40, marginBottom: 32 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'inline-block', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)', padding: '6px 16px', borderRadius: 20, fontSize: 14, fontWeight: 500, marginBottom: 16 }}>
              One-time purchase
            </div>
            <p style={{ fontSize: 16, color: 'var(--color-muted)', margin: 0 }}>
              Choose a credit pack — use them anytime, no expiry.
            </p>
          </div>

          {/* Pack cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
            {CREDIT_PACKS.map((pack) => {
              const isSelected = pack.id === selectedPack;
              return (
                <button
                  key={pack.id}
                  onClick={() => setSelectedPack(pack.id)}
                  style={{ padding: '20px 16px', border: `2px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`, borderRadius: 12, background: isSelected ? 'var(--color-accent-light)' : 'var(--color-bg)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s', fontFamily: 'var(--font-body)' }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>
                    {pack.label}
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 700, color: isSelected ? 'var(--color-accent)' : 'var(--color-text)', lineHeight: 1, marginBottom: 4 }}>
                    {pack.display}
                    <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--color-muted)' }}> NZD</span>
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--color-muted)', marginTop: 6 }}>
                    {pack.credits} credits
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 2 }}>
                    {(pack.amount_paid_cents / pack.credits / 100).toFixed(2)} per credit
                  </div>
                </button>
              );
            })}
          </div>

          {/* What's included */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text)', marginBottom: 16 }}>
              Everything you need to write faster:
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {WORKFLOWS.map((w) => (
                <div key={w.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, backgroundColor: 'var(--color-bg)', borderRadius: 8 }}>
                  <span style={{ fontSize: 20 }}>{w.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)' }}>{w.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{w.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div style={{ backgroundColor: 'var(--color-bg)', borderRadius: 12, padding: 20, marginBottom: 32 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {BENEFITS.map((b) => (
                <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ display: 'block' }}>
                      <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span style={{ fontSize: 15, color: 'var(--color-text)' }}>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {error && <p style={{ color: '#c0392b', fontSize: 13, textAlign: 'center', marginBottom: 16 }}>{error}</p>}

          {/* CTA */}
          <button
            onClick={handleCheckout}
            disabled={loading}
            style={{ width: '100%', padding: '16px 32px', backgroundColor: 'var(--color-accent)', color: 'white', border: 'none', borderRadius: 8, fontSize: 18, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'all 0.2s ease', fontFamily: 'var(--font-body)' }}
          >
            {loading ? 'Redirecting to checkout...' : `Get ${chosen?.credits} credits — ${chosen?.display} NZD`}
          </button>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--color-muted)', marginTop: 16 }}>
            Secure payment powered by Stripe
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'var(--color-muted)' }}>
            Questions?{' '}
            <a href="mailto:support@agentcopy.co.nz" style={{ color: 'var(--color-accent)' }}>
              Get in touch
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
