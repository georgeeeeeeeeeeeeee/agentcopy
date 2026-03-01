'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function SuccessContent() {
  const [status, setStatus] = useState('verifying'); // verifying | success | pending | error
  const [credits, setCredits] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  // min_credits is the balance the user should reach after the webhook fires.
  // Passed by the checkout route: current_credits + pack_credits.
  // Falls back to 1 for any edge case where the param is missing.
  const minCredits = parseInt(searchParams.get('min_credits') || '1', 10);

  useEffect(() => {
    if (!sessionId) {
      router.push('/dashboard');
      return;
    }

    let attempts = 0;
    const maxAttempts = 20;
    // Exponential backoff capped at 3s: 1s, 1.5s, 2.25s, 3s, 3s, ...
    const delay = (attempt) => Math.min(1000 * Math.pow(1.5, attempt), 3000);

    const checkCredits = async () => {
      try {
        const res = await fetch('/api/me');
        if (!res.ok) throw new Error('fetch failed');
        const data = await res.json();

        if (data.credits >= minCredits) {
          setCredits(data.credits);
          setStatus('success');
          setTimeout(() => router.push('/dashboard'), 3000);
          return;
        }

        if (attempts < maxAttempts) {
          setTimeout(checkCredits, delay(attempts));
          attempts++;
        } else {
          // Webhook may be slow — show a friendly pending state
          setStatus('pending');
        }
      } catch {
        if (attempts < maxAttempts) {
          setTimeout(checkCredits, delay(attempts));
          attempts++;
        } else {
          setStatus('error');
        }
      }
    };

    checkCredits();
  }, [sessionId, minCredits, router]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg)', padding: 20 }}>
      <div style={{ backgroundColor: 'var(--color-card)', borderRadius: 16, border: '1px solid var(--color-border)', padding: 48, maxWidth: 480, width: '100%', textAlign: 'center' }}>
        {status === 'verifying' && (
          <>
            <div className="loading-spinner" style={{ margin: '0 auto 24px' }} />
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--color-text)', marginBottom: 12 }}>
              Setting up your account...
            </h1>
            <p style={{ color: 'var(--color-muted)' }}>This will only take a moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12l5 5L20 7" />
              </svg>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--color-text)', marginBottom: 12 }}>
              You&apos;re all set!
            </h1>
            <p style={{ color: 'var(--color-muted)', marginBottom: 8 }}>
              {credits} credits have been added to your account.
            </p>
            <p style={{ color: 'var(--color-muted)', fontSize: 14 }}>Redirecting to dashboard...</p>
          </>
        )}

        {status === 'pending' && (
          <>
            <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 32 }}>
              ⏳
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--color-text)', marginBottom: 12 }}>
              Payment received!
            </h1>
            <p style={{ color: 'var(--color-muted)', marginBottom: 8 }}>
              Your credits are being processed. This can take up to a minute — they&apos;ll appear in your account shortly.
            </p>
            <p style={{ color: 'var(--color-muted)', fontSize: 13, marginBottom: 24 }}>
              If credits don&apos;t appear after a few minutes, please{' '}
              <a href="mailto:support@agentcopy.co.nz" style={{ color: 'var(--color-accent)' }}>contact support</a>.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              style={{ padding: '12px 24px', backgroundColor: 'var(--color-accent)', color: 'white', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
            >
              Go to Dashboard
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--color-text)', marginBottom: 12 }}>
              Something went wrong
            </h1>
            <p style={{ color: 'var(--color-muted)', marginBottom: 24 }}>
              Please{' '}
              <a href="mailto:support@agentcopy.co.nz" style={{ color: 'var(--color-accent)' }}>contact support</a>{' '}
              if your credits don&apos;t appear.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              style={{ padding: '12px 24px', backgroundColor: 'var(--color-accent)', color: 'white', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
            >
              Go to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg)' }}>
          <div className="loading-spinner" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
