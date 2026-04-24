import React from 'react';

export default function Logo({ size = 'md' }) {
  const s = size === 'sm' ? 18 : 24;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: s, height: s,
        background: 'var(--green)',
        borderRadius: 5,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg width={s * 0.6} height={s * 0.6} viewBox="0 0 12 12" fill="none">
          <path d="M6 1L10 3V6C10 8.5 8 10.5 6 11C4 10.5 2 8.5 2 6V3L6 1Z" fill="#000" />
        </svg>
      </div>
      <span style={{
        fontSize: size === 'sm' ? 15 : 18,
        fontWeight: 600,
        color: '#fff',
        letterSpacing: '-0.3px',
      }}>GreenVID</span>
    </div>
  );
}
