import {
  FileText,
  Globe,
  Anchor,
  Package,
  Building2,
  Plane,
  Truck,
} from "lucide-react";

export default function FeaturesBar() {
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
