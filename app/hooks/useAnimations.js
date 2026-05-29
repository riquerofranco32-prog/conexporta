"use client";
import { useState, useEffect, useLayoutEffect } from "react";

export function useScrollSetup() {
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    // Scroll instantáneo antes del paint — cubre tanto hard reload como soft nav de Next.js
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    // Segunda pasada post-hydration por si Next.js restauró después del layout
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    // Tercera pasada: algunos browsers restauran scroll después del hydration
    const t1 = setTimeout(
      () => window.scrollTo({ top: 0, left: 0, behavior: "instant" }),
      80,
    );
    const t2 = setTimeout(() => {
      document.documentElement.classList.add("smooth-scroll");
    }, 250);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);
}

// IntersectionObserver para agregar clase .visible a múltiples tipos de elementos
export function useScrollReveal() {
  useEffect(() => {
    const selectors =
      ".animate-on-scroll, .fade-in-left, .fade-in-right, .fade-in-scale, .step-line, .section-title-underline, .reveal";
    const elements = document.querySelectorAll(selectors);
    if (!elements.length) return;

    // Stagger: asigna transition-delay a hijos .reveal dentro de grids
    document.querySelectorAll(".reveal-grid").forEach((grid) => {
      Array.from(grid.querySelectorAll(".reveal")).forEach((child, i) => {
        child.style.transitionDelay = `${i * 0.1}s`;
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

export function ScrollProgressBar() {
  const progress = useScrollProgress();
  return (
    <div className="scroll-progress-bar" style={{ width: `${progress}%` }} />
  );
}
