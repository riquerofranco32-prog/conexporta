"use client";
import { useState, useEffect, useRef } from "react";
import { Send, Trash2 } from "lucide-react";
import {
  SUGGESTED_QUESTIONS,
  TRUNCATE_AT,
  PREVIEW_LEN,
  WELCOME_TEXT,
} from "@/app/lib/constants";

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

function nowTime() {
  return new Date().toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: WELCOME_TEXT, time: nowTime() },
  ]);
  const [typedWelcome, setTypedWelcome] = useState("");
  const [welcomeDone, setWelcomeDone] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(new Set());
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Typewriter for the initial welcome message
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTypedWelcome(WELCOME_TEXT.slice(0, i));
      if (i >= WELCOME_TEXT.length) {
        clearInterval(id);
        setWelcomeDone(true);
      }
    }, 25);
    return () => clearInterval(id);
  }, []);

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
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 animate-on-scroll">
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
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  <span className="text-green-400 text-xs">
                    En línea · Claude AI
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="text-slate-500 hover:text-red-400 transition-colors"
              aria-label="Limpiar historial del chat"
              title="Limpiar chat"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Messages */}
          <div
            className="h-96 overflow-y-auto p-5 flex flex-col gap-4"
            role="log"
            aria-live="polite"
            aria-label="Conversación con ConExporta AI"
          >
            {messages.map((m, i) => {
              const isUser = m.role === "user";
              const isWelcome = i === 0 && !isUser;
              const isLong = m.content.length > TRUNCATE_AT;
              const isExpanded = expanded.has(i);
              const displayContent = isWelcome
                ? typedWelcome
                : isLong && !isExpanded
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
                    {isWelcome && !welcomeDone && (
                      <span className="typewriter-cursor" />
                    )}
                    {isLong && !isWelcome && (
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
                className="pill-hover whitespace-nowrap text-xs px-3 py-1.5 rounded-full border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400/50 transition-all disabled:opacity-50 flex-shrink-0"
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
                aria-label="Escribí tu consulta de comercio exterior"
                rows={2}
                disabled={loading}
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-base text-white placeholder-slate-500 resize-none focus:outline-none focus:border-yellow-400/50 disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                aria-label="Enviar consulta"
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
