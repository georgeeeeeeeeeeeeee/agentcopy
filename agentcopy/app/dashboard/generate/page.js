'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';
import { RESIDENTIAL_STEPS, COMMERCIAL_STEPS } from '@/lib/wizard-questions';
import BuyMoreCredits from '@/components/BuyMoreCredits';

const LS_KEY = 'agentcopy_wizard';

export default function GeneratePage() {
  const router = useRouter();

  const [track, setTrack] = useState(null);
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [view, setView] = useState('wizard'); // wizard | generating | result
  const [result, setResult] = useState('');
  const [credits, setCredits] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [refining, setRefining] = useState(null); // null | 'lengthen' | 'shorten'
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const inputRefs = useRef({});

  // Read track from URL client-side (avoids Suspense requirement)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const t = p.get('track') || 'residential';
    setTrack(t);

    // Restore from localStorage if track matches
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
      if (saved && saved.track === t) {
        setStep(saved.step || 0);
        setData(saved.data || {});
      }
    } catch {
      // ignore corrupt storage
    }
  }, []);

  // Fetch current credits
  useEffect(() => {
    fetch('/api/me')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setCredits(d.credits); })
      .catch(() => {});
  }, []);

  // Persist wizard state to localStorage on every change
  useEffect(() => {
    if (!track || view !== 'wizard') return;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ track, step, data }));
    } catch {
      // storage quota exceeded — ignore
    }
  }, [track, step, data, view]);

  const steps = track === 'commercial' ? COMMERCIAL_STEPS : RESIDENTIAL_STEPS;
  const currentStep = steps[step] || steps[0];
  const isLastStep = step === steps.length - 1;
  const progress = steps.length > 0 ? ((step + 1) / steps.length) * 100 : 0;

  // Check if all required fields on the current step are filled
  const canProceed = currentStep?.fields.every((f) => {
    if (!f.required) return true;
    const val = data[f.id];
    return val !== undefined && String(val).trim() !== '';
  });

  const handleFieldChange = (fieldId, value) => {
    setData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleNext = () => {
    if (!canProceed) return;
    if (isLastStep) {
      handleGenerate();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step === 0) {
      router.push('/dashboard');
    } else {
      setStep((s) => s - 1);
    }
  };

  const handleGenerate = async () => {
    setError('');
    setGenerating(true);
    setView('generating');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track, formData: data }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (res.status === 402) {
          setError(json.message || 'Insufficient credits.');
          setView('wizard');
          return;
        }
        throw new Error(json.error || 'Generation failed');
      }

      setResult(json.text);
      setCredits(json.credits);
      localStorage.removeItem(LS_KEY);
      setView('result');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setView('wizard');
    } finally {
      setGenerating(false);
    }
  };

  const handleRefine = async (direction) => {
    setRefining(direction);
    setError('');

    try {
      const res = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction, currentText: result, track, formData: data }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (res.status === 402) {
          setError(json.message || 'Insufficient credits.');
          return;
        }
        throw new Error(json.error || 'Refinement failed');
      }

      setResult(json.text);
      setCredits(json.credits);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setRefining(null);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  };

  const handleStartOver = () => {
    localStorage.removeItem(LS_KEY);
    router.push('/dashboard');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      handleNext();
    }
  };

  // ─── Generating screen ───
  if (view === 'generating') {
    return (
      <div style={{ background: 'var(--color-bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
        <div style={{ width: 48, height: 48, border: '3px solid var(--color-accent-light)', borderTop: '3px solid var(--color-accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ fontSize: 16, color: 'var(--color-muted)', margin: 0 }}>Generating your listing…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ─── Result screen ───
  if (view === 'result') {
    return (
      <div style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: '0 24px 60px' }}>
        {/* Header */}
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={handleStartOver}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--color-muted)', padding: '4px 8px', borderRadius: 6 }}
            >
              ←
            </button>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 600 }}>A</div>
            <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: -0.3 }}>AgentCopy</span>
          </div>
          {credits !== null && (
            <div style={{ padding: '6px 12px', borderRadius: 6, fontSize: 14, fontWeight: 500, background: credits > 0 ? 'var(--color-accent-light)' : '#FEF3C7', color: credits > 0 ? 'var(--color-accent)' : '#92400E' }}>
              {credits} credits
            </div>
          )}
        </div>

        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, letterSpacing: -0.3, marginBottom: 8 }}>
            Your listing
          </h1>
          <p style={{ fontSize: 14, color: 'var(--color-muted)', marginBottom: 24 }}>
            {track === 'commercial' ? 'Commercial' : 'Residential'} · {data.outputType || 'Listing'}
          </p>

          {error && (
            <div style={{ background: '#FEF3C7', border: '1px solid #D97706', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#92400E' }}>
              {error}
            </div>
          )}

          {/* Output card */}
          <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 14, padding: '28px 28px 24px', marginBottom: 20, lineHeight: 1.7, fontSize: 15 }}>
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
            <button
              onClick={handleCopy}
              style={{ padding: '10px 20px', borderRadius: 10, border: '1.5px solid var(--color-border)', background: copied ? '#DCFCE7' : 'var(--color-card)', color: copied ? '#15803D' : 'var(--color-text)', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s' }}
            >
              {copied ? 'Copied!' : 'Copy to clipboard'}
            </button>

            {credits === 0 ? (
              <BuyMoreCredits variant="inline" />
            ) : (
              <>
                <button
                  onClick={() => handleRefine('lengthen')}
                  disabled={refining !== null}
                  style={{ padding: '10px 20px', borderRadius: 10, border: '1.5px solid var(--color-border)', background: 'var(--color-card)', color: refining !== null ? 'var(--color-muted)' : 'var(--color-text)', fontSize: 14, fontWeight: 500, cursor: refining !== null ? 'default' : 'pointer', fontFamily: 'var(--font-body)', opacity: refining !== null ? 0.6 : 1, transition: 'all 0.15s' }}
                >
                  {refining === 'lengthen' ? 'Lengthening…' : 'Lengthen — 1 credit'}
                </button>
                <button
                  onClick={() => handleRefine('shorten')}
                  disabled={refining !== null}
                  style={{ padding: '10px 20px', borderRadius: 10, border: '1.5px solid var(--color-border)', background: 'var(--color-card)', color: refining !== null ? 'var(--color-muted)' : 'var(--color-text)', fontSize: 14, fontWeight: 500, cursor: refining !== null ? 'default' : 'pointer', fontFamily: 'var(--font-body)', opacity: refining !== null ? 0.6 : 1, transition: 'all 0.15s' }}
                >
                  {refining === 'shorten' ? 'Shortening…' : 'Shorten — 1 credit'}
                </button>
              </>
            )}
          </div>

          <button
            onClick={handleStartOver}
            style={{ background: 'none', border: 'none', color: 'var(--color-muted)', fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-body)', padding: 0, textDecoration: 'underline' }}
          >
            Start over
          </button>
        </div>
      </div>
    );
  }

  // ─── Wizard screen ───
  if (!track) return null; // waiting for URL to parse

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: '0 24px 60px' }}>
      {/* Progress bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ height: 3, background: 'var(--color-border)' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'var(--color-accent)', transition: 'width 0.3s ease' }} />
        </div>
      </div>

      {/* Header */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={handleBack}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--color-muted)', padding: '4px 8px', borderRadius: 6 }}
          >
            ←
          </button>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 600 }}>A</div>
          <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: -0.3 }}>AgentCopy</span>
        </div>
        <span style={{ fontSize: 13, color: 'var(--color-muted)' }}>Step {step + 1} of {steps.length}</span>
      </div>

      {/* Step content */}
      <div style={{ maxWidth: 600, margin: '40px auto 0' }} onKeyDown={handleKeyDown}>
        {error && (
          <div style={{ background: '#FEF3C7', border: '1px solid #D97706', borderRadius: 8, padding: '12px 16px', marginBottom: 24, fontSize: 14, color: '#92400E' }}>
            {error}
          </div>
        )}

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400, lineHeight: 1.2, letterSpacing: -0.4, marginBottom: 32 }}>
          {currentStep.title}
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {currentStep.fields.map((field) => (
            <FieldInput
              key={field.id}
              field={field}
              value={data[field.id] ?? ''}
              onChange={(val) => handleFieldChange(field.id, val)}
              inputRef={(el) => { inputRefs.current[field.id] = el; }}
            />
          ))}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
          <button
            onClick={handleBack}
            style={{ padding: '12px 24px', borderRadius: 12, border: '1.5px solid var(--color-border)', background: 'var(--color-card)', color: 'var(--color-text)', fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed || generating}
            style={{ padding: '12px 32px', borderRadius: 12, border: 'none', background: canProceed && !generating ? 'var(--color-accent)' : 'var(--color-border)', color: '#fff', fontSize: 15, fontWeight: 600, cursor: canProceed && !generating ? 'pointer' : 'default', fontFamily: 'var(--font-body)', transition: 'background 0.15s', flex: 1 }}
          >
            {isLastStep ? 'Generate — 1 credit' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldInput({ field, value, onChange, inputRef }) {
  const sharedStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1.5px solid var(--color-border)',
    borderRadius: 10,
    fontSize: 15,
    fontFamily: 'var(--font-body)',
    background: 'var(--color-card)',
    color: 'var(--color-text)',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  };

  return (
    <div>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--color-text)' }}>
        {field.label}
        {field.required && <span style={{ color: 'var(--color-accent)', marginLeft: 4 }}>*</span>}
      </label>

      {field.type === 'select' ? (
        <select
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...sharedStyle, cursor: 'pointer' }}
        >
          <option value="">Select…</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : field.type === 'textarea' ? (
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={4}
          style={{ ...sharedStyle, resize: 'vertical', lineHeight: 1.6 }}
        />
      ) : (
        <input
          ref={inputRef}
          type={field.type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          min={field.type === 'number' ? 0 : undefined}
          style={sharedStyle}
        />
      )}

      {field.hint && (
        <p style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 6, margin: '6px 0 0' }}>
          {field.hint}
        </p>
      )}
    </div>
  );
}
