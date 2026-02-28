'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to send reset email');
        return;
      }

      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--color-bg)' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, justifyContent: 'center' }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 700 }}>A</div>
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}>AgentCopy</span>
        </div>

        <div style={{ background: 'var(--color-card)', border: '1.5px solid var(--color-border)', borderRadius: 16, padding: '32px 28px' }}>
          {submitted ? (
            <>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, marginBottom: 12, textAlign: 'center' }}>Check your email</h1>
              <p style={{ color: 'var(--color-muted)', fontSize: 14, textAlign: 'center', marginBottom: 24 }}>
                If <strong>{email}</strong> is registered, we&apos;ve sent a reset link. Check your inbox — it expires in 1 hour.
              </p>
              <Link href="/login" style={{ display: 'block', textAlign: 'center', color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>
                Back to sign in
              </Link>
            </>
          ) : (
            <>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, marginBottom: 6, textAlign: 'center' }}>Forgot password?</h1>
              <p style={{ color: 'var(--color-muted)', fontSize: 14, textAlign: 'center', marginBottom: 28 }}>Enter your email and we&apos;ll send you a reset link.</p>

              <form onSubmit={handleSubmit}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--color-text)' }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--color-border)', borderRadius: 10, fontSize: 15, marginBottom: 20, outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-body)', background: 'var(--color-bg)', color: 'var(--color-text)' }} />

                {error && <p style={{ color: '#c0392b', fontSize: 13, marginBottom: 16, textAlign: 'center' }}>{error}</p>}

                <button type="submit" disabled={loading}
                  style={{ width: '100%', padding: '12px 0', background: loading ? 'var(--color-muted)' : 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: loading ? 'default' : 'pointer', fontFamily: 'var(--font-body)' }}>
                  {loading ? 'Sending...' : 'Send reset link'}
                </button>
              </form>

              <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--color-muted)' }}>
                <Link href="/login" style={{ color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none' }}>Back to sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
