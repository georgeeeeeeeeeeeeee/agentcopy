'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';
import { RESIDENTIAL_STEPS, COMMERCIAL_STEPS } from '@/lib/wizard-questions';
import BuyMoreCredits from '@/components/BuyMoreCredits';

const LS_KEY = 'agentcopy_wizard';
const NEWSPAPER_CHAR_LIMIT = 350;

// Credit cost for the current output channel selection
function calcChannelCost(outputChannels) {
  const count = Array.isArray(outputChannels) ? outputChannels.length : 0;
  if (count <= 1) return 1;
  return 1 + (count - 1) * 0.5;
}

// ─── Shared input style ────────────────────────────────────────────────────────
const sharedInputStyle = {
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

// ─── Address autocomplete component ───────────────────────────────────────────
function AddressAutocompleteField({ field, value, onChange }) {
  // value is an object: { street_no, street_name, suburb, city_town }
  const addr = value && typeof value === 'object' ? value : {};

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [manual, setManual] = useState(false);
  const [apiFallback, setApiFallback] = useState(false);
  const debounceRef = useRef(null);

  const search = useCallback((q) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q || q.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/address?q=${encodeURIComponent(q)}`);
        const json = await res.json();
        if (json.fallback) {
          setApiFallback(true);
          setManual(true);
        } else {
          setSuggestions(json.suggestions ?? []);
          setShowDropdown((json.suggestions ?? []).length > 0);
        }
      } catch {
        setApiFallback(true);
        setManual(true);
      }
      setLoading(false);
    }, 300);
  }, []);

  const handleSelect = async (suggestion) => {
    setShowDropdown(false);
    setLoading(true);
    try {
      const res = await fetch(`/api/address?pxid=${encodeURIComponent(suggestion.pxid)}`);
      const structured = await res.json();
      onChange(structured);
      setQuery(suggestion.label);
      setManual(true); // show fields so user can verify / edit
    } catch {
      // detail lookup failed — show manual fields with query as street_name
      onChange({ street_no: '', street_name: query, suburb: '', city_town: '' });
      setManual(true);
    }
    setLoading(false);
  };

  const handleManualChange = (key, val) => {
    onChange({ ...addr, [key]: val });
  };

  const labelStyle = { display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6, color: 'var(--color-text)' };
  const subLabelStyle = { display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4, color: 'var(--color-muted)' };

  return (
    <div>
      <label style={labelStyle}>
        {field.label}
        {field.required && <span style={{ color: 'var(--color-accent)', marginLeft: 4 }}>*</span>}
      </label>

      {/* Search box — hidden once in manual-only fallback */}
      {!apiFallback && (
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); search(e.target.value); }}
            onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            placeholder="Start typing an address…"
            style={{ ...sharedInputStyle, paddingRight: loading ? 44 : 16 }}
          />
          {loading && (
            <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: 'var(--color-muted)' }}>
              …
            </span>
          )}
          {showDropdown && (
            <ul style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
              background: 'var(--color-card)', border: '1.5px solid var(--color-border)',
              borderRadius: 10, marginTop: 4, padding: 0, listStyle: 'none',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)', maxHeight: 260, overflowY: 'auto',
            }}>
              {suggestions.map((s) => (
                <li
                  key={s.pxid}
                  onMouseDown={() => handleSelect(s)}
                  style={{
                    padding: '10px 16px', fontSize: 14, cursor: 'pointer',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  {s.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Manual toggle */}
      {!manual && !apiFallback && (
        <button
          type="button"
          onClick={() => { setManual(true); onChange({ street_no: '', street_name: '', suburb: '', city_town: '' }); }}
          style={{ background: 'none', border: 'none', fontSize: 13, color: 'var(--color-muted)', cursor: 'pointer', padding: 0, textDecoration: 'underline', marginBottom: 12 }}
        >
          Enter manually
        </button>
      )}
      {manual && !apiFallback && (
        <button
          type="button"
          onClick={() => { setManual(false); onChange({}); setQuery(''); }}
          style={{ background: 'none', border: 'none', fontSize: 13, color: 'var(--color-muted)', cursor: 'pointer', padding: 0, textDecoration: 'underline', marginBottom: 12 }}
        >
          Search instead
        </button>
      )}

      {/* Structured sub-fields (shown after selection or in manual mode) */}
      {(manual || apiFallback) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {apiFallback && (
            <p style={{ fontSize: 13, color: 'var(--color-muted)', margin: 0 }}>
              Address lookup is unavailable — please enter the address manually.
            </p>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 10 }}>
            <div>
              <label style={subLabelStyle}>Street no.</label>
              <input type="text" value={addr.street_no ?? ''} onChange={(e) => handleManualChange('street_no', e.target.value)} placeholder="123" style={sharedInputStyle} />
            </div>
            <div>
              <label style={subLabelStyle}>Street name <span style={{ color: 'var(--color-accent)' }}>*</span></label>
              <input type="text" value={addr.street_name ?? ''} onChange={(e) => handleManualChange('street_name', e.target.value)} placeholder="Willis Street" style={sharedInputStyle} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={subLabelStyle}>Suburb <span style={{ color: 'var(--color-accent)' }}>*</span></label>
              <input type="text" value={addr.suburb ?? ''} onChange={(e) => handleManualChange('suburb', e.target.value)} placeholder="Te Aro" style={sharedInputStyle} />
            </div>
            <div>
              <label style={subLabelStyle}>City / Town <span style={{ color: 'var(--color-accent)' }}>*</span></label>
              <input type="text" value={addr.city_town ?? ''} onChange={(e) => handleManualChange('city_town', e.target.value)} placeholder="Wellington" style={sharedInputStyle} />
            </div>
          </div>
        </div>
      )}

      {field.hint && (
        <p style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 6, margin: '6px 0 0' }}>
          {field.hint}
        </p>
      )}
    </div>
  );
}

// ─── Checkbox group component ──────────────────────────────────────────────────
function CheckboxGroupField({ field, value, onChange }) {
  const selected = Array.isArray(value) ? value : [];

  const toggle = (opt) => {
    onChange(selected.includes(opt) ? selected.filter((o) => o !== opt) : [...selected, opt]);
  };

  const creditCost = calcChannelCost(selected);

  return (
    <div>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--color-text)' }}>
        {field.label}
        {field.required && <span style={{ color: 'var(--color-accent)', marginLeft: 4 }}>*</span>}
      </label>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {field.options.map((opt) => {
          const checked = selected.includes(opt);
          return (
            <label
              key={opt}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', borderRadius: 10,
                border: `1.5px solid ${checked ? 'var(--color-accent)' : 'var(--color-border)'}`,
                background: checked ? 'var(--color-accent-light)' : 'var(--color-card)',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(opt)}
                style={{ width: 18, height: 18, accentColor: 'var(--color-accent)', cursor: 'pointer' }}
              />
              <span style={{ fontSize: 15, fontWeight: 500, color: checked ? 'var(--color-accent)' : 'var(--color-text)' }}>
                {opt}
              </span>
            </label>
          );
        })}
      </div>

      {selected.length > 0 && (
        <p style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 10 }}>
          {selected.length === 1
            ? '1 channel selected — 1 credit'
            : `${selected.length} channels selected — ${creditCost} credits (1 + ${selected.length - 1} × 0.5)`}
        </p>
      )}

      {field.hint && (
        <p style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 6 }}>
          {field.hint}
        </p>
      )}
    </div>
  );
}

// ─── Generic field input ───────────────────────────────────────────────────────
function FieldInput({ field, value, onChange, inputRef, charLimit }) {
  const charCount = typeof value === 'string' ? value.length : 0;
  const overLimit = charLimit !== undefined && charCount > charLimit;

  const borderColor = overLimit ? '#EF4444' : 'var(--color-border)';

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
          style={{ ...sharedInputStyle, cursor: 'pointer' }}
        >
          <option value="">Select…</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : field.type === 'textarea' ? (
        <>
          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            style={{ ...sharedInputStyle, resize: 'vertical', lineHeight: 1.6, borderColor }}
          />
          {charLimit !== undefined && (
            <p style={{ fontSize: 12, color: overLimit ? '#EF4444' : 'var(--color-muted)', marginTop: 4, textAlign: 'right' }}>
              {charCount} / {charLimit} characters{overLimit ? ' — over newspaper limit' : ''}
            </p>
          )}
        </>
      ) : (
        <input
          ref={inputRef}
          type={field.type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          min={field.type === 'number' ? 0 : undefined}
          style={sharedInputStyle}
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

// ─── Main page ─────────────────────────────────────────────────────────────────
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

  // Read track from URL client-side
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const t = p.get('track') || 'residential';
    setTrack(t);

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

  // Persist wizard state to localStorage
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

  // Computed values
  const outputChannels = Array.isArray(data.outputChannels) ? data.outputChannels : [];
  const channelCost = calcChannelCost(outputChannels);
  const hasNewspaper = outputChannels.includes('Newspaper');

  // Newspaper char limit: applied to the heroFeatures field
  const heroOverLimit = hasNewspaper && (data.heroFeatures || '').length > NEWSPAPER_CHAR_LIMIT;

  // Visible fields: filter out those whose conditional is not met
  const visibleFields = (currentStep?.fields ?? []).filter((f) => {
    if (!f.conditional) return true;
    const condVal = data[f.conditional.field];
    return f.conditional.values.includes(condVal);
  });

  // canProceed: all visible required fields filled + newspaper limit not exceeded
  const canProceed = !heroOverLimit && visibleFields.every((f) => {
    if (f.type === 'address-autocomplete') {
      if (!f.required) return true;
      const v = data[f.id] || {};
      return v.street_name && v.suburb && v.city_town;
    }
    if (f.type === 'checkbox-group') {
      return f.required ? (Array.isArray(data[f.id]) && data[f.id].length > 0) : true;
    }
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

  // ─── Generating screen ───────────────────────────────────────────────────────
  if (view === 'generating') {
    return (
      <div style={{ background: 'var(--color-bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
        <div style={{ width: 48, height: 48, border: '3px solid var(--color-accent-light)', borderTop: '3px solid var(--color-accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ fontSize: 16, color: 'var(--color-muted)', margin: 0 }}>Generating your listing…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ─── Result screen ───────────────────────────────────────────────────────────
  if (view === 'result') {
    return (
      <div style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: '0 24px 60px' }}>
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
            {track === 'commercial' ? 'Commercial' : 'Residential'}
            {outputChannels.length > 0 && ` · ${outputChannels.join(', ')}`}
          </p>

          {error && (
            <div style={{ background: '#FEF3C7', border: '1px solid #D97706', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#92400E' }}>
              {error}
            </div>
          )}

          <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 14, padding: '28px 28px 24px', marginBottom: 20, lineHeight: 1.7, fontSize: 15 }}>
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>

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

  // ─── Wizard screen ───────────────────────────────────────────────────────────
  if (!track) return null;

  const generateLabel = isLastStep
    ? `Generate — ${channelCost} credit${channelCost !== 1 ? 's' : ''}`
    : 'Next →';

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

        {/* Newspaper limit warning — shown on heroFeatures step */}
        {heroOverLimit && currentStep.id === 'heroFeatures' && (
          <div style={{ background: '#FEF2F2', border: '1px solid #EF4444', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#B91C1C' }}>
            Newspaper listings are limited to {NEWSPAPER_CHAR_LIMIT} characters. Shorten the description to continue.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {visibleFields.map((field) => {
            if (field.type === 'address-autocomplete') {
              return (
                <AddressAutocompleteField
                  key={field.id}
                  field={field}
                  value={data[field.id] ?? {}}
                  onChange={(val) => handleFieldChange(field.id, val)}
                />
              );
            }

            if (field.type === 'checkbox-group') {
              return (
                <CheckboxGroupField
                  key={field.id}
                  field={field}
                  value={data[field.id] ?? []}
                  onChange={(val) => handleFieldChange(field.id, val)}
                />
              );
            }

            // Standard field — apply newspaper char limit to heroFeatures
            const charLimit = field.id === 'heroFeatures' && hasNewspaper ? NEWSPAPER_CHAR_LIMIT : undefined;

            return (
              <FieldInput
                key={field.id}
                field={field}
                value={data[field.id] ?? ''}
                onChange={(val) => handleFieldChange(field.id, val)}
                inputRef={(el) => { inputRefs.current[field.id] = el; }}
                charLimit={charLimit}
              />
            );
          })}
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
            {isLastStep ? generateLabel : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}
