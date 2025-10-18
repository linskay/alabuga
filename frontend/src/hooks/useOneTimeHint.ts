import { useEffect, useState } from 'react';

function storageKey(login: string | null | undefined, hintId: string) {
  const user = login || localStorage.getItem('currentLogin') || 'anon';
  return `goose_hint_seen:${user}:${hintId}`;
}

export function useOneTimeHint(hintId: string, options?: { durationMs?: number; login?: string | null }) {
  const [visible, setVisible] = useState(false);
  const [hasSeen, setHasSeen] = useState<boolean>(() => {
    try {
      return localStorage.getItem(storageKey(options?.login, hintId)) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (hasSeen) return;
    setVisible(true);
    const duration = options?.durationMs ?? 6000;
    const t = window.setTimeout(() => {
      setVisible(false);
      try {
        localStorage.setItem(storageKey(options?.login, hintId), '1');
      } catch {}
      setHasSeen(true);
    }, duration);
    return () => window.clearTimeout(t);
  // Intentionally run only once on mount for first-visit behavior
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markSeen = () => {
    try { localStorage.setItem(storageKey(options?.login, hintId), '1'); } catch {}
    setHasSeen(true);
    setVisible(false);
  };

  return { visible, hasSeen, markSeen };
}
