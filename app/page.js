"use client";

import { useState, useEffect, useRef } from "react";
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
  ExternalLink,
} from "lucide-react";

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Asistente IA", href: "#chatbot" },
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center font-bold text-navy-900 text-sm">
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
                className="text-slate-300 hover:text-yellow-400 text-sm font-medium transition-colors"
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

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <MessageCircle size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="text-slate-300 hover:text-yellow-400 text-sm font-medium py-2 border-b border-white/10"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const stats = [
    { value: "24/7", label: "Disponible" },
    { value: "100%", label: "Gratuito" },
    { value: "IA", label: "Grok · xAI" },
    { value: "ARG", label: "Especializado" },
  ];

  return (
    <section className="hero-gradient min-h-screen flex flex-col items-center justify-center text-center px-4 pt-16">
      <div className="max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-1.5 mb-6">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-yellow-400 text-sm font-medium">
            Asistente IA en línea
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-4 leading-tight">
          Tu consultor de <span className="gold-text">comercio exterior</span>
          <br />
          disponible siempre
        </h1>

        <p className="text-slate-300 text-lg sm:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
          ConExporta AI responde tus dudas sobre exportaciones, importaciones,
          documentación aduanera, Incoterms y logística internacional desde
          Argentina — al instante.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
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

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {stats.map((s) => (
            <div key={s.label} className="glass-card p-4">
              <div className="text-2xl font-bold gold-text">{s.value}</div>
              <div className="text-slate-400 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <a href="#chatbot" className="mt-16 text-slate-500 animate-bounce">
        <ChevronDown size={28} />
      </a>
    </section>
  );
}

// ─── Features Bar ─────────────────────────────────────────────────────────────

function FeaturesBar() {
  const features = [
    { icon: <FileText size={18} />, label: "Documentación aduanera" },
    { icon: <Globe size={18} />, label: "Incoterms 2020" },
    { icon: <Anchor size={18} />, label: "Rutas logísticas" },
    { icon: <Package size={18} />, label: "Embalaje internacional" },
    { icon: <Building2 size={18} />, label: "AFIP · SENASA · INAL" },
    { icon: <FileText size={18} />, label: "Posiciones NCM/HS" },
  ];

  return (
    <section className="bg-yellow-400 py-4 overflow-hidden">
      <div className="flex gap-8 items-center justify-center flex-wrap px-4">
        {features.map((f) => (
          <div
            key={f.label}
            className="flex items-center gap-2 text-navy-900 font-semibold text-sm whitespace-nowrap"
            style={{ color: "#0a1628" }}
          >
            {f.icon}
            {f.label}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Chatbot ──────────────────────────────────────────────────────────────────

const SUGGESTED_QUESTIONS = [
  "¿Qué documentos necesito para exportar por primera vez?",
  "¿Cuál es la diferencia entre FOB y CIF?",
  "¿Qué hace SENASA en una exportación de alimentos?",
  "¿Cómo calculo la posición arancelaria de mi producto?",
  "¿Qué son los reintegros de exportación?",
  "¿Cuáles son los puertos principales de Argentina?",
];

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "¡Hola! Soy ConExporta AI, tu asistente de comercio exterior argentino. Podés consultarme sobre documentación aduanera, Incoterms, logística, organismos reguladores y mucho más. ¿En qué te puedo ayudar hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text) {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;

    const updated = [...messages, { role: "user", content: userMsg }];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages([
        ...updated,
        {
          role: "assistant",
          content: data.reply || data.error || "Error al obtener respuesta.",
        },
      ]);
    } catch {
      setMessages([
        ...updated,
        {
          role: "assistant",
          content: "Error de conexión. Verificá tu conexión a internet.",
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
      },
    ]);
  }

  return (
    <section id="chatbot" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Asistente de <span className="gold-text">Comercio Exterior</span>
          </h2>
          <p className="text-slate-400">
            Powered by Grok · xAI — Especializado en operaciones argentinas
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
                    En línea · grok-3-latest
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
            {messages.map((m, i) => (
              <div
                key={i}
                className={`chat-bubble flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-yellow-400 font-medium"
                      : "bg-white/10 text-slate-100"
                  }`}
                  style={m.role === "user" ? { color: "#0a1628" } : {}}
                >
                  {m.content}
                </div>
              </div>
            ))}

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
          <div className="px-5 pb-3 flex gap-2 overflow-x-auto">
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
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
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

function Calculadora() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function setField(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function calcular(e) {
    e.preventDefault();
    if (!form.destino || !form.producto || !form.peso) {
      setError("Completá destino, producto y peso para continuar.");
      return;
    }
    setError("");
    setResult(null);
    setLoading(true);

    const prompt = `Sos un experto en costos logísticos argentinos.
El usuario quiere calcular un envío con estos datos:
- Tipo de transporte: ${form.tipo}
- Origen: ${form.origen}
- Destino: ${form.destino}
- Peso: ${form.peso} kg
- Producto: ${form.producto}
${form.largo ? `- Dimensiones: ${form.largo}x${form.ancho}x${form.alto} cm` : ""}

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
          messages: [{ content: prompt }],
          mode: "calculator",
        }),
      });
      const data = await res.json();
      const raw = data.reply || "";
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Respuesta inesperada del asistente.");
      setResult(JSON.parse(jsonMatch[0]));
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
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Calculadora de <span className="gold-text">Envíos</span>
          </h2>
          <p className="text-slate-400">
            Estimaciones orientativas de flete, seguro y tiempos de tránsito —
            powered by Grok AI
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <form
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
              <div className="flex gap-2">
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
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

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
                  Grok está analizando las rutas logísticas...
                </p>
              </div>
            )}

            {result && (
              <>
                <h3 className="text-white font-semibold text-lg">
                  Estimación de costos
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-slate-400 text-xs mb-1">
                      Flete estimado
                    </div>
                    <div className="text-yellow-400 font-bold text-lg">
                      {result.moneda} {result.flete_min?.toLocaleString()} –{" "}
                      {result.flete_max?.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-slate-400 text-xs mb-1">
                      Seguro de carga
                    </div>
                    <div className="text-yellow-400 font-bold text-lg">
                      {result.moneda} {result.seguro_min} – {result.seguro_max}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-slate-400 text-xs mb-1">
                      Tiempo de tránsito
                    </div>
                    <div className="text-white font-bold text-lg">
                      {result.tiempo_dias_min} – {result.tiempo_dias_max} días
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-slate-400 text-xs mb-1">
                      Incoterm recomendado
                    </div>
                    <div className="text-green-400 font-bold text-lg">
                      {result.incoterm_recomendado}
                    </div>
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

                <p className="text-slate-600 text-xs">
                  * Estimaciones orientativas. Consultá con un despachante para
                  valores exactos.
                </p>
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
    if (!form.razonSocial || !form.cuit || !form.contacto || !form.email)
      return;
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
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
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
          ].map((s) => (
            <div key={s.label} className="glass-card p-5 text-center">
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
            <div className="sm:col-span-2 flex gap-3">
              <button
                type="submit"
                className="btn-gold px-6 py-2 rounded-lg text-sm"
              >
                Guardar empresa
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm(INITIAL_EMPRESA);
                }}
                className="px-6 py-2 rounded-lg text-sm border border-white/20 text-slate-400 hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
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
                    <td className="px-5 py-3">
                      <div className="font-medium text-white">
                        {e.razonSocial}
                      </div>
                      <div className="text-slate-500 text-xs">{e.email}</div>
                    </td>
                    <td className="px-5 py-3 text-slate-300 font-mono text-xs">
                      {e.cuit}
                    </td>
                    <td className="px-5 py-3 text-slate-300">{e.contacto}</td>
                    <td className="px-5 py-3 text-slate-400 text-xs">
                      {e.tipo}
                    </td>
                    <td className="px-5 py-3">
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
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
          Consultorio <span className="gold-text">ConExporta</span>
        </h2>
        <p className="text-slate-400 mb-12">
          Para consultas complejas o asesoramiento personalizado, contactá a
          nuestros especialistas.
        </p>

        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: <Phone size={24} />,
              title: "Teléfono",
              value: "+54 341 000-0000",
              sub: "Lunes a viernes 9–18 hs",
            },
            {
              icon: <Mail size={24} />,
              title: "Email",
              value: "consultas@conexporta.edu.ar",
              sub: "Respondemos en 24 hs hábiles",
            },
            {
              icon: <MapPin size={24} />,
              title: "Sede",
              value: "Facultad de Ciencias Económicas",
              sub: "Rosario, Santa Fe, Argentina",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="glass-card p-6 flex flex-col items-center gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
                {c.icon}
              </div>
              <div className="font-semibold text-white">{c.title}</div>
              <div className="text-slate-300 text-sm">{c.value}</div>
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
  return (
    <footer className="py-8 px-4 border-t border-white/10 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div
            className="w-6 h-6 rounded bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center font-bold text-xs"
            style={{ color: "#0a1628" }}
          >
            CE
          </div>
          <span className="text-white font-semibold text-sm">
            ConExporta <span className="gold-text">AI</span>
          </span>
        </div>
        <p className="text-slate-500 text-xs mb-2">
          Consultorio de Comercio Exterior Universitario · Potenciado por Grok ·
          xAI · Deployado en Vercel
        </p>
        <p className="text-slate-600 text-xs">
          © {new Date().getFullYear()} ConExporta — Las estimaciones son
          orientativas y no constituyen asesoramiento profesional.
        </p>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturesBar />
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
