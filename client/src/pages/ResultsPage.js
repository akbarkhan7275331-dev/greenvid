import React, { useState } from 'react';
import Logo from '../components/Logo';
import LangToggle from '../components/LangToggle';

const SECTION_KEYS = [
  'copyright_risk',
  'community_guidelines',
  'inauthentic_content',
  'circumvention_policy',
  'misleading_content',
  'advertiser_friendliness',
];

function scoreColor(score) {
  if (score <= 3) return 'var(--green)';
  if (score <= 6) return 'var(--caution)';
  return 'var(--danger)';
}

function scoreLabel(score, t) {
  if (score <= 3) return t.safe;
  if (score <= 6) return t.caution;
  return t.highRisk;
}

function formatNum(n) {
  if (!n) return '—';
  const num = parseInt(n, 10);
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toString();
}

export default function ResultsPage({ t, lang, setLang, result, onCheckAnother }) {
  const [expandedSection, setExpandedSection] = useState(null);
  const [copied, setCopied] = useState(false);

  const { meta, analysis, type } = result;
  const score = analysis.overall_score;
  const color = scoreColor(score);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ minHeight: '100vh', padding: '20px', maxWidth: 640, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <Logo size="sm" />
        <LangToggle lang={lang} setLang={setLang} />
      </div>

      {/* Meta strip */}
      <div style={{
        display: 'flex',
        gap: 14,
        alignItems: 'center',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '14px 16px',
        marginBottom: 24,
      }}>
        {meta.thumbnail && (
          <img
            src={meta.thumbnail}
            alt=""
            style={{ width: 56, height: 40, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }}
          />
        )}
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 3 }}>
            {type === 'channel' ? meta.name : meta.title}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {type === 'channel'
              ? `${formatNum(meta.subscriberCount)} ${t.subscribers} · ${formatNum(meta.videoCount)} ${t.videos}`
              : `${formatNum(meta.viewCount)} ${t.views} · ${t.videoBy} ${meta.channelTitle}`}
          </div>
        </div>
      </div>

      {/* Score Gauge */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
        <ScoreGauge score={score} color={color} />
        <div style={{ fontSize: 15, fontWeight: 600, color, marginTop: 10 }}>
          {score <= 3 ? '✓ ' : score <= 6 ? '⚠ ' : '✕ '}{scoreLabel(score, t)}
        </div>
      </div>

      {/* Summary */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '16px',
        marginBottom: 24,
        fontSize: 14,
        color: 'var(--text-secondary)',
        lineHeight: 1.7,
      }}>
        {analysis.summary}
      </div>

      {/* Section Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 10,
        marginBottom: 24,
      }}>
        {SECTION_KEYS.map((key) => {
          const sec = analysis[key];
          if (!sec) return null;
          const c = scoreColor(sec.score);
          const isOpen = expandedSection === key;
          return (
            <div
              key={key}
              onClick={() => setExpandedSection(isOpen ? null : key)}
              style={{
                background: 'var(--surface)',
                border: `1px solid ${isOpen ? c : 'var(--border)'}`,
                borderRadius: 10,
                padding: '12px',
                cursor: 'pointer',
                transition: 'border 0.2s',
                gridColumn: isOpen ? '1 / -1' : undefined,
              }}
            >
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
                {t.sections[key]}
              </div>
              <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, marginBottom: 6 }}>
                <div style={{
                  height: 4,
                  background: c,
                  borderRadius: 2,
                  width: `${(sec.score / 10) * 100}%`,
                  transition: 'width 0.5s ease',
                }} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: c }}>
                {sec.score}/10
              </div>
              {isOpen && (
                <div style={{ marginTop: 10, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
                    {sec.explanation}
                  </p>
                  <div style={{
                    background: 'var(--green-bg)',
                    border: '1px solid #1a3a22',
                    borderRadius: 6,
                    padding: '8px 10px',
                    fontSize: 12,
                    color: 'var(--green-muted)',
                  }}>
                    <strong>{t.fixTip}:</strong> {sec.fix_tip}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={onCheckAnother}
          style={{
            flex: 1,
            padding: '13px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 10,
            color: 'var(--text-secondary)',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {t.checkAnother}
        </button>
        <button
          onClick={handleShare}
          style={{
            flex: 1,
            padding: '13px',
            background: 'var(--green)',
            border: 'none',
            borderRadius: 10,
            color: '#000',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {copied ? t.copied : t.shareReport}
        </button>
      </div>
    </div>
  );
}

function ScoreGauge({ score, color }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const pct = score / 10;
  const dash = pct * circumference;

  return (
    <div style={{ position: 'relative', width: 130, height: 130 }}>
      <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="65" cy="65" r={radius} fill="none" stroke="var(--border)" strokeWidth="8" />
        <circle
          cx="65" cy="65" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}>
        <span style={{ fontSize: 36, fontWeight: 600, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>/10</span>
      </div>
    </div>
  );
}
