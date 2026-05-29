"use client";
import { useEffect } from "react";

export function AnimationInit() {
  useEffect(() => {
    // Intersection Observer para fade-up en .animate-on-scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    document
      .querySelectorAll(".animate-on-scroll")
      .forEach((el) => observer.observe(el));

    // Scroll suave con offset del navbar
    const nav = document.querySelector("nav");
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const href = a.getAttribute("href");
        if (!href) return;
        const target = document.querySelector(href);
        if (!target) return;
        const navH = nav?.offsetHeight ?? 72;
        window.scrollTo({
          top: target.offsetTop - navH - 12,
          behavior: "smooth",
        });
      });
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
