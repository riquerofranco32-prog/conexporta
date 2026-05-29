"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
  MessageCircle,
  Calculator,
  Building2,
  Globe,
  ChevronDown,
  Send,
  Trash2,
  Search,
  Plus,
  X,
  Package,
  FileText,
  Anchor,
  Plane,
  Truck,
  Phone,
  Mail,
  MapPin,
  Info,
  AlertTriangle,
  Tag,
  Copy,
  CheckCheck,
  ChevronRight,
} from "lucide-react";

// ─── Utility Hooks ───────────────────────────────────────────────────────────

// Fuerza scroll al top antes del primer paint (useLayoutEffect) y luego activa smooth-scroll
function useScrollSetup() {
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
function useScrollReveal() {
  useEffect(() => {
    const selectors =
      ".fade-in-up, .fade-in-left, .fade-in-right, .fade-in-scale, .step-line, .section-title-underline, .reveal";
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

function useScrollProgress() {
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

function ScrollProgressBar() {
  const progress = useScrollProgress();
  return (
    <div className="scroll-progress-bar" style={{ width: `${progress}%` }} />
  );
}

// Typewriter: rota entre palabras con cursor parpadeante
function useTypewriter(words) {
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

// Contador animado de 0 a value cuando el ref entra en viewport
function useCountUp(value, duration = 1200) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = Date.now();
          const step = () => {
            const progress = Math.min((Date.now() - start) / duration, 1);
            setCount(Math.floor(progress * value));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return { count, ref };
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar() {
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
          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`text-sm font-medium transition-colors ${
                  activeSection === l.href.replace("#", "")
                    ? "text-yellow-400"
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

// ─── Hero ─────────────────────────────────────────────────────────────────────

const ROTATE_WORDS = [
  "exportaciones",
  "importaciones",
  "Incoterms 2020",
  "logística internacional",
  "documentación aduanera",
];

function StatCard({ value, label }) {
  const match = value.match(/^(\d+)(.*)$/);
  const { count, ref } = useCountUp(match ? Number(match[1]) : 0);
  return (
    <div ref={ref} className="glass-card p-4 fade-in-up text-center">
      <div className="text-2xl font-bold gold-text">
        {match ? `${count}${match[2]}` : value}
      </div>
      <div className="text-slate-400 text-xs mt-1">{label}</div>
    </div>
  );
}

const PREVIEW_MSGS = [
  {
    role: "user",
    text: "¿Qué documentos necesito para exportar por primera vez?",
  },
  {
    role: "bot",
    text: "Para tu primera exportación necesitás:\n- **DJVE** ante AFIP\n- **Factura comercial** en inglés\n- **Packing list** detallado\n- **Certificado de origen** (si aplica)",
  },
  { role: "user", text: "¿Cuánto tarda el despacho?" },
];

function ChatPreview() {
  return (
    <div
      className="glass-card chat-preview-card p-5 max-w-sm mx-auto lg:mx-0"
      style={{ animation: "slideInRight 0.8s ease 0.3s both" }}
    >
      <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-4">
        <div
          className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center font-bold text-xs flex-shrink-0"
          style={{ color: "#0a1628" }}
        >
          CE
        </div>
        <div>
          <div className="text-white text-sm font-semibold">ConExporta AI</div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-xs">En línea · Claude AI</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {PREVIEW_MSGS.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            style={{ animation: `fadeInUp 0.4s ease ${i * 0.25 + 0.5}s both` }}
          >
            <div
              className={`max-w-[85%] px-3.5 py-2.5 text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-yellow-400 font-medium"
                  : "bg-white/10 text-slate-200"
              }`}
              style={{
                ...(m.role === "user"
                  ? {
                      color: "#0a1628",
                      borderRadius: "18px 18px 4px 18px",
                    }
                  : { borderRadius: "18px 18px 18px 4px" }),
              }}
            >
              {m.text.split("\n").map((line, j) => {
                if (line.startsWith("- ")) {
                  const parts = line.slice(2).split(/\*\*(.+?)\*\*/g);
                  return (
                    <div key={j} className="flex gap-1">
                      <span className="text-yellow-400 flex-shrink-0">•</span>
                      <span>
                        {parts.map((p, k) =>
                          k % 2 === 1 ? <strong key={k}>{p}</strong> : p,
                        )}
                      </span>
                    </div>
                  );
                }
                if (line === "") return <div key={j} className="h-1" />;
                const parts = line.split(/\*\*(.+?)\*\*/g);
                return (
                  <div key={j}>
                    {parts.map((p, k) =>
                      k % 2 === 1 ? <strong key={k}>{p}</strong> : p,
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <div className="flex justify-start">
          <div
            className="bg-white/10 px-4 py-3 flex gap-1.5 items-center"
            style={{ borderRadius: "18px 18px 18px 4px" }}
          >
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const stats = [
    { value: "24/7", label: "Disponible" },
    { value: "3 min", label: "Resp. promedio" },
    { value: "100%", label: "Gratuito" },
    { value: "ARG", label: "Especializado" },
  ];
  const { display: twDisplay } = useTypewriter(ROTATE_WORDS);

  return (
    <section className="hero-gradient min-h-dvh flex flex-col justify-center px-4 pt-20 pb-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="hero-dot-grid" />
      <div className="hero-glow hero-glow-1" />
      <div className="hero-glow hero-glow-2" />
      <div className="hero-glow-3" />

      {/* Spinning decorative rings */}
      <div className="absolute top-16 right-8 w-64 h-64 border border-yellow-400/8 rounded-full spin-slow hidden lg:block pointer-events-none" />
      <div className="absolute top-24 right-16 w-40 h-40 border border-yellow-400/5 rounded-full spin-slow-reverse hidden lg:block pointer-events-none" />

      {/* Floating decorative icons */}
      <div className="absolute top-36 right-72 float-elem-1 hidden xl:block pointer-events-none opacity-20">
        <Anchor size={40} className="text-yellow-400" />
      </div>
      <div className="absolute bottom-48 right-48 float-elem-2 hidden xl:block pointer-events-none opacity-15">
        <Plane size={32} className="text-yellow-300" />
      </div>
      <div className="absolute top-1/2 right-1/3 float-elem-3 hidden xl:block pointer-events-none opacity-10">
        <Package size={28} className="text-yellow-400" />
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: text + CTAs */}
          <div className="text-center lg:text-left">
            <div
              className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-1.5 mb-6 hero-badge"
              style={{ animation: "fadeInUp 0.4s ease 0s both" }}
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-yellow-400 text-sm font-medium">
                ✦ Consultorio de Comercio Exterior · UTN San Rafael
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-5 leading-tight"
              style={{ animation: "fadeInUp 0.6s ease 0.15s both" }}
            >
              Tu consultor de{" "}
              <span className="gold-text-animated">comercio exterior</span>
              <br />
              disponible siempre
            </h1>

            <p
              className="text-slate-300 text-lg mb-8 max-w-lg leading-relaxed mx-auto lg:mx-0"
              style={{ animation: "fadeInUp 0.6s ease 0.3s both" }}
            >
              Resolvé tus dudas sobre{" "}
              <span className="text-yellow-400 font-semibold">{twDisplay}</span>
              <span className="typewriter-cursor" /> desde Argentina — al
              instante.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-3"
              style={{ animation: "fadeInUp 0.5s ease 0.45s both" }}
            >
              <a
                href="#chatbot"
                className="btn-gold px-8 py-3 rounded-xl text-base"
              >
                Hacer una consulta
              </a>
              <a
                href="#calculadora"
                className="px-8 py-3 rounded-xl text-base border border-yellow-400/40 text-yellow-400 hover:bg-yellow-400/10 transition-colors"
              >
                Calcular envío
              </a>
            </div>

            <p
              className="text-slate-500 text-sm mb-8 text-center lg:text-left"
              style={{ animation: "fadeInUp 0.5s ease 0.45s both" }}
            >
              +200 consultas respondidas · Documentación aduanera · Incoterms
              2020
            </p>

            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
              style={{ animation: "fadeInUp 0.5s ease 0.6s both" }}
            >
              {stats.map((s) => (
                <StatCard key={s.label} value={s.value} label={s.label} />
              ))}
            </div>
          </div>

          {/* Right: Chat preview — shown below on mobile, right column on desktop */}
          <div className="mt-10 lg:mt-0 max-w-sm mx-auto lg:max-w-none lg:mx-0">
            <ChatPreview />
          </div>
        </div>
      </div>

      <a
        href="#chatbot"
        className="mt-12 text-slate-500 animate-bounce mx-auto relative z-10"
      >
        <ChevronDown size={28} />
      </a>
    </section>
  );
}

// ─── Features Bar ─────────────────────────────────────────────────────────────

function FeaturesBar() {
  const features = [
    { icon: <FileText size={15} />, label: "Documentación aduanera" },
    { icon: <Globe size={15} />, label: "Incoterms 2020" },
    { icon: <Anchor size={15} />, label: "Rutas logísticas" },
    { icon: <Package size={15} />, label: "Embalaje internacional" },
    { icon: <Building2 size={15} />, label: "AFIP · SENASA · INAL" },
    { icon: <FileText size={15} />, label: "Posiciones NCM/HS" },
    { icon: <Plane size={15} />, label: "Logística aérea" },
    { icon: <Truck size={15} />, label: "Transporte terrestre" },
  ];
  const items = [...features, ...features];

  return (
    <div className="bg-yellow-400/8 border-y border-yellow-400/15 py-3 overflow-hidden backdrop-blur-sm">
      <div className="marquee-track gap-10 items-center">
        {items.map((f, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-yellow-300 font-medium text-sm whitespace-nowrap flex-shrink-0"
          >
            <span className="text-yellow-400">{f.icon}</span>
            {f.label}
            <span className="ml-6 text-yellow-400/25">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Por qué ConExporta ───────────────────────────────────────────────────────

function PorQueConExporta() {
  const features = [
    {
      icon: <MessageCircle size={26} />,
      title: "IA Especializada",
      desc: "Entrenada con contexto de comercio exterior argentino: AFIP, SENASA, INAL y más.",
      color: "from-yellow-400/20 to-yellow-600/5",
    },
    {
      icon: <Calculator size={26} />,
      title: "Calculadora de Fletes",
      desc: "Estimaciones de costos logísticos por vía marítima, aérea y terrestre en segundos.",
      color: "from-blue-400/20 to-blue-600/5",
    },
    {
      icon: <Globe size={26} />,
      title: "Incoterms 2020",
      desc: "Explicaciones claras de todos los Incoterms con ejemplos prácticos para Argentina.",
      color: "from-green-400/20 to-green-600/5",
    },
    {
      icon: <FileText size={26} />,
      title: "Documentación",
      desc: "Guías paso a paso para DJVE, factura comercial, packing list y certificados.",
      color: "from-purple-400/20 to-purple-600/5",
    },
    {
      icon: <Building2 size={26} />,
      title: "Organismos Oficiales",
      desc: "Información actualizada sobre trámites en AFIP, SENASA, INAL, ANMAT y aduanas.",
      color: "from-orange-400/20 to-orange-600/5",
    },
    {
      icon: <Truck size={26} />,
      title: "Logística Integral",
      desc: "Puertos, rutas, forwarders y tiempos de tránsito para todas las regiones del mundo.",
      color: "from-red-400/15 to-red-600/5",
    },
  ];

  return (
    <section className="py-20 px-4 bg-white/3">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 fade-in-up">
            Todo lo que necesitás para{" "}
            <span className="gold-text-animated">exportar e importar</span>
          </h2>
          <p
            className="text-slate-400 max-w-xl mx-auto fade-in-up"
            style={{ transitionDelay: "0.1s" }}
          >
            ConExporta AI integra múltiples herramientas especializadas en una
            sola plataforma.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="feature-grid-card p-6 flex flex-col gap-4 fade-in-scale"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} border border-yellow-400/20 flex items-center justify-center text-yellow-400 feature-icon`}
              >
                {f.icon}
              </div>
              <div>
                <h3 className="text-white font-semibold text-base mb-1.5">
                  {f.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Chatbot ──────────────────────────────────────────────────────────────────

function renderMarkdown(text) {
  return text.split("\n").map((line, i) => {
    // Listas: líneas que empiezan con "- "
    if (line.startsWith("- ")) {
      const content = line.slice(2);
      const parts = content.split(/\*\*(.+?)\*\*/g);
      return (
        <div key={i} className="flex gap-1.5 items-start">
          <span className="mt-1 text-yellow-400 flex-shrink-0">•</span>
          <span>
            {parts.map((p, j) =>
              j % 2 === 1 ? <strong key={j}>{p}</strong> : p,
            )}
          </span>
        </div>
      );
    }
    // Línea vacía → espacio
    if (line.trim() === "") {
      return <div key={i} className="h-2" />;
    }
    // Negrita inline
    const parts = line.split(/\*\*(.+?)\*\*/g);
    return (
      <div key={i}>
        {parts.map((p, j) => (j % 2 === 1 ? <strong key={j}>{p}</strong> : p))}
      </div>
    );
  });
}

const SUGGESTED_QUESTIONS = [
  "¿Qué documentos necesito para exportar por primera vez?",
  "¿Cuál es la diferencia entre FOB y CIF?",
  "¿Qué hace SENASA en una exportación de alimentos?",
  "¿Cómo calculo la posición arancelaria de mi producto?",
  "¿Qué son los reintegros de exportación?",
  "¿Cuáles son los puertos principales de Argentina?",
];

function nowTime() {
  return new Date().toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const TRUNCATE_AT = 400;
const PREVIEW_LEN = 200;

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "¡Hola! Soy ConExporta AI, tu asistente de comercio exterior argentino. Podés consultarme sobre documentación aduanera, Incoterms, logística, organismos reguladores y mucho más. ¿En qué te puedo ayudar hoy?",
      time: nowTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(new Set());
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
    return () => clearTimeout(timer);
  }, [messages, loading]);

  function toggleExpand(idx) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  }

  async function sendMessage(text) {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;

    const t = nowTime();
    const updated = [...messages, { role: "user", content: userMsg, time: t }];
    setMessages(updated);
    setInput("");
    setLoading(true);
    setTimeout(() => inputRef.current?.focus(), 100);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated
            .filter(
              (m, idx) =>
                !(
                  idx === 0 &&
                  m.role === "assistant" &&
                  m.content.startsWith("¡Hola!")
                ),
            )
            .slice(-20)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages([
        ...updated,
        {
          role: "assistant",
          content: data.reply || data.error || "Error al obtener respuesta.",
          time: nowTime(),
        },
      ]);
    } catch {
      setMessages([
        ...updated,
        {
          role: "assistant",
          content: "Error de conexión. Verificá tu conexión a internet.",
          time: nowTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMessages([
      {
        role: "assistant",
        content: "¡Hola de nuevo! ¿En qué puedo ayudarte?",
        time: nowTime(),
      },
    ]);
    setExpanded(new Set());
  }

  return (
    <section id="chatbot" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 fade-in-up">
            Asistente de{" "}
            <span className="gold-text-animated">Comercio Exterior</span>
          </h2>
          <p className="text-slate-400">
            Powered by Claude · Anthropic — Especializado en operaciones
            argentinas
          </p>
        </div>

        <div className="glass-card overflow-hidden">
          {/* Chat header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center font-bold text-xs"
                style={{ color: "#0a1628" }}
              >
                CE
              </div>
              <div>
                <div className="font-semibold text-white text-sm">
                  ConExporta AI
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 text-xs">
                    En línea · Claude AI
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="text-slate-500 hover:text-red-400 transition-colors"
              title="Limpiar chat"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-5 flex flex-col gap-4">
            {messages.map((m, i) => {
              const isUser = m.role === "user";
              const isLong = m.content.length > TRUNCATE_AT;
              const isExpanded = expanded.has(i);
              const displayContent =
                isLong && !isExpanded
                  ? m.content.slice(0, PREVIEW_LEN) + "…"
                  : m.content;

              return (
                <div
                  key={i}
                  className={`chat-bubble flex flex-col ${isUser ? "items-end" : "items-start"} gap-1`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      isUser
                        ? "bg-yellow-400 font-medium whitespace-pre-wrap"
                        : "bg-white/10 text-slate-100 flex flex-col gap-0.5"
                    }`}
                    style={isUser ? { color: "#0a1628" } : {}}
                  >
                    {isUser ? displayContent : renderMarkdown(displayContent)}
                    {isLong && (
                      <button
                        onClick={() => toggleExpand(i)}
                        className={`mt-2 text-xs font-semibold underline ${isUser ? "text-navy-900/60" : "text-yellow-400/80"} hover:opacity-100`}
                        style={isUser ? { color: "rgba(10,22,40,0.6)" } : {}}
                      >
                        {isExpanded ? "Ver menos" : "Ver más"}
                      </button>
                    )}
                  </div>
                  {m.time && (
                    <span className="text-slate-600 text-xs px-1">
                      {m.time}
                    </span>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-2xl px-5 py-4 flex gap-1.5 items-center">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested questions */}
          <div className="px-5 pb-3 flex flex-wrap sm:flex-nowrap gap-2 sm:overflow-x-auto">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                disabled={loading}
                className="whitespace-nowrap text-xs px-3 py-1.5 rounded-full border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 transition-colors disabled:opacity-50 flex-shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-5 pb-5">
            <div className="flex gap-3 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                onFocus={(e) => {
                  setTimeout(
                    () =>
                      e.target.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      }),
                    300,
                  );
                }}
                placeholder="Escribí tu consulta de comercio exterior..."
                rows={2}
                disabled={loading}
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:border-yellow-400/50 disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="btn-gold p-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Calculadora ──────────────────────────────────────────────────────────────

const PUERTOS = [
  "Buenos Aires (Exolgan)",
  "Rosario (Terminal 6)",
  "San Lorenzo",
  "Bahía Blanca",
  "Mar del Plata",
  "Mendoza (terrestre)",
  "Córdoba (aéreo)",
  "Ezeiza (aéreo)",
  "Miami, USA",
  "Rotterdam, Países Bajos",
  "Shanghai, China",
  "Santos, Brasil",
  "Valparaíso, Chile",
  "Hamburgo, Alemania",
];

const INITIAL_FORM = {
  tipo: "maritimo",
  origen: "Buenos Aires (Exolgan)",
  destino: "",
  producto: "",
  peso: "",
  largo: "",
  ancho: "",
  alto: "",
};

// ── Currency helpers ──────────────────────────────────────────────────────────

const CURRENCY_CACHE_KEY = "conexporta_rates";
const CURRENCY_CACHE_TTL = 3600000; // 1 hora en ms
const CURRENCY_SYMBOLS = { USD: "USD", ARS: "$", EUR: "€", BRL: "R$" };
const CURRENCY_LOCALES = {
  USD: "en-US",
  ARS: "es-AR",
  EUR: "de-DE",
  BRL: "pt-BR",
};

async function getRates() {
  try {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(CURRENCY_CACHE_KEY);
      if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < CURRENCY_CACHE_TTL)
          return { data, timestamp };
      }
    }
    const res = await fetch("/api/currency");
    const json = await res.json();
    if (json.error) throw new Error(json.error);
    const ts = json.updatedAt ?? Date.now();
    if (typeof window !== "undefined") {
      localStorage.setItem(
        CURRENCY_CACHE_KEY,
        JSON.stringify({ timestamp: ts, data: json }),
      );
    }
    return { data: json, timestamp: ts };
  } catch {
    return null;
  }
}

function Calculadora() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rates, setRates] = useState(null);
  const [ratesError, setRatesError] = useState(false);
  const [ratesUpdatedAt, setRatesUpdatedAt] = useState(null);
  const [displayCurrency, setDisplayCurrency] = useState("USD");

  // NCM classifier state
  const [ncmQuery, setNcmQuery] = useState("");
  const [ncmResult, setNcmResult] = useState(null);
  const [ncmLoading, setNcmLoading] = useState(false);
  const [ncmError, setNcmError] = useState("");
  const [ncmCopied, setNcmCopied] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    getRates().then((res) => {
      if (!res) {
        setRatesError(true);
        return;
      }
      setRates(res.data);
      setRatesUpdatedAt(res.timestamp);
    });
  }, []);

  function setField(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function convertAmt(usdAmt) {
    if (!rates || displayCurrency === "USD" || !rates[displayCurrency])
      return usdAmt;
    return usdAmt * rates[displayCurrency];
  }

  function fmtAmt(usdAmt) {
    const val = convertAmt(usdAmt);
    const locale = CURRENCY_LOCALES[displayCurrency] ?? "en-US";
    return `${CURRENCY_SYMBOLS[displayCurrency]} ${val.toLocaleString(locale, { maximumFractionDigits: 0 })}`;
  }

  function minutesSince(ts) {
    if (!ts) return null;
    return Math.floor((Date.now() - ts) / 60000);
  }

  async function clasificarNCM() {
    if (!ncmQuery.trim()) return;
    setNcmError("");
    setNcmResult(null);
    setNcmLoading(true);
    try {
      const res = await fetch("/api/clasificar-ncm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ descripcion: ncmQuery }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setNcmResult(data);
    } catch (err) {
      setNcmError(
        err.message || "No se pudo clasificar el producto. Intentá de nuevo.",
      );
    } finally {
      setNcmLoading(false);
    }
  }

  function usarNCM() {
    if (!ncmResult) return;
    setField("producto", ncmResult.descripcion_oficial);
    document
      .getElementById("calculadora-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function generarPDF() {
    if (!result) return;
    setPdfLoading(true);
    try {
      // Fetch AI recommendations (non-blocking — PDF generates even if this fails)
      let recom = null;
      try {
        const recomRes = await fetch("/api/pdf-recomendaciones", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            producto: form.producto,
            ncm: ncmResult?.codigo_ncm || null,
            origen: form.origen,
            destino: form.destino,
            transporte: form.tipo,
            peso: form.peso,
          }),
        });
        recom = await recomRes.json();
      } catch {
        /* generate without recommendations */
      }

      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const MX = 20;
      const PW = 210;
      const CW = PW - 2 * MX;
      const COL = CW / 2;
      let y = 20;

      const sf = (r, g, b) => doc.setFillColor(r, g, b);
      const st = (r, g, b) => doc.setTextColor(r, g, b);
      const sd = (r, g, b) => doc.setDrawColor(r, g, b);

      const checkBreak = (needed) => {
        if (y + needed > 277) {
          doc.addPage();
          y = 20;
        }
      };

      const sectionTitle = (title) => {
        checkBreak(14);
        st(29, 78, 216);
        doc.setFontSize(10.5);
        doc.setFont("helvetica", "bold");
        doc.text(title, MX, y);
        sd(29, 78, 216);
        doc.setLineWidth(0.4);
        doc.line(MX, y + 2, PW - MX, y + 2);
        sd(226, 232, 240);
        doc.setLineWidth(0.1);
        y += 8;
      };

      const tableRow = (label, value) => {
        checkBreak(8);
        const rh = 7;
        sf(248, 250, 252);
        doc.rect(MX, y, COL, rh, "F");
        sf(255, 255, 255);
        doc.rect(MX + COL, y, COL, rh, "F");
        sd(226, 232, 240);
        doc.setLineWidth(0.1);
        doc.rect(MX, y, CW, rh, "S");
        st(100, 116, 139);
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "bold");
        doc.text(String(label), MX + 3, y + 4.8);
        st(30, 41, 59);
        doc.setFont("helvetica", "normal");
        const lines = doc.splitTextToSize(String(value ?? "-"), COL - 6);
        doc.text(lines[0] ?? "", MX + COL + 3, y + 4.8);
        y += rh;
      };

      // ── Header ──
      sf(29, 78, 216);
      doc.rect(MX, y, CW, 28, "F");
      sf(245, 200, 66);
      doc.rect(MX + 4, y + 4, 20, 20, "F");
      st(10, 22, 40);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("CE", MX + 14, y + 16.5, { align: "center" });
      st(255, 255, 255);
      doc.setFontSize(15);
      doc.setFont("helvetica", "bold");
      doc.text("ConExporta AI", MX + 30, y + 11);
      doc.setFontSize(9.5);
      doc.setFont("helvetica", "normal");
      doc.text("Cotizacion de Comercio Exterior", MX + 30, y + 18);
      doc.setFontSize(7.5);
      doc.text("UTN San Rafael - Mendoza, Argentina", MX + 30, y + 24);
      y += 32;

      const cotNum = `COT-${Date.now().toString().slice(-8)}`;
      const now = new Date();
      const fechaStr = now.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const horaStr = now.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      sf(241, 245, 249);
      doc.rect(MX, y, CW, 12, "F");
      st(100, 116, 139);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(`N de cotizacion: ${cotNum}`, MX + 4, y + 4.5);
      doc.text(`Fecha: ${fechaStr}   Hora: ${horaStr} hs`, MX + 4, y + 9.5);
      y += 16;

      // ── Section 1: Ficha del Envio ──
      sectionTitle("SECCION 1 - FICHA DEL ENVIO");
      const modoLabel =
        form.tipo === "aereo"
          ? "Aereo"
          : form.tipo === "terrestre"
            ? "Terrestre"
            : "Maritimo";
      tableRow("Origen", form.origen);
      tableRow("Destino", form.destino);
      tableRow("Modo de transporte", modoLabel);
      tableRow("Producto", form.producto);
      tableRow("Peso total", `${form.peso} kg`);
      if (form.largo && form.ancho && form.alto) {
        tableRow(
          "Dimensiones",
          `${form.largo} x ${form.ancho} x ${form.alto} cm`,
        );
        const volM3 = (
          (Number(form.largo) * Number(form.ancho) * Number(form.alto)) /
          1000000
        ).toFixed(3);
        tableRow("Volumen estimado", `${volM3} m3`);
      }
      y += 5;

      // ── Section 2: NCM (conditional) ──
      if (ncmResult) {
        checkBreak(60);
        sectionTitle("SECCION 2 - POSICION ARANCELARIA NCM/HS");
        tableRow("Codigo NCM", ncmResult.codigo_ncm);
        tableRow("Codigo HS (6 digitos)", ncmResult.codigo_hs6);
        tableRow("Descripcion oficial", ncmResult.descripcion_oficial);
        tableRow("Seccion arancelaria", ncmResult.seccion);
        tableRow("Capitulo", ncmResult.capitulo);
        tableRow(
          "Nivel de confianza",
          ncmResult.confianza
            ? ncmResult.confianza.charAt(0).toUpperCase() +
                ncmResult.confianza.slice(1)
            : "-",
        );
        st(148, 163, 184);
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "italic");
        doc.text(
          "* Clasificacion orientativa. Verificar con despachante de aduana oficial.",
          MX,
          y + 5,
        );
        y += 11;
      }

      // ── Section 3: Costos ──
      checkBreak(55);
      sectionTitle("SECCION 3 - DESGLOSE DE COSTOS ESTIMADOS");
      sf(29, 78, 216);
      doc.rect(MX, y, CW, 7, "F");
      st(255, 255, 255);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.text("Concepto", MX + 3, y + 5);
      doc.text("Estimado (USD)", MX + CW - 44, y + 5);
      y += 7;
      tableRow(
        "Flete internacional",
        `USD ${result.flete_min?.toLocaleString() ?? 0} - ${result.flete_max?.toLocaleString() ?? 0}`,
      );
      tableRow(
        "Seguro de carga",
        `USD ${result.seguro_min?.toLocaleString() ?? 0} - ${result.seguro_max?.toLocaleString() ?? 0}`,
      );

      const totalMid = Math.round(
        ((result.flete_min ?? 0) +
          (result.flete_max ?? 0) +
          (result.seguro_min ?? 0) +
          (result.seguro_max ?? 0)) /
          2,
      );
      checkBreak(10);
      sf(254, 243, 199);
      doc.rect(MX, y, CW, 8, "F");
      sd(217, 119, 6);
      doc.setLineWidth(0.4);
      doc.rect(MX, y, CW, 8, "S");
      doc.setLineWidth(0.1);
      st(146, 64, 14);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("TOTAL ESTIMADO", MX + 3, y + 5.5);
      doc.text(`USD ${totalMid.toLocaleString()}`, MX + CW - 44, y + 5.5);
      y += 8;

      if (rates?.ARS) {
        st(100, 116, 139);
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "italic");
        doc.text(
          `Aprox. $ ${Math.round(totalMid * rates.ARS).toLocaleString("es-AR")} ARS (TC: 1 USD = ${Math.round(rates.ARS).toLocaleString("es-AR")} ARS)`,
          MX,
          y + 5,
        );
        y += 10;
      } else {
        y += 4;
      }

      // ── Section 4: Tiempos ──
      checkBreak(45);
      sectionTitle("SECCION 4 - TIEMPOS Y LOGISTICA");
      tableRow(
        "Tiempo de transito estimado",
        `${result.tiempo_dias_min ?? "-"} - ${result.tiempo_dias_max ?? "-"} dias`,
      );
      tableRow("Incoterm sugerido", result.incoterm_recomendado || "-");
      if (result.documentos_clave?.length) {
        tableRow("Documentacion clave", result.documentos_clave.join(", "));
      }
      if (result.notas) {
        y += 4;
        checkBreak(22);
        const notaLines = doc.splitTextToSize(`Nota: ${result.notas}`, CW - 8);
        const notaH = Math.max(12, notaLines.length * 5 + 6);
        sf(239, 246, 255);
        doc.rect(MX, y, CW, notaH, "F");
        st(29, 78, 216);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(notaLines, MX + 4, y + 5);
        y += notaH + 4;
      }

      // ── Page 2: Recommendations ──
      doc.addPage();
      y = 20;

      sf(29, 78, 216);
      doc.rect(MX, y, CW, 12, "F");
      st(255, 255, 255);
      doc.setFontSize(10.5);
      doc.setFont("helvetica", "bold");
      doc.text(
        "SECCION 5 - RECOMENDACIONES DEL ESPECIALISTA IA",
        MX + 4,
        y + 8,
      );
      y += 16;

      st(100, 116, 139);
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.text(
        "Analisis generado por Claude AI - ConExporta - UTN San Rafael",
        MX,
        y,
      );
      y += 10;

      if (recom && !recom.error) {
        const renderList = (title, items) => {
          if (!items?.length) return;
          checkBreak(10 + items.length * 6);
          st(29, 78, 216);
          doc.setFontSize(9.5);
          doc.setFont("helvetica", "bold");
          doc.text(title, MX, y);
          y += 6;
          st(30, 41, 59);
          doc.setFontSize(8.5);
          doc.setFont("helvetica", "normal");
          for (const item of items) {
            checkBreak(7);
            const lines = doc.splitTextToSize(`- ${item}`, CW - 8);
            doc.text(lines, MX + 4, y);
            y += lines.length * 5 + 1;
          }
          y += 5;
        };

        renderList("Documentacion Requerida", recom.documentacion_requerida);
        renderList(
          "Organismos Intervinientes",
          recom.organismos_intervinientes,
        );

        if (recom.incoterm_recomendado) {
          checkBreak(18);
          st(29, 78, 216);
          doc.setFontSize(9.5);
          doc.setFont("helvetica", "bold");
          doc.text("Incoterm Recomendado", MX, y);
          y += 6;
          st(30, 41, 59);
          doc.setFontSize(8.5);
          doc.setFont("helvetica", "normal");
          const incLines = doc.splitTextToSize(
            recom.incoterm_recomendado,
            CW - 4,
          );
          doc.text(incLines, MX + 4, y);
          y += incLines.length * 5 + 6;
        }

        renderList("Riesgos a Considerar", recom.riesgos_a_considerar);
        renderList(
          "Recomendaciones Generales",
          recom.recomendaciones_generales,
        );

        if (recom.tiempo_tramitacion_estimado) {
          checkBreak(16);
          st(29, 78, 216);
          doc.setFontSize(9.5);
          doc.setFont("helvetica", "bold");
          doc.text("Tiempo de Tramitacion Estimado", MX, y);
          y += 6;
          st(30, 41, 59);
          doc.setFontSize(8.5);
          doc.setFont("helvetica", "normal");
          doc.text(recom.tiempo_tramitacion_estimado, MX + 4, y);
          y += 10;
        }
      } else {
        sf(254, 243, 199);
        doc.rect(MX, y, CW, 14, "F");
        st(146, 64, 14);
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "normal");
        doc.text(
          "Las recomendaciones IA no estuvieron disponibles al generar este documento.",
          MX + 4,
          y + 9,
        );
        y += 18;
      }

      // ── Footer on last page ──
      const footY = 276;
      sd(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(MX, footY, PW - MX, footY);
      st(148, 163, 184);
      doc.setFontSize(7);
      doc.setFont("helvetica", "italic");
      doc.text(
        "Este documento es una estimacion orientativa generada por IA. No constituye asesoramiento legal ni oficial.",
        MX,
        footY + 5,
      );
      doc.text(
        "Verificar siempre con un despachante de aduana habilitado y los organismos oficiales vigentes.",
        MX,
        footY + 10,
      );
      doc.text(`ConExporta AI - UTN San Rafael - ${fechaStr}`, MX, footY + 16);

      // Page numbers on all pages
      const totalPages = doc.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        st(148, 163, 184);
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.text(`Pagina ${p} de ${totalPages}`, PW - MX, 290, {
          align: "right",
        });
      }

      doc.save(`ConExporta-${cotNum}.pdf`);
    } catch (err) {
      console.error("[generarPDF]", err);
      setError("No se pudo generar el PDF. Intentá de nuevo.");
    } finally {
      setPdfLoading(false);
    }
  }

  // Calcula el peso volumétrico según el tipo de transporte
  const pesoVolumetrico = (() => {
    const l = Number(form.largo);
    const a = Number(form.ancho);
    const h = Number(form.alto);
    if (!l || !a || !h) return null;
    const divisor = form.tipo === "aereo" ? 5000 : 6000;
    return parseFloat(((l * a * h) / divisor).toFixed(2));
  })();

  const pesoFacturable = (() => {
    const real = Number(form.peso);
    if (!pesoVolumetrico || !real) return null;
    return Math.max(real, pesoVolumetrico);
  })();

  async function calcular(e) {
    e.preventDefault();
    if (
      !form.destino ||
      !form.producto ||
      !form.peso ||
      Number(form.peso) <= 0
    ) {
      setError("Completá destino, producto y peso para continuar.");
      return;
    }
    setError("");
    setResult(null);
    setLoading(true);

    const pesoParaFacturar = pesoFacturable ?? Number(form.peso);
    const notaVolumen =
      pesoVolumetrico !== null
        ? `- Peso volumétrico: ${pesoVolumetrico} kg (${form.tipo === "aereo" ? "fórmula /5000" : "fórmula /6000"})
- Peso a facturar: ${pesoParaFacturar} kg (${pesoFacturable !== null && pesoFacturable === pesoVolumetrico ? "se usa el volumétrico, es mayor" : "se usa el real, es mayor"})`
        : "";

    const prompt = `Sos un experto en costos logísticos argentinos.
El usuario quiere calcular un envío con estos datos:
- Tipo de transporte: ${form.tipo}
- Origen: ${form.origen}
- Destino: ${form.destino}
- Peso real: ${form.peso} kg
- Producto: ${form.producto}
${ncmResult ? `- Código NCM: ${ncmResult.codigo_ncm}\n- Código HS: ${ncmResult.codigo_hs6}` : ""}
${form.largo ? `- Dimensiones: ${form.largo}x${form.ancho}x${form.alto} cm` : ""}
${notaVolumen}

Respondé SOLO con un JSON válido sin texto extra ni markdown, con esta estructura exacta:
{
  "flete_min": 1200,
  "flete_max": 1800,
  "seguro_min": 80,
  "seguro_max": 120,
  "tiempo_dias_min": 20,
  "tiempo_dias_max": 35,
  "moneda": "USD",
  "incoterm_recomendado": "FOB",
  "documentos_clave": ["Factura comercial", "Packing list"],
  "notas": "Consideraciones importantes del envío."
}`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          mode: "calculator",
        }),
      });
      const data = await res.json();
      const raw = data.reply || "";
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        // Limpiar markdown fences y reintentar
        const cleaned = raw
          .replace(/^```(?:json)?s*/i, "")
          .replace(/s*```$/, "")
          .trim();
        try {
          parsed = JSON.parse(cleaned);
        } catch {
          // Extracción greedy: toma el bloque JSON más externo
          const jsonMatch = raw.match(/{[sS]*}/);
          if (!jsonMatch)
            throw new Error("Respuesta inesperada del asistente.");
          parsed = JSON.parse(jsonMatch[0]);
        }
      }
      setResult(parsed);
    } catch (err) {
      setError("No se pudo calcular el envío. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  const transporteIcons = {
    maritimo: <Anchor size={16} />,
    aereo: <Plane size={16} />,
    terrestre: <Truck size={16} />,
  };

  return (
    <section id="calculadora" className="py-20 px-4 bg-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 fade-in-up">
            Calculadora de <span className="gold-text-animated">Envíos</span>
          </h2>
          <p className="text-slate-400">
            Estimaciones orientativas de flete, seguro y tiempos de tránsito —
            powered by Claude AI
          </p>
        </div>

        {/* ── Clasificador NCM ── */}
        <div className="mb-8">
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-1">
              <Tag size={16} className="text-yellow-400" />
              <h3 className="text-white font-semibold text-base">
                Clasificador de Posición Arancelaria
              </h3>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Encontrá el código NCM/HS de tu producto — powered by Claude AI
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <textarea
                rows={2}
                value={ncmQuery}
                onChange={(e) => setNcmQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    clasificarNCM();
                  }
                }}
                placeholder="Describí tu producto: material, uso, características... Ej: zapatillas de cuero vacuno con suela de goma"
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400/50 resize-none"
              />
              <button
                type="button"
                onClick={clasificarNCM}
                disabled={ncmLoading || !ncmQuery.trim()}
                className="btn-gold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 disabled:opacity-50 self-start sm:self-end"
              >
                <Search size={15} />
                {ncmLoading ? "Clasificando..." : "Clasificar producto"}
              </button>
            </div>

            {ncmLoading && (
              <div className="mt-4 flex items-center gap-3 text-slate-400 text-sm">
                <div className="flex gap-1">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
                Claude está analizando tu producto...
              </div>
            )}

            {ncmError && (
              <div className="mt-3 flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2.5">
                <AlertTriangle
                  size={15}
                  className="text-red-400 flex-shrink-0"
                />
                <p className="text-red-400 text-sm">{ncmError}</p>
              </div>
            )}

            {ncmResult && (
              <div className="mt-4 border border-white/10 rounded-xl p-5 bg-white/5">
                <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-yellow-400" />
                    <span className="text-white font-semibold text-sm">
                      Posición Arancelaria Sugerida
                    </span>
                  </div>
                  {ncmResult.validado_hs && (
                    <span className="text-xs text-green-400 flex items-center gap-1">
                      <CheckCheck size={13} />
                      Validado en base HS internacional
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs">NCM:</span>
                    <span
                      className="bg-yellow-400 text-xs font-bold px-2.5 py-1 rounded-md"
                      style={{ color: "#0a1628" }}
                    >
                      {ncmResult.codigo_ncm}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs">HS:</span>
                    <span className="bg-white/10 text-slate-300 text-xs font-mono px-2.5 py-1 rounded-md">
                      {ncmResult.codigo_hs6}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs">Confianza:</span>
                    <span
                      className={`flex items-center gap-1 text-xs font-medium ${
                        ncmResult.confianza === "alta"
                          ? "text-green-400"
                          : ncmResult.confianza === "media"
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                    >
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          ncmResult.confianza === "alta"
                            ? "bg-green-400"
                            : ncmResult.confianza === "media"
                              ? "bg-yellow-400"
                              : "bg-red-400"
                        }`}
                      />
                      {ncmResult.confianza?.charAt(0).toUpperCase() +
                        ncmResult.confianza?.slice(1)}
                    </span>
                  </div>
                </div>

                <p className="text-slate-200 text-sm font-medium mb-1">
                  &ldquo;{ncmResult.descripcion_oficial}&rdquo;
                </p>
                <p className="text-slate-400 text-xs mb-3">
                  {ncmResult.seccion} · {ncmResult.capitulo}
                </p>

                {ncmResult.notas && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2.5 mb-3">
                    <p className="text-blue-300 text-xs font-medium mb-0.5">
                      Notas del clasificador
                    </p>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {ncmResult.notas}
                    </p>
                  </div>
                )}

                {ncmResult.alternativas?.length > 0 && (
                  <p className="text-slate-500 text-xs mb-3">
                    Códigos alternativos: {ncmResult.alternativas.join(" / ")}
                  </p>
                )}

                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={usarNCM}
                    className="btn-gold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5"
                  >
                    <ChevronRight size={13} />
                    Usar este NCM en la calculadora
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(ncmResult.codigo_ncm);
                      setNcmCopied(true);
                      setTimeout(() => setNcmCopied(false), 2000);
                    }}
                    className="px-4 py-2 rounded-lg text-xs border border-white/20 text-slate-300 hover:border-yellow-400/40 flex items-center gap-1.5 transition-colors"
                  >
                    {ncmCopied ? (
                      <CheckCheck size={13} className="text-green-400" />
                    ) : (
                      <Copy size={13} />
                    )}
                    {ncmCopied ? "¡Copiado!" : "Copiar código"}
                  </button>
                </div>
              </div>
            )}

            <p className="text-slate-500 text-xs mt-3 flex items-start gap-1.5">
              <AlertTriangle
                size={12}
                className="mt-0.5 flex-shrink-0 text-amber-500"
              />
              Resultado orientativo. Verificá siempre con un despachante de
              aduana oficial.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <form
            id="calculadora-form"
            onSubmit={calcular}
            className="glass-card p-6 flex flex-col gap-5"
          >
            {/* Tipo de transporte */}
            <div>
              <label className="text-slate-300 text-sm font-medium mb-2 block">
                Tipo de transporte
              </label>
              <div className="flex gap-3">
                {["maritimo", "aereo", "terrestre"].map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setField("tipo", t)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border transition-all capitalize ${
                      form.tipo === t
                        ? "bg-yellow-400 border-yellow-400"
                        : "border-white/20 text-slate-400 hover:border-yellow-400/40"
                    }`}
                    style={form.tipo === t ? { color: "#0a1628" } : {}}
                  >
                    {transporteIcons[t]}
                    {t === "maritimo"
                      ? "Marítimo"
                      : t === "aereo"
                        ? "Aéreo"
                        : "Terrestre"}
                  </button>
                ))}
              </div>
            </div>

            {/* Origen */}
            <div>
              <label className="text-slate-300 text-sm font-medium mb-2 block">
                Puerto / ciudad de origen
              </label>
              <select
                value={form.origen}
                onChange={(e) => setField("origen", e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400/50"
              >
                {PUERTOS.map((p) => (
                  <option key={p} value={p} className="bg-gray-900">
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Destino */}
            <div>
              <label className="text-slate-300 text-sm font-medium mb-2 block">
                Puerto / ciudad de destino *
              </label>
              <input
                type="text"
                value={form.destino}
                onChange={(e) => setField("destino", e.target.value)}
                placeholder="ej: Rotterdam, Países Bajos"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400/50"
              />
            </div>

            {/* Producto */}
            <div>
              <label className="text-slate-300 text-sm font-medium mb-2 block">
                Tipo de producto *
              </label>
              <input
                type="text"
                value={form.producto}
                onChange={(e) => setField("producto", e.target.value)}
                placeholder="ej: aceite de soja, cuero curtido, software"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400/50"
              />
            </div>

            {/* Peso */}
            <div>
              <label className="text-slate-300 text-sm font-medium mb-2 block">
                Peso real (kg) *
              </label>
              <input
                type="number"
                value={form.peso}
                onChange={(e) => setField("peso", e.target.value)}
                placeholder="500"
                min="0"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400/50"
              />
            </div>

            {/* Dimensiones */}
            <div>
              <label className="text-slate-300 text-sm font-medium mb-2 block">
                Dimensiones embalaje (cm) — opcional
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                {["largo", "ancho", "alto"].map((d) => (
                  <input
                    key={d}
                    type="number"
                    value={form[d]}
                    onChange={(e) => setField(d, e.target.value)}
                    placeholder={d.charAt(0).toUpperCase() + d.slice(1)}
                    min="0"
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400/50"
                  />
                ))}
              </div>
              {/* Peso volumétrico calculado */}
              {pesoVolumetrico !== null && (
                <div className="mt-2 flex items-start gap-2 bg-yellow-400/5 border border-yellow-400/20 rounded-lg px-3 py-2">
                  <Info
                    size={14}
                    className="text-yellow-400 mt-0.5 flex-shrink-0"
                  />
                  <div className="text-xs text-slate-300 leading-relaxed">
                    <span className="font-medium text-yellow-400">
                      Peso volumétrico: {pesoVolumetrico} kg
                    </span>
                    {" — Se factura el mayor"}
                    {pesoFacturable !== null && (
                      <span className="block text-slate-400 mt-0.5">
                        Peso a facturar:{" "}
                        <span className="font-medium text-white">
                          {pesoFacturable} kg
                        </span>{" "}
                        (
                        {pesoFacturable === pesoVolumetrico
                          ? "volumétrico"
                          : "real"}
                        )
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Error — justo arriba del botón */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2.5">
                <AlertTriangle
                  size={15}
                  className="text-red-400 flex-shrink-0"
                />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Calculator size={16} />
              {loading ? "Calculando con IA..." : "Calcular envío"}
            </button>
          </form>

          {/* Result */}
          <div className="glass-card p-6 flex flex-col gap-5">
            {!result && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 text-slate-500">
                <Calculator size={48} className="opacity-30" />
                <p className="text-sm">
                  Completá el formulario para obtener una estimación de costos
                  logísticos.
                </p>
              </div>
            )}

            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="flex gap-2">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
                <p className="text-slate-400 text-sm">
                  Claude está analizando las rutas logísticas...
                </p>
              </div>
            )}

            {result && (
              <>
                {/* Header + toggle de moneda */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-white font-semibold text-lg">
                    Estimación de costos
                  </h3>
                  <div className="flex gap-1 bg-white/5 rounded-lg p-1">
                    {["USD", "ARS", "EUR", "BRL"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setDisplayCurrency(c)}
                        disabled={c !== "USD" && (!rates || !rates[c])}
                        className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                          displayCurrency === c
                            ? "bg-yellow-400"
                            : "text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        }`}
                        style={
                          displayCurrency === c ? { color: "#0a1628" } : {}
                        }
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {ratesError && (
                  <div className="flex items-center gap-2 text-amber-400 text-xs bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
                    <AlertTriangle size={13} className="flex-shrink-0" />
                    Tipo de cambio no disponible — mostrando valores en USD
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {/* Flete */}
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-slate-400 text-xs mb-1">
                      Flete estimado
                    </div>
                    <div className="text-yellow-400 font-bold text-lg">
                      {fmtAmt(result.flete_min ?? 0)} –{" "}
                      {fmtAmt(result.flete_max ?? 0)}
                    </div>
                    {displayCurrency !== "USD" && (
                      <div className="text-slate-500 text-xs mt-0.5">
                        USD {result.flete_min?.toLocaleString()} –{" "}
                        {result.flete_max?.toLocaleString()}
                      </div>
                    )}
                    {displayCurrency === "USD" && rates?.ARS && (
                      <div className="text-slate-500 text-xs mt-0.5">
                        ${" "}
                        {(result.flete_min * rates.ARS).toLocaleString(
                          "es-AR",
                          { maximumFractionDigits: 0 },
                        )}{" "}
                        –{" "}
                        {(result.flete_max * rates.ARS).toLocaleString(
                          "es-AR",
                          { maximumFractionDigits: 0 },
                        )}{" "}
                        ARS
                      </div>
                    )}
                  </div>

                  {/* Seguro */}
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-slate-400 text-xs mb-1">
                      Seguro de carga
                    </div>
                    <div className="text-yellow-400 font-bold text-lg">
                      {fmtAmt(result.seguro_min ?? 0)} –{" "}
                      {fmtAmt(result.seguro_max ?? 0)}
                    </div>
                    {displayCurrency !== "USD" && (
                      <div className="text-slate-500 text-xs mt-0.5">
                        USD {result.seguro_min} – {result.seguro_max}
                      </div>
                    )}
                    {displayCurrency === "USD" && rates?.ARS && (
                      <div className="text-slate-500 text-xs mt-0.5">
                        ${" "}
                        {(result.seguro_min * rates.ARS).toLocaleString(
                          "es-AR",
                          { maximumFractionDigits: 0 },
                        )}{" "}
                        –{" "}
                        {(result.seguro_max * rates.ARS).toLocaleString(
                          "es-AR",
                          { maximumFractionDigits: 0 },
                        )}{" "}
                        ARS
                      </div>
                    )}
                  </div>

                  {/* Tránsito */}
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-slate-400 text-xs mb-1">
                      Tiempo de tránsito
                    </div>
                    <div className="text-white font-bold text-lg">
                      {result.tiempo_dias_min} – {result.tiempo_dias_max} días
                    </div>
                  </div>

                  {/* Incoterm */}
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-slate-400 text-xs mb-1">
                      Incoterm recomendado
                    </div>
                    <div className="text-green-400 font-bold text-lg">
                      {result.incoterm_recomendado}
                    </div>
                  </div>

                  {/* Total estimado */}
                  <div className="col-span-2 bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-4">
                    <div className="text-yellow-400 text-xs font-medium mb-1">
                      Total estimado (flete + seguro)
                    </div>
                    <div className="text-yellow-300 font-bold text-xl">
                      {fmtAmt(
                        (result.flete_min ?? 0) + (result.seguro_min ?? 0),
                      )}{" "}
                      –{" "}
                      {fmtAmt(
                        (result.flete_max ?? 0) + (result.seguro_max ?? 0),
                      )}
                    </div>
                    {displayCurrency !== "USD" && (
                      <div className="text-slate-500 text-xs mt-0.5">
                        USD{" "}
                        {(
                          (result.flete_min ?? 0) + (result.seguro_min ?? 0)
                        ).toLocaleString()}{" "}
                        –{" "}
                        {(
                          (result.flete_max ?? 0) + (result.seguro_max ?? 0)
                        ).toLocaleString()}
                      </div>
                    )}
                    {displayCurrency === "USD" && rates?.ARS && (
                      <div className="text-yellow-400/70 text-sm mt-1.5 font-medium">
                        ${" "}
                        {(
                          ((result.flete_min ?? 0) + (result.seguro_min ?? 0)) *
                          rates.ARS
                        ).toLocaleString("es-AR", {
                          maximumFractionDigits: 0,
                        })}{" "}
                        –{" "}
                        {(
                          ((result.flete_max ?? 0) + (result.seguro_max ?? 0)) *
                          rates.ARS
                        ).toLocaleString("es-AR", {
                          maximumFractionDigits: 0,
                        })}{" "}
                        ARS
                      </div>
                    )}
                    {rates?.ARS && (
                      <div className="text-slate-500 text-xs mt-2 leading-relaxed">
                        Tipo de cambio: 1 USD ={" "}
                        {rates.ARS.toLocaleString("es-AR", {
                          maximumFractionDigits: 0,
                        })}{" "}
                        ARS
                        {ratesUpdatedAt !== null &&
                          ` · actualizado hace ${minutesSince(ratesUpdatedAt)} min`}
                        {" · "}Fuente: CurrencyAPI
                      </div>
                    )}
                  </div>
                </div>

                {result.documentos_clave?.length > 0 && (
                  <div>
                    <div className="text-slate-400 text-xs mb-2">
                      Documentación requerida
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.documentos_clave.map((d) => (
                        <span
                          key={d}
                          className="text-xs px-3 py-1 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 rounded-full"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {result.notas && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <div className="text-blue-300 text-xs font-medium mb-1">
                      Notas del asistente
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {result.notas}
                    </p>
                  </div>
                )}

                <div className="flex items-start gap-1.5">
                  <Info
                    size={13}
                    className="text-slate-400 mt-0.5 flex-shrink-0"
                  />
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Estimaciones orientativas. Consultá con un despachante para
                    valores exactos.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={generarPDF}
                  disabled={pdfLoading}
                  className="btn-gold w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FileText size={16} />
                  {pdfLoading ? "Generando PDF..." : "Descargar cotización PDF"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Gestión de Firmas (Mini-CRM) ─────────────────────────────────────────────

const EMPRESA_TIPOS = ["Exportador", "Importador", "Exportador/Importador"];
const EMPRESA_ESTADOS = ["Activo", "Pendiente", "Inactivo"];

const INITIAL_EMPRESA = {
  razonSocial: "",
  cuit: "",
  contacto: "",
  email: "",
  tipo: "Exportador",
  estado: "Activo",
};

function GestionFirmas() {
  const [empresas, setEmpresas] = useState([
    {
      id: 1,
      razonSocial: "Agro Export SA",
      cuit: "30-12345678-9",
      contacto: "Carlos Pérez",
      email: "cperez@agroexport.com.ar",
      tipo: "Exportador",
      estado: "Activo",
    },
    {
      id: 2,
      razonSocial: "Import Tech SRL",
      cuit: "30-98765432-1",
      contacto: "María González",
      email: "mgonzalez@importech.com.ar",
      tipo: "Importador",
      estado: "Activo",
    },
    {
      id: 3,
      razonSocial: "Global Trade ARG",
      cuit: "30-55566677-8",
      contacto: "Juan Rodríguez",
      email: "jrodriguez@globaltrade.ar",
      tipo: "Exportador/Importador",
      estado: "Pendiente",
    },
  ]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(INITIAL_EMPRESA);
  const [showForm, setShowForm] = useState(false);
  const [nextId, setNextId] = useState(4);
  const [formError, setFormError] = useState("");

  const filtered = empresas.filter(
    (e) =>
      e.razonSocial.toLowerCase().includes(search.toLowerCase()) ||
      e.cuit.includes(search) ||
      e.contacto.toLowerCase().includes(search.toLowerCase()),
  );

  const stats = {
    total: empresas.length,
    activas: empresas.filter((e) => e.estado === "Activo").length,
    pendientes: empresas.filter((e) => e.estado === "Pendiente").length,
  };

  function setField(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function agregarEmpresa(e) {
    e.preventDefault();
    if (
      !form.razonSocial ||
      !form.cuit ||
      !form.contacto ||
      !form.email ||
      !form.email.includes("@")
    ) {
      setFormError(
        "Completá todos los campos obligatorios con un email válido.",
      );
      return;
    }
    setFormError("");
    setEmpresas((prev) => [...prev, { ...form, id: nextId }]);
    setNextId((n) => n + 1);
    setForm(INITIAL_EMPRESA);
    setShowForm(false);
  }

  function eliminarEmpresa(id) {
    setEmpresas((prev) => prev.filter((e) => e.id !== id));
  }

  const estadoColor = {
    Activo: "text-green-400 bg-green-400/10",
    Pendiente: "text-yellow-400 bg-yellow-400/10",
    Inactivo: "text-slate-400 bg-slate-400/10",
  };

  return (
    <section id="gestion" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 fade-in-up">
            Gestión de <span className="gold-text">Firmas</span>
          </h2>
          <p className="text-slate-400">
            Mini-CRM para gestionar los operadores de comercio exterior del
            consultorio
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Total empresas",
              value: stats.total,
              color: "text-white",
            },
            { label: "Activas", value: stats.activas, color: "text-green-400" },
            {
              label: "Pendientes",
              value: stats.pendientes,
              color: "text-yellow-400",
            },
          ].map((s, i) => (
            <div
              key={s.label}
              className="glass-card p-5 text-center fade-in-scale"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-slate-400 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search & Add */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por empresa, CUIT o contacto..."
              className="w-full bg-white/10 border border-white/20 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400/50"
            />
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-gold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2"
          >
            <Plus size={16} />
            Nueva firma
          </button>
        </div>

        {/* New empresa form */}
        {showForm && (
          <form
            onSubmit={agregarEmpresa}
            className="glass-card p-6 mb-6 grid sm:grid-cols-2 gap-4"
          >
            <h3 className="text-white font-semibold sm:col-span-2">
              Registrar nueva empresa
            </h3>
            {[
              {
                key: "razonSocial",
                label: "Razón social *",
                placeholder: "Empresa SA",
              },
              { key: "cuit", label: "CUIT *", placeholder: "30-12345678-9" },
              {
                key: "contacto",
                label: "Contacto *",
                placeholder: "Nombre apellido",
              },
              {
                key: "email",
                label: "Email *",
                placeholder: "contacto@empresa.com",
              },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-slate-400 text-xs mb-1 block">
                  {f.label}
                </label>
                <input
                  type={f.key === "email" ? "email" : "text"}
                  value={form[f.key]}
                  onChange={(e) => setField(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400/50"
                />
              </div>
            ))}
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Tipo</label>
              <select
                value={form.tipo}
                onChange={(e) => setField("tipo", e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400/50"
              >
                {EMPRESA_TIPOS.map((t) => (
                  <option key={t} value={t} className="bg-gray-900">
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">
                Estado
              </label>
              <select
                value={form.estado}
                onChange={(e) => setField("estado", e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400/50"
              >
                {EMPRESA_ESTADOS.map((s) => (
                  <option key={s} value={s} className="bg-gray-900">
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2 flex flex-col gap-3">
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="btn-gold px-6 py-2 rounded-lg text-sm"
                  style={{ color: "#0a1628" }}
                >
                  Guardar empresa
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setForm(INITIAL_EMPRESA);
                    setFormError("");
                  }}
                  className="px-6 py-2 rounded-lg text-sm border border-white/20 text-slate-400 hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
              </div>
              {formError && <p className="text-red-400 text-sm">{formError}</p>}
            </div>
          </form>
        )}

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="table-mobile-wrapper overflow-x-auto">
            <table className="table-mobile w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-left">
                  <th className="px-5 py-3 font-medium">Empresa</th>
                  <th className="px-5 py-3 font-medium">CUIT</th>
                  <th className="px-5 py-3 font-medium">Contacto</th>
                  <th className="px-5 py-3 font-medium">Tipo</th>
                  <th className="px-5 py-3 font-medium">Estado</th>
                  <th className="px-5 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500">
                      No se encontraron empresas.
                    </td>
                  </tr>
                )}
                {filtered.map((e) => (
                  <tr
                    key={e.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td data-label="Empresa" className="px-5 py-3">
                      <div className="font-medium text-white">
                        {e.razonSocial}
                      </div>
                      <div className="text-slate-500 text-xs">{e.email}</div>
                    </td>
                    <td
                      data-label="CUIT"
                      className="px-5 py-3 text-slate-300 font-mono text-xs"
                    >
                      {e.cuit}
                    </td>
                    <td
                      data-label="Contacto"
                      className="px-5 py-3 text-slate-300"
                    >
                      {e.contacto}
                    </td>
                    <td
                      data-label="Tipo"
                      className="px-5 py-3 text-slate-400 text-xs"
                    >
                      {e.tipo}
                    </td>
                    <td data-label="Estado" className="px-5 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${estadoColor[e.estado]}`}
                      >
                        {e.estado}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => eliminarEmpresa(e.id)}
                        className="text-slate-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-slate-600 text-xs mt-3 text-center">
          Los datos se almacenan en memoria. Para persistencia real integrá
          Supabase en versiones futuras.
        </p>
      </div>
    </section>
  );
}

// ─── Contacto ─────────────────────────────────────────────────────────────────

function Contacto() {
  return (
    <section id="contacto" className="py-20 px-4 bg-white/5">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 fade-in-up">
          Consultorio <span className="gold-text">ConExporta</span>
        </h2>
        <p className="text-slate-400 mb-12 fade-in-up">
          Para consultas complejas o asesoramiento personalizado, contactá a
          nuestros especialistas.
        </p>

        <div className="grid sm:grid-cols-3 gap-6 reveal-grid">
          {[
            {
              icon: <Phone size={24} />,
              title: "Teléfono",
              value: "+54 260 000-0000",
              href: "tel:+542600000000",
              sub: "Lunes a viernes 9–18 hs",
            },
            {
              icon: <Mail size={24} />,
              title: "Email",
              value: "consultas@conexporta.edu.ar",
              href: "mailto:consultas@conexporta.edu.ar",
              sub: "Respondemos en 24 hs hábiles",
            },
            {
              icon: <MapPin size={24} />,
              title: "Sede",
              value: "Facultad Regional San Rafael",
              href: null,
              sub: "Mendoza, Argentina",
            },
          ].map((c, i) => (
            <div
              key={c.title}
              className="glass-card p-6 flex flex-col items-center gap-3 reveal"
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              <div className="w-12 h-12 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 contact-icon-wrap">
                {c.icon}
              </div>
              <div className="font-semibold text-white">{c.title}</div>
              {c.href ? (
                <a
                  href={c.href}
                  className="text-slate-300 text-sm hover:text-yellow-400 transition-colors"
                >
                  {c.value}
                </a>
              ) : (
                <div className="text-slate-300 text-sm">{c.value}</div>
              )}
              <div className="text-slate-500 text-xs">{c.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const navLinks = [
    { label: "Asistente IA", href: "#chatbot" },
    { label: "Cómo funciona", href: "#como-funciona" },
    { label: "Calculadora", href: "#calculadora" },
    { label: "Gestión", href: "#gestion" },
    { label: "Contacto", href: "#contacto" },
  ];

  return (
    <footer
      className="px-4 pt-10 pb-6"
      style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="footer-grid mb-8">
          {/* Logo + tagline */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center font-bold text-sm flex-shrink-0"
                style={{ color: "#0a1628" }}
              >
                CE
              </div>
              <span className="font-bold text-white text-base tracking-tight">
                ConExporta <span className="gold-text">AI</span>
              </span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed max-w-[220px]">
              Asistente de comercio exterior para PyMEs y exportadores
              argentinos, potenciado por Claude AI.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-2 items-center">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
              Navegación
            </p>
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-slate-500 hover:text-yellow-400 text-xs transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div className="text-right">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Contacto
            </p>
            <p className="text-slate-500 text-xs mb-1">
              consultas@conexporta.edu.ar
            </p>
            <p className="text-slate-500 text-xs mb-1">+54 260 000-0000</p>
            <p className="text-slate-500 text-xs">
              Facultad Regional San Rafael
              <br />
              Mendoza, Argentina
            </p>
          </div>
        </div>

        <div
          className="text-center pt-5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p className="text-slate-600 text-xs">
            © 2025 ConExporta · UTN San Rafael · Las estimaciones son
            orientativas y no constituyen asesoramiento profesional.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Cómo Funciona ────────────────────────────────────────────────────────────

function ComoFunciona() {
  const pasos = [
    {
      numero: "1",
      icono: <MessageCircle size={28} />,
      titulo: "Escribí tu consulta",
      descripcion:
        "Preguntá sobre exportaciones, documentación aduanera, Incoterms o logística.",
    },
    {
      numero: "2",
      icono: <Search size={28} />,
      titulo: "La IA analiza tu caso",
      descripcion:
        "ConExporta AI procesa tu consulta con contexto específico de Argentina.",
    },
    {
      numero: "3",
      icono: <FileText size={28} />,
      titulo: "Recibí la respuesta",
      descripcion:
        "Obtené información clara, con ejemplos prácticos y pasos a seguir.",
    },
  ];

  return (
    <section id="como-funciona" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 fade-in-up">
            ¿Cómo <span className="gold-text">funciona</span>?
          </h2>
          <p className="text-slate-400">
            En tres pasos simples obtenés la respuesta que necesitás
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {pasos.map((paso, index) => (
            <div key={paso.numero} className="flex md:contents">
              {/* Card */}
              <div
                className="glass-card p-6 flex flex-col items-center text-center gap-4 flex-1 fade-in-up"
                style={{ transitionDelay: `${index * 0.18}s` }}
              >
                {/* Step number with ring */}
                <div className="relative flex items-center justify-center w-16 h-16">
                  <div className="absolute inset-0 rounded-full border border-yellow-400/25 spin-slow" />
                  <div className="text-3xl font-extrabold gold-text-animated leading-none z-10">
                    {paso.numero}
                  </div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 feature-icon">
                  {paso.icono}
                </div>
                <div>
                  <div className="font-semibold text-white text-base mb-2">
                    {paso.titulo}
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {paso.descripcion}
                  </p>
                </div>
              </div>

              {/* Animated connector (desktop only, not after last) */}
              {index < pasos.length - 1 && (
                <div className="hidden md:flex flex-col items-center justify-center px-2 self-center gap-1">
                  <div className="w-8 step-line" />
                  <div className="text-yellow-400/50 text-lg">›</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  useScrollSetup();
  useScrollReveal();
  return (
    <>
      <ScrollProgressBar />
      <Navbar />
      <main>
        <Hero />
        <FeaturesBar />
        <hr className="section-divider" />
        <PorQueConExporta />
        <hr className="section-divider" />
        <ComoFunciona />
        <hr className="section-divider" />
        <Chatbot />
        <hr className="section-divider" />
        <Calculadora />
        <hr className="section-divider" />
        <GestionFirmas />
        <hr className="section-divider" />
        <Contacto />
      </main>
      <Footer />
    </>
  );
}
