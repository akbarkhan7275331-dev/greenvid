import React from 'react';

export default function LangToggle({ lang, setLang }) {
  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
      style={{
        background: '#0D1F14',
        border: '1px solid #1a3a22',
        borderRadius: 20,
        padding: '4px 12px',
        color: 'var(--green-muted)',
        fontSize: 12,
        fontWeight: 500,
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'all 0.15s',
      }}
    >
      {lang === 'en' ? 'EN / اردو' : 'اردو / EN'}
    </button>
  );
}
