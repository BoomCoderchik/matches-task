import { useCallback, useEffect, useRef, useState } from 'react';
import { MATCHES_URL } from '../config';
import { MatchesData, parseMatches } from '../matches';

export function useMatches() {
  const [data, setData] = useState<MatchesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const request = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setError(null);
    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 15000);
    try {
      const response = await fetch(MATCHES_URL, { signal: controller.signal, cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = parseMatches(await response.json());
      if (request.current !== controller || controller.signal.aborted) return;
      setData(result);
      setUpdatedAt(new Date());
    } catch {
      if (request.current === controller && (!controller.signal.aborted || timedOut)) {
        setError(timedOut ? 'Сервер не ответил вовремя. Попробуйте ещё раз.' : 'Не удалось загрузить матчи. Проверьте подключение и повторите попытку.');
      }
    } finally {
      clearTimeout(timeout);
      if (request.current === controller) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    return () => {
      request.current?.abort();
      request.current = null;
    };
  }, [refresh]);

  return { data, loading, error, updatedAt, refresh };
}
