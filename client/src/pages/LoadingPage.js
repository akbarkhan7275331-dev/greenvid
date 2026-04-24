import React from 'react';
import Logo from '../components/Logo';

export default function LoadingPage({ t, step }) {
  const steps = t.steps;
  const progress = Math.round((step / steps.length) * 100);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{ maxWidth: 420, width: '100%' }}>
        <div style={{ marginBottom: 36 }}>
          <Logo />
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 6 }}>
          {t.analyzing}
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 32 }}>
          {t.takesTime}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
          {steps.map((label, i) => {
            const isDone = step > i;
            const isActive = step === i;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: isDone ? 'var(--green)' : 'var(--surface)',
                  border: isActive ? '2px solid var(--green)' : isDone ? 'none' : '2px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.3s',
                }}>
                  {isDone && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {isActive && <Spinner />}
                </div>
                <span style={{
                  fontSize: 14,
                  color: isDone ? 'var(--green-muted)' : isActive ? '#fff' : 'var(--text-muted)',
                  transition: 'color 0.3s',
                }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
            <span>{t.progress}</span>
            <span>{progress}%</span>
          </div>
          <div style={{ height: 4, background: 'var(--border)', borderRadius: 2 }}>
            <div style={{
              height: 4,
              background: 'var(--green)',
              borderRadius: 2,
              width: `${progress}%`,
              transition: 'width 0.6s ease',
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{
      width: 10,
      height: 10,
      border: '2px solid var(--green)',
      borderTopColor: 'transparent',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
  );
}
