"use client";
import { Anchor, Plane, Package, ChevronDown } from "lucide-react";
import { useTypewriter } from "@/app/hooks/useTypewriter";
import { useCountUp } from "@/app/hooks/useCountUp";
import { ROTATE_WORDS, PREVIEW_MSGS } from "@/app/lib/constants";

function StatCard({ value, label }) {
  const match = value.match(/^(\d+)(.*)$/);
  const { count, ref } = useCountUp(match ? Number(match[1]) : 0);
  return (
    <div
      ref={ref}
      className="glass-card p-4 animate-on-scroll text-center badge-pulse relative pill-hover"
    >
      <div className="text-2xl font-bold gold-text">
        {match ? `${count}${match[2]}` : value}
      </div>
      <div className="text-slate-400 text-xs mt-1">{label}</div>
    </div>
  );
}

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

export default function Hero() {
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
      {/* Animated blobs */}
      <div
        className="blob absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="blob-2 absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

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

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-5 leading-tight animate-on-scroll">
              Tu consultor de{" "}
              <span className="gold-text-animated">comercio exterior</span>
              <br />
              disponible siempre
            </h1>

            <p
              className="text-slate-300 text-lg mb-8 max-w-lg leading-relaxed mx-auto lg:mx-0 animate-on-scroll"
              style={{ transitionDelay: "100ms" }}
            >
              Resolvé tus dudas sobre{" "}
              <span className="text-yellow-400 font-semibold">{twDisplay}</span>
              <span className="typewriter-cursor" /> desde Argentina — al
              instante.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-3 animate-on-scroll"
              style={{ transitionDelay: "180ms" }}
            >
              <a
                href="#chatbot"
                className="btn-gold btn-primary px-8 py-3 rounded-xl text-base"
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
              className="text-slate-500 text-sm mb-8 text-center lg:text-left animate-on-scroll"
              style={{ transitionDelay: "180ms" }}
            >
              +200 consultas respondidas · Documentación aduanera · Incoterms
              2020
            </p>

            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-on-scroll"
              style={{ transitionDelay: "260ms" }}
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
