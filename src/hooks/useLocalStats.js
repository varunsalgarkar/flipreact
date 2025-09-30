import { useCallback, useMemo } from "react";

const DEFAULTS = {
  flip_won: 0,
  flip_lost: 0,
  flip_abandoned: 0,
  flip_3x3: "-:-",
  flip_4x4: "-:-",
  flip_5x5: "-:-",
  flip_matched: 0,
  flip_wrong: 0,
};

const get = (k) => window.localStorage.getItem(k);
const set = (k, v) => window.localStorage.setItem(k, v);

export function useLocalStats() {
  const ensure = useCallback(() => {
    Object.entries(DEFAULTS).forEach(([k, v]) => {
      if (get(k) === null) set(k, v);
    });
  }, []);

  const initIfEmpty = useCallback(() => ensure(), [ensure]);

  const stats = useMemo(() => {
    ensure();
    return {
      flip_won: +get("flip_won"),
      flip_lost: +get("flip_lost"),
      flip_abandoned: +get("flip_abandoned"),
      flip_3x3: get("flip_3x3"),
      flip_4x4: get("flip_4x4"),
      flip_5x5: get("flip_5x5"),
      flip_matched: +get("flip_matched"),
      flip_wrong: +get("flip_wrong"),
    };
  }, [ensure]);

  const toTime = useCallback((nr) => {
    if (nr === "-:-") return nr;
    const s = (Number(nr) / 1000).toFixed(1).replace(/\.0$/, "");
    return `${s}s`;
  }, []);

  const recordBestTime = useCallback((gridKey, elapsedMs) => {
    const key = `flip_${gridKey}`;
    const current = get(key);
    if (current === "-:-" || Number(current) > elapsedMs) {
      set(key, String(elapsedMs));
    }
  }, []);

  const bumpGameTotals = useCallback((kind) => {
    if (kind === "won") {
      set("flip_won", String(+get("flip_won") + 1));
      set("flip_abandoned", String(Math.max(0, +get("flip_abandoned") - 1)));
    } else if (kind === "lost") {
      set("flip_lost", String(+get("flip_lost") + 1));
      set("flip_abandoned", String(Math.max(0, +get("flip_abandoned") - 1)));
    }
  }, []);

  const recordAbandoned = useCallback((delta) => {
    set("flip_abandoned", String(Math.max(0, +get("flip_abandoned") + delta)));
  }, []);

  const bumpFlip = useCallback((type) => {
    if (type === "matched") set("flip_matched", String(+get("flip_matched") + 1));
    if (type === "wrong")   set("flip_wrong", String(+get("flip_wrong") + 1));
  }, []);

  return {
    stats,
    toTime,
    initIfEmpty,
    bumpGameTotals,
    recordBestTime,
    recordAbandoned,
    bumpFlip,
  };
}
