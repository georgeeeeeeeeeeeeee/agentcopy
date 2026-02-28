'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  if (!token) {
    return (
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#c0392b', marginBottom: 16 }}>Invalid reset link.</p>
        <Link href="/forgot-password" style={{ color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none' }}>Request a new one</Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to reset password');
        return;
      }

      setDone(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, marginBottom: 8 }}>Password updated</h1>
        <p style={{ color: 'var(--color-muted)', fontSize: 14 }}>Redirecting to sign in...</p>
      </div>
    );
  }

  return (
    <>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, marginBottom: 6, textAlign: 'center' }}>Set new password</h1>
      <p style={{ color: 'var(--color-muted)', fontSize: 14, textAlign: 'center', marginBottom: 28 }}>Choose a strong password for your account.</p>

      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>New password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} placeholder="At least 8 characters"
          style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--color-border)', borderRadius: 10, fontSize: 15, marginBottom: 16, outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-body)', background: 'var(--color-bg)', color: 'var(--color-text)' }} />

        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Confirm password</label>
        <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
          style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--color-border)', borderRadius: 10, fontSize: 15, marginBottom: 20, outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-body)', background: 'var(--color-bg)', color: 'var(--color-text)' }} />

        {error && <p style={{ color: '#c0392b', fontSize: 13, marginBottom: 16, textAlign: 'center' }}>{error}</p>}

        <button type="submit" disabled={loading}
          style={{ width: '100%', padding: '12px 0', background: loading ? 'var(--color-muted)' : 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: loading ? 'default' : 'pointer', fontFamily: 'var(--font-body)' }}>
          {loading ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--color-bg)' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, justifyContent: 'center' }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 700 }}>A</div>
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}>AgentCopy</span>
        </div>
        <div style={{ background: 'var(--color-card)', border: '1.5px solid var(--color-border)', borderRadius: 16, padding: '32px 28px' }}>
          <Suspense fallback={<p style={{ textAlign: 'center', color: 'var(--color-muted)' }}>Loading...</p>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
