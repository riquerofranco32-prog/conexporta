import { Phone, Mail, MapPin } from "lucide-react";

export default function Contacto() {
  return (
    <section id="contacto" className="py-20 px-4 bg-white/5">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 animate-on-scroll">
          Consultorio <span className="gold-text">ConExporta</span>
        </h2>
        <p
          className="text-slate-400 mb-12 animate-on-scroll"
          style={{ transitionDelay: "80ms" }}
        >
          Para consultas complejas o asesoramiento personalizado, contactá a
          nuestros especialistas.
        </p>

        <div className="grid sm:grid-cols-3 gap-6">
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
              className="glass-card card-hover p-6 flex flex-col items-center gap-3 animate-on-scroll"
              style={{ transitionDelay: `${(i + 1) * 80}ms` }}
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
