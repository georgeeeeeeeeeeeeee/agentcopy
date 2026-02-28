'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const WORKFLOW_LABELS = {
  'trademe-listing':    'TradeMe Listing',
  'realestate-listing': 'Real Estate Listing',
  'vendor-update':      'Vendor Update',
  'open-home-followup': 'Open Home Follow-up',
  'social-post':        'Social Post',
  'price-reduction':    'Price Reduction',
  'appraisal-letter':   'Appraisal Letter',
  'buyer-email':        'Buyer Email',
};

export default function HistoryPage() {
  const [generations, setGenerations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterWorkflow, setFilterWorkflow] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      setError(null);
      try {
        const url = filterWorkflow
          ? `/api/history?workflow=${encodeURIComponent(filterWorkflow)}&limit=50`
          : '/api/history?limit=50';
        const res = await fetch(url);
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        if (!res.ok) throw new Error('Failed to load history');
        const data = await res.json();
        setGenerations(data.generations || []);
      } catch {
        setError('Could not load history. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [filterWorkflow, router]);

  const handleCopy = async (id, content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // clipboard not available
    }
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: '0 24px 60px' }}>
      {/* Top bar */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 600 }}>A</div>
            <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: -0.3 }}>AgentCopy</span>
          </Link>
        </div>
        <Link href="/dashboard" style={{ fontSize: 13, color: 'var(--color-muted)', textDecoration: 'none' }}>
          ← Back to dashboard
        </Link>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Page header + filter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400, marginBottom: 4, letterSpacing: -0.5 }}>History</h1>
            <p style={{ fontSize: 15, color: 'var(--color-muted)', margin: 0 }}>Your recent AI-generated content</p>
          </div>
          <select
            value={filterWorkflow}
            onChange={(e) => setFilterWorkflow(e.target.value)}
            style={{ padding: '8px 12px', border: '1.5px solid var(--color-border)', borderRadius: 8, fontSize: 14, background: 'var(--color-card)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', outline: 'none', cursor: 'pointer' }}
          >
            <option value="">All workflows</option>
            {Object.entries(WORKFLOW_LABELS).map(([id, label]) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </select>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div className="loading-spinner" style={{ margin: '0 auto' }} />
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: 40, color: '#c0392b', fontSize: 14 }}>{error}</div>
        )}

        {!loading && !error && generations.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--color-muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📋</div>
            <p style={{ fontSize: 16, marginBottom: 8 }}>No generations yet</p>
            <p style={{ fontSize: 14 }}>
              Complete a workflow in the{' '}
              <Link href="/dashboard" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}>dashboard</Link>{' '}
              to see your history here.
            </p>
          </div>
        )}

        {!loading && generations.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {generations.map((gen) => (
              <div key={gen.id} style={{ background: 'var(--color-card)', border: '1.5px solid var(--color-border)', borderRadius: 14, overflow: 'hidden' }}>
                {/* Card header */}
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-accent)', background: 'var(--color-accent-light)', padding: '3px 10px', borderRadius: 20 }}>
                      {WORKFLOW_LABELS[gen.workflow_id] || gen.workflow_id}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--color-muted)', marginLeft: 12 }}>
                      {formatDate(gen.created_at)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(gen.id, gen.content)}
                    style={{ padding: '6px 14px', border: '1.5px solid var(--color-border)', borderRadius: 7, fontSize: 13, fontWeight: 500, background: 'none', cursor: 'pointer', color: copiedId === gen.id ? 'var(--color-accent)' : 'var(--color-muted)', fontFamily: 'var(--font-body)', transition: 'all 0.15s' }}
                  >
                    {copiedId === gen.id ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                {/* Content preview */}
                <div style={{ padding: '16px 20px', fontSize: 14, color: 'var(--color-text)', lineHeight: 1.6, whiteSpace: 'pre-wrap', maxHeight: 200, overflow: 'hidden', position: 'relative' }}>
                  {gen.content}
                  {/* Fade out if content is long */}
                  {gen.content.length > 400 && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(transparent, var(--color-card))' }} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
