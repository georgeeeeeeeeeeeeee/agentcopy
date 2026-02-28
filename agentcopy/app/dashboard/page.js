'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';
import { workflows, categories } from '@/lib/workflows';
import BuyMoreCredits from '@/components/BuyMoreCredits';

export default function Dashboard() {
  const [screen, setScreen] = useState('home'); // home | chat
  const [activeWorkflow, setActiveWorkflow] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [userName, setUserName] = useState('');
  const [credits, setCredits] = useState(null);
  const [creditsLoading, setCreditsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();

  // Get user info and credits from /api/me
  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch('/api/me');
        if (!res.ok) return;
        const data = await res.json();
        setUserName(data.full_name || data.email || '');
        setCredits(data.credits);
      } catch {
        // silently fail — middleware will redirect if truly unauthenticated
      } finally {
        setCreditsLoading(false);
      }
    }
    fetchMe();
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  // Focus input when entering chat
  useEffect(() => {
    if (screen === 'chat') {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [screen]);

  const openWorkflow = (workflow) => {
    setActiveWorkflow(workflow);
    setMessages([{ role: 'assistant', content: workflow.opener }]);
    setScreen('chat');
  };

  const goHome = () => {
    setScreen('home');
    setMessages([]);
    setActiveWorkflow(null);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    // Block send if out of credits
    if (credits !== null && credits <= 0) return;

    const userMessage = input.trim();
    setInput('');

    const updatedMessages = [
      ...messages,
      { role: 'user', content: userMessage },
    ];
    setMessages(updatedMessages);
    setIsStreaming(true);

    // Add empty assistant message to stream into
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowId: activeWorkflow.id,
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (response.status === 402) {
        const data = await response.json();
        if (data.error === 'NO_CREDITS') {
          setCredits(0);
          setMessages((prev) => prev.slice(0, -1));
          setIsStreaming(false);
          return;
        }
      }

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);

            if (parsed.credits !== undefined) {
              setCredits(parsed.credits);
              continue;
            }

            if (parsed.text) {
              setMessages((prev) => {
                const updated = [...prev];
                const lastMsg = updated[updated.length - 1];
                if (lastMsg.role === 'assistant') {
                  lastMsg.content += parsed.text;
                }
                return updated;
              });
            }

            if (parsed.error) {
              setMessages((prev) => {
                const updated = [...prev];
                const lastMsg = updated[updated.length - 1];
                if (lastMsg.role === 'assistant') {
                  lastMsg.content = parsed.error;
                }
                return updated;
              });
            }
          } catch {
            // skip unparseable chunks
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg.role === 'assistant') {
          lastMsg.content = 'Sorry, something went wrong. Please try again.';
        }
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const initials = userName
    ? userName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  // ─── Chat Screen ───
  if (screen === 'chat') {
    return (
      <div style={{ background: 'var(--color-chat-bg)', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ background: 'var(--color-card)', borderBottom: '1px solid var(--color-border)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          <button onClick={goHome} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--color-muted)', padding: '4px 8px', borderRadius: 6 }}>
            ←
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{activeWorkflow?.icon} {activeWorkflow?.title}</div>
            <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 1 }}>{activeWorkflow?.desc}</div>
          </div>
          {!creditsLoading && credits !== null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', backgroundColor: credits > 0 ? 'var(--color-accent-light)' : '#FEF3C7', borderRadius: 6, fontSize: 14, color: credits > 0 ? 'var(--color-accent)' : '#92400E', fontWeight: 500 }}>
              {credits} credits
            </div>
          )}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ maxWidth: 680, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.map((msg, i) => (
              <div key={i} className="animate-fade-up" style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '82%', padding: '14px 18px', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: msg.role === 'user' ? 'var(--color-accent)' : 'var(--color-card)', color: msg.role === 'user' ? '#FFFFFF' : 'var(--color-text)', fontSize: 15, lineHeight: 1.6, boxShadow: msg.role === 'assistant' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none', whiteSpace: 'pre-wrap' }}>
                  {msg.role === 'assistant' ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
                  {isStreaming && i === messages.length - 1 && msg.role === 'assistant' && (
                    <span style={{ display: 'inline-block', width: 2, height: 16, background: 'var(--color-accent)', marginLeft: 2, verticalAlign: 'text-bottom', animation: 'pulse-dot 1s ease-in-out infinite' }} />
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input or BuyMoreCredits */}
        {credits === 0 ? (
          <div style={{ background: 'var(--color-card)', borderTop: '1px solid var(--color-border)', flexShrink: 0 }}>
            <BuyMoreCredits />
          </div>
        ) : (
          <div style={{ background: 'var(--color-card)', borderTop: '1px solid var(--color-border)', padding: '14px 20px', flexShrink: 0 }}>
            <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', gap: 12, alignItems: 'flex-end' }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your reply..."
                rows={1}
                disabled={isStreaming}
                style={{ flex: 1, padding: '12px 16px', border: '1.5px solid var(--color-border)', borderRadius: 14, fontSize: 15, fontFamily: 'var(--font-body)', resize: 'none', outline: 'none', lineHeight: 1.5, background: 'var(--color-bg)', opacity: isStreaming ? 0.6 : 1 }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isStreaming}
                style={{ background: input.trim() && !isStreaming ? 'var(--color-accent)' : 'var(--color-border)', color: '#FFFFFF', border: 'none', borderRadius: 12, width: 44, height: 44, cursor: input.trim() && !isStreaming ? 'pointer' : 'default', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              >
                ↑
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── Home Screen ───
  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: '0 24px 60px' }}>
      {/* Top bar */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 600 }}>A</div>
          <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: -0.3 }}>AgentCopy</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!creditsLoading && credits !== null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', backgroundColor: credits > 0 ? 'var(--color-accent-light)' : '#FEF3C7', borderRadius: 6, fontSize: 14, color: credits > 0 ? 'var(--color-accent)' : '#92400E', fontWeight: 500 }}>
              {credits} credits
            </div>
          )}
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--color-muted)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            Sign out
          </button>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--color-accent-light)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>
            {initials}
          </div>
        </div>
      </div>

      {/* 0-credit banner */}
      {!creditsLoading && credits === 0 && (
        <div style={{ maxWidth: 720, margin: '0 auto 24px' }}>
          <BuyMoreCredits variant="banner" />
        </div>
      )}

      {/* Hero */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 0 40px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 400, lineHeight: 1.15, marginBottom: 10, letterSpacing: -0.5 }}>
          What are you working on?
        </h1>
        <p style={{ fontSize: 16, color: 'var(--color-muted)', lineHeight: 1.5, margin: 0 }}>
          Choose a task and your AI assistant will walk you through it step by step.
        </p>
      </div>

      {/* Workflow Cards */}
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {categories.map((cat) => (
          <div key={cat} style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.2, color: 'var(--color-muted)', marginBottom: 12, paddingLeft: 2 }}>
              {cat}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 12 }}>
              {workflows
                .filter((w) => w.category === cat)
                .map((workflow) => (
                  <WorkflowCard key={workflow.id} workflow={workflow} onClick={() => openWorkflow(workflow)} />
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ maxWidth: 720, margin: '40px auto 0', textAlign: 'center', fontSize: 13, color: 'var(--color-muted)' }}>
        Built for New Zealand real estate agents · Powered by AI
      </div>
    </div>
  );
}

function WorkflowCard({ workflow, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? 'var(--color-accent-light)' : 'var(--color-card)', border: `1.5px solid ${hovered ? 'var(--color-accent)' : 'var(--color-border)'}`, borderRadius: 14, padding: '20px 18px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', gap: 8, transform: hovered ? 'translateY(-2px)' : 'translateY(0)', boxShadow: hovered ? '0 4px 12px rgba(45,90,61,0.08)' : 'none', fontFamily: 'var(--font-body)' }}
    >
      <span style={{ fontSize: 24 }}>{workflow.icon}</span>
      <span style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>{workflow.title}</span>
      <span style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.45 }}>{workflow.desc}</span>
    </button>
  );
}
