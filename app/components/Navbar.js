"use client";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = [
      "chatbot",
      "como-funciona",
      "calculadora",
      "gestion",
      "contacto",
    ];
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3 },
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  const links = [
    { label: "Asistente IA", href: "#chatbot" },
    { label: "Cómo funciona", href: "#como-funciona" },
    { label: "Calculadora", href: "#calculadora" },
    { label: "Gestión", href: "#gestion" },
    { label: "Contacto", href: "#contacto" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "navbar-scrolled" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center font-bold text-sm"
              style={{ color: "#0a1628" }}
            >
              CE
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              ConExporta <span className="gold-text">AI</span>
            </span>
          </div>

          {/* Desktop links */}
          <div className="nav-ul hidden md:flex items-center gap-6">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`nav-link text-sm font-medium transition-colors ${
                  activeSection === l.href.replace("#", "")
                    ? "is-active text-yellow-400"
                    : "text-slate-300 hover:text-yellow-400"
                }`}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#chatbot"
              className="btn-gold px-4 py-2 rounded-lg text-sm"
            >
              Consultar ahora
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 flex flex-col gap-[5px] items-center justify-center"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <span
              className={`hamburger-bar ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`}
            />
            <span
              className={`hamburger-bar transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`hamburger-bar ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
            />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden mobile-menu-enter border-t border-white/10">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center w-full px-4 py-4 text-sm font-medium border-b border-white/8 transition-colors ${
                  activeSection === l.href.replace("#", "")
                    ? "text-yellow-400"
                    : "text-slate-300 hover:text-yellow-400"
                }`}
              >
                {l.label}
              </a>
            ))}
            <div className="px-4 py-3">
              <a
                href="#chatbot"
                onClick={() => setMenuOpen(false)}
                className="btn-gold w-full py-3 rounded-xl text-sm flex items-center justify-center"
              >
                Consultar ahora
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
