import React, { useState } from 'react';
import Logo from '../components/Logo';
import LangToggle from '../components/LangToggle';

export default function HomePage({ t, lang, setLang, onAnalyze, checksLeft, error }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    onAnalyze(url.trim());
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{ maxWidth: 480, width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <Logo />
          <LangToggle lang={lang} setLang={setLang} />
        </div>

        <h1 style={{
          fontSize: 28,
          fontWeight: 600,
          lineHeight: 1.3,
          marginBottom: 12,
          color: '#fff',
        }}>{t.headline}</h1>

        <p style={{
          fontSize: 15,
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          marginBottom: 32,
        }}>{t.subtext}</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t.placeholder}
            style={{
              width: '100%',
              padding: '14px 16px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              color: '#fff',
              fontSize: 14,
              marginBottom: 14,
              outline: 'none',
              transition: 'border 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--green)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />

          <button
            type="submit"
            disabled={!url.trim() || checksLeft <= 0}
            style={{
              width: '100%',
              padding: '14px',
              background: checksLeft > 0 ? 'var(--green)' : '#444',
              color: checksLeft > 0 ? '#000' : '#888',
              fontSize: 15,
              fontWeight: 600,
              borderRadius: 10,
              border: 'none',
              cursor: checksLeft > 0 ? 'pointer' : 'not-allowed',
              transition: 'transform 0.1s',
            }}
            onMouseDown={(e) => checksLeft > 0 && (e.target.style.transform = 'scale(0.98)')}
            onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            {t.runBtn}
          </button>
        </form>

        {error && (
          <div style={{
            marginTop: 16,
            padding: '12px 16px',
            background: '#2a1515',
            border: '1px solid #5a2020',
            borderRadius: 8,
            color: 'var(--danger)',
            fontSize: 13,
          }}>
            {error}
          </div>
        )}

        <div style={{
          marginTop: 16,
          textAlign: 'center',
          fontSize: 13,
          color: 'var(--text-muted)',
        }}>
          {checksLeft > 0 ? t.checksLeft(checksLeft) : t.freeChecks}
        </div>

        <div style={{
          display: 'flex',
          gap: 6,
          justifyContent: 'center',
          marginTop: 12,
        }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: i < (3 - checksLeft) ? 'var(--green)' : 'var(--border)',
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}
