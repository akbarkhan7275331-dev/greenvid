import React, { useState, useEffect } from 'react';
import { translations } from './i18n';
import HomePage from './pages/HomePage';
import LoadingPage from './pages/LoadingPage';
import ResultsPage from './pages/ResultsPage';
import PaywallPage from './pages/PaywallPage';

const API_BASE = process.env.REACT_APP_API_URL || '';
const MAX_FREE_CHECKS = 3;
const STORAGE_KEY = 'greenvid_checks';

function getChecksUsed() {
  try {
    return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
  } catch {
    return 0;
  }
}

function incrementChecks() {
  try {
    const n = getChecksUsed() + 1;
    localStorage.setItem(STORAGE_KEY, String(n));
    return n;
  } catch {
    return 1;
  }
}

export default function App() {
  const [lang, setLang] = useState('en');
  const [page, setPage] = useState('home'); // home | loading | results | paywall
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [checksUsed, setChecksUsed] = useState(getChecksUsed);

  const t = translations[lang];
  const checksLeft = MAX_FREE_CHECKS - checksUsed;

  const handleAnalyze = async (url) => {
    if (checksLeft <= 0) {
      setPage('paywall');
      return;
    }

    setError('');
    setPage('loading');
    setLoadingStep(0);

    // Simulate step progression while waiting for API
    const stepTimers = [800, 1800, 3000, 4500].map((delay, i) =>
      setTimeout(() => setLoadingStep(i + 1), delay)
    );

    try {
      const res = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      stepTimers.forEach(clearTimeout);

      if (!res.ok) {
        setError(data.error || t.errorGeneral);
        setPage('home');
        return;
      }

      setLoadingStep(4);
      await new Promise((r) => setTimeout(r, 600));

      const newCount = incrementChecks();
      setChecksUsed(newCount);
      setResult(data);
      setPage('results');
    } catch (err) {
      stepTimers.forEach(clearTimeout);
      setError(t.errorGeneral);
      setPage('home');
    }
  };

  const handleCheckAnother = () => {
    if (checksLeft <= 1) {
      // They just used their last check, now at 0
      setPage('paywall');
    } else {
      setResult(null);
      setPage('home');
    }
  };

  if (page === 'loading') {
    return <LoadingPage t={t} step={loadingStep} />;
  }

  if (page === 'results' && result) {
    return (
      <ResultsPage
        t={t}
        lang={lang}
        setLang={setLang}
        result={result}
        onCheckAnother={handleCheckAnother}
      />
    );
  }

  if (page === 'paywall') {
    return (
      <PaywallPage
        t={t}
        lang={lang}
        setLang={setLang}
        apiBase={API_BASE}
        onBack={() => setPage('home')}
      />
    );
  }

  return (
    <HomePage
      t={t}
      lang={lang}
      setLang={setLang}
      onAnalyze={handleAnalyze}
      checksLeft={checksLeft}
      error={error}
    />
  );
}
