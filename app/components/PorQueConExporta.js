import {
  MessageCircle,
  Calculator,
  Globe,
  FileText,
  Building2,
  Truck,
} from "lucide-react";

export default function PorQueConExporta() {
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
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 animate-on-scroll">
            Todo lo que necesitás para{" "}
            <span className="gold-text-animated">exportar e importar</span>
          </h2>
          <p
            className="text-slate-400 max-w-xl mx-auto animate-on-scroll"
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
