export default function Footer() {
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
            © 2026 ConExporta · UTN San Rafael · Las estimaciones son
            orientativas y no constituyen asesoramiento profesional.
          </p>
        </div>
      </div>
    </footer>
  );
}
