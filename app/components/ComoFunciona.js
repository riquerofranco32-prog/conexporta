import { MessageCircle, Search, FileText } from "lucide-react";

export default function ComoFunciona() {
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
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 animate-on-scroll">
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
                className="glass-card p-6 flex flex-col items-center text-center gap-4 flex-1 animate-on-scroll"
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
