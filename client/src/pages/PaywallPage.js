import React, { useState } from 'react';
import Logo from '../components/Logo';
import LangToggle from '../components/LangToggle';

export default function PaywallPage({ t, lang, setLang, apiBase, onBack }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) { setErr(t.errorInvalid); return; }
    setLoading(true);
    setErr('');
    try {
      await fetch(`${apiBase}/api/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch {
      setErr(t.errorGeneral);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
    }}>
      {/* Blurred background hint */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse at center, #0d1f14 0%, var(--navy) 70%)',
        zIndex: 0,
      }} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: 420,
        width: '100%',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '32px 28px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <Logo size="sm" />
          <LangToggle lang={lang} setLang={setLang} />
        </div>

        {/* Shield icon */}
        <div style={{
          width: 56,
          height: 56,
          background: 'var(--green-bg)',
          border: '1px solid #1a3a22',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path d="M13 2L22 6.5V13C22 18.5 18 22.5 13 24C8 22.5 4 18.5 4 13V6.5L13 2Z"
              stroke="var(--green)" strokeWidth="1.8" fill="none" />
            <path d="M9 13L11.5 15.5L17 10" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 600, color: '#fff', textAlign: 'center', marginBottom: 10 }}>
          {t.paywallTitle}
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.6, marginBottom: 24 }}>
          {t.paywallSub}
        </p>

        {submitted ? (
          <div style={{
            padding: '16px',
            background: 'var(--green-bg)',
            border: '1px solid #1a3a22',
            borderRadius: 10,
            color: 'var(--green)',
            textAlign: 'center',
            fontSize: 14,
            fontWeight: 500,
          }}>
            {t.thankYou}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              style={{
                width: '100%',
                padding: '13px 14px',
                background: 'var(--navy)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                color: '#fff',
                fontSize: 14,
                marginBottom: 12,
                outline: 'none',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--green)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
            {err && <div style={{ color: 'var(--danger)', fontSize: 12, marginBottom: 10 }}>{err}</div>}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                background: 'var(--green)',
                color: '#000',
                fontSize: 14,
                fontWeight: 600,
                borderRadius: 10,
                border: 'none',
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? '...' : t.joinWaitlist}
            </button>
          </form>
        )}

        {/* Perks */}
        <div style={{ marginTop: 24 }}>
          {t.perks.map((perk, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 18,
                height: 18,
                background: 'var(--green-bg)',
                border: '1px solid #1a3a22',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="var(--green)" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </div>
              <span style={{ fontSize: 13, color: 'var(--green-muted)' }}>{perk}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onBack}
          style={{
            marginTop: 20,
            width: '100%',
            padding: '10px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 10,
            color: 'var(--text-muted)',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
