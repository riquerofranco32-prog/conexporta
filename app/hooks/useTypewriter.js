"use client";
import { useState, useEffect, useRef } from "react";

// Typewriter: rota entre palabras con cursor parpadeante
export function useTypewriter(words) {
  const [display, setDisplay] = useState("");
  const state = useRef({ wordIdx: 0, charIdx: 0, deleting: false });

  useEffect(() => {
    let timeout;
    function tick() {
      const s = state.current;
      const current = words[s.wordIdx];
      if (!s.deleting) {
        s.charIdx++;
        setDisplay(current.slice(0, s.charIdx));
        if (s.charIdx >= current.length) {
          s.deleting = true;
          timeout = setTimeout(tick, 1800);
          return;
        }
        timeout = setTimeout(tick, 90);
      } else {
        s.charIdx--;
        setDisplay(current.slice(0, s.charIdx));
        if (s.charIdx <= 0) {
          s.deleting = false;
          s.wordIdx = (s.wordIdx + 1) % words.length;
          timeout = setTimeout(tick, 300);
          return;
        }
        timeout = setTimeout(tick, 45);
      }
    }
    timeout = setTimeout(tick, 500);
    return () => clearTimeout(timeout);
  }, []);

  return { display };
}
