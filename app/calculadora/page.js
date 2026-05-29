"use client";

import { useState, useEffect } from "react";
import {
  Anchor,
  Plane,
  Truck,
  Package,
  ChevronRight,
  ChevronLeft,
  Copy,
  CheckCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Download,
} from "lucide-react";

// ── Tipo de cambio USD→ARS ───────────────────────────────────────────────────

function useCurrency() {
  const [arsRate, setArsRate] = useState(null);
  const [rateError, setRateError] = useState(false);

  useEffect(() => {
    fetch("/api/currency")
      .then((r) => r.json())
      .then((d) => {
        if (d.rate) setArsRate(d.rate);
        else setRateError(true);
      })
      .catch(() => setRateError(true));
  }, []);

  return { arsRate, rateError };
}

// ── Constantes ──────────────────────────────────────────────────────────────

const ORIGENES = [
  "Buenos Aires (Exolgan)",
  "Rosario (Terminal 6)",
  "Bahía Blanca",
  "Mendoza (terrestre)",
  "Ezeiza (aéreo)",
];

const DESTINOS = [
  "Shanghai, China",
  "Rotterdam, Países Bajos",
  "Miami, USA",
  "Santos, Brasil",
  "Hamburgo, Alemania",
  "Los Ángeles, USA",
  "Valencia, España",
  "Ciudad de México, México",
];

const MODOS = [
  {
    value: "maritimo_fcl",
    label: "Marítimo FCL",
    icon: <Anchor size={16} />,
    desc: "Full Container Load",
  },
  {
    value: "maritimo_lcl",
    label: "Marítimo LCL",
    icon: <Anchor size={16} />,
    desc: "Less Container Load",
  },
  {
    value: "aereo",
    label: "Aéreo",
    icon: <Plane size={16} />,
    desc: "Envío por avión",
  },
  {
    value: "terrestre",
    label: "Terrestre",
    icon: <Truck size={16} />,
    desc: "Transporte por tierra",
  },
];

const CATEGORIAS = [
  "Electrónica",
  "Maquinaria",
  "Alimentos",
  "Textil",
  "Vehículos",
  "Químicos",
  "Otro",
];

const BAR_COLORS = [
  "bg-yellow-400",
  "bg-blue-400",
  "bg-green-400",
  "bg-orange-400",
  "bg-purple-400",
];

const INITIAL_FORM = {
  origen: "",
  destino: "",
  modo: "",
  producto: "",
  categoria: "Otro",
  peso: "",
  largo: "",
  ancho: "",
  alto: "",
  cargaPeligrosa: false,
  requiereRefrigeracion: false,
};

const DEFAULT_RESULT = {
  costoFlete: null,
  seguro: null,
  gastosDestino: null,
  derechosImportacion: null,
  iva: null,
  total: null,
  diasMinimo: null,
  diasMaximo: null,
  fechaLlegada: null,
  fechaLlegadaEstimada: null,
  incoterm: null,
  notas: null,
};

// ── CSS Bar Chart ────────────────────────────────────────────────────────────

function BarChart({ items }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <div key={item.label}>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">{item.label}</span>
            <span className="text-white font-medium">
              USD{" "}
              {item.value.toLocaleString("es-AR", { minimumFractionDigits: 0 })}
            </span>
          </div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${BAR_COLORS[i % BAR_COLORS.length]}`}
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Stepper ──────────────────────────────────────────────────────────────────

function Stepper({ step }) {
  const steps = ["Origen y destino", "Detalles de carga", "Resultados"];
  return (
    <div className="flex items-center mb-8">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                i + 1 < step
                  ? "bg-green-500 text-white"
                  : i + 1 === step
                    ? "bg-yellow-400"
                    : "bg-white/10 text-slate-500"
              }`}
              style={i + 1 === step ? { color: "#0a1628" } : {}}
            >
              {i + 1 < step ? <CheckCircle size={16} /> : i + 1}
            </div>
            <span
              className={`text-xs whitespace-nowrap hidden sm:block ${
                i + 1 === step
                  ? "text-yellow-400 font-medium"
                  : "text-slate-500"
              }`}
            >
              {s}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`h-px w-12 sm:w-20 mx-1 mb-5 transition-all ${
                i + 1 < step ? "bg-green-500" : "bg-white/10"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Panel lateral ────────────────────────────────────────────────────────────

function ProductPanel({ form }) {
  const modoInfo = MODOS.find((m) => m.value === form.modo);
  const pesoVol =
    form.largo && form.ancho && form.alto
      ? (
          (Number(form.largo) * Number(form.ancho) * Number(form.alto)) /
          (form.modo === "aereo" ? 5000 : 6000)
        ).toFixed(1)
      : null;

  return (
    <div className="glass-card p-6 flex flex-col gap-4 h-fit sticky top-24">
      <div className="w-full aspect-square rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-3">
        <Package size={44} className="text-yellow-400/40" />
        <span className="text-slate-500 text-sm">Vista previa</span>
      </div>

      <div>
        <div className="text-xs text-slate-500 mb-0.5">Producto</div>
        <div className="text-white font-semibold">{form.producto || "—"}</div>
        {form.categoria && form.categoria !== "Otro" && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 mt-1 inline-block">
            {form.categoria}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 text-sm">
        {form.modo && (
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-yellow-400">{modoInfo?.icon}</span>
            <span>{modoInfo?.label}</span>
          </div>
        )}
        {form.peso && (
          <div className="flex justify-between text-slate-400">
            <span>Peso real</span>
            <span className="text-white">
              {Number(form.peso).toLocaleString()} kg
            </span>
          </div>
        )}
        {pesoVol && (
          <div className="flex justify-between text-slate-400">
            <span>Peso vol.</span>
            <span className="text-white">{pesoVol} kg</span>
          </div>
        )}
        {form.largo && form.ancho && form.alto && (
          <div className="flex justify-between text-slate-400">
            <span>Dimensiones</span>
            <span className="text-white text-xs">
              {form.largo}×{form.ancho}×{form.alto} cm
            </span>
          </div>
        )}
        {form.origen && (
          <div className="flex justify-between text-slate-400">
            <span>Origen</span>
            <span className="text-white text-right text-xs max-w-[120px]">
              {form.origen}
            </span>
          </div>
        )}
        {form.destino && (
          <div className="flex justify-between text-slate-400">
            <span>Destino</span>
            <span className="text-white text-right text-xs max-w-[120px]">
              {form.destino}
            </span>
          </div>
        )}
        {form.cargaPeligrosa && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 inline-block w-fit">
            ⚠ Carga peligrosa
          </span>
        )}
        {form.requiereRefrigeracion && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 inline-block w-fit">
            ❄ Refrigeración
          </span>
        )}
      </div>
    </div>
  );
}

// ── Resultados ───────────────────────────────────────────────────────────────

function Resultados({ result, form, onReset, arsRate }) {
  const [copied, setCopied] = useState(false);
  const [currency, setCurrency] = useState("USD");

  const inARS = currency === "ARS" && arsRate;

  function fmt(usdValue) {
    if (inARS) {
      return `$ ${Math.round(usdValue * arsRate).toLocaleString("es-AR")} ARS`;
    }
    return `USD ${usdValue.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
  }

  const items = [
    {
      label: "Flete " + (form.modo?.includes("aereo") ? "aéreo" : "marítimo"),
      value: result.costoFlete,
    },
    { label: "Seguro de carga", value: result.seguro },
    { label: "Gastos de destino", value: result.gastosDestino },
    { label: "Derechos de importación", value: result.derechosImportacion },
    { label: "IVA (21%)", value: result.iva },
  ];

  const modoLabel =
    MODOS.find((m) => m.value === form.modo)?.label || form.modo;

  async function downloadPDF() {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString("es-AR");
    const modoLabel =
      MODOS.find((m) => m.value === form.modo)?.label || form.modo;

    function fmtPDF(val) {
      if (val === null || val === undefined) return "--";
      return `USD ${Number(val).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
    }

    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("ConExporta - Estimacion de Costos", 20, 25);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text(`Generado el ${fecha}`, 20, 33);
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 37, 190, 37);

    // Datos del envío
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Datos del envio", 20, 47);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Origen: ${form.origen || "--"}`, 20, 56);
    doc.text(`Destino: ${form.destino || "--"}`, 20, 63);
    doc.text(
      `Producto: ${form.producto || "--"} (${form.categoria || ""})`,
      20,
      70,
    );
    doc.text(`Modo de transporte: ${modoLabel}`, 20, 77);
    doc.text(
      `Peso: ${form.peso ? `${Number(form.peso).toLocaleString()} kg` : "--"}`,
      20,
      84,
    );
    doc.line(20, 90, 190, 90);

    // Costos
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Estimacion de costos", 20, 100);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Flete estimado: ${fmtPDF(result.costoFlete)}`, 20, 109);
    doc.text(`Seguro de carga: ${fmtPDF(result.seguro)}`, 20, 116);
    doc.text(`Gastos de destino: ${fmtPDF(result.gastosDestino)}`, 20, 123);
    doc.text(
      `Derechos de importacion: ${fmtPDF(result.derechosImportacion)}`,
      20,
      130,
    );
    doc.text(`IVA (21%): ${fmtPDF(result.iva)}`, 20, 137);
    doc.text(
      `Tiempo de transito: ${result.diasMinimo}-${result.diasMaximo} dias`,
      20,
      144,
    );
    doc.text(
      `Llegada estimada: ${result.fechaLlegadaEstimada || "--"}`,
      20,
      151,
    );
    doc.text(`Incoterm recomendado: ${result.incoterm || "--"}`, 20, 158);

    // Total destacado
    doc.setFillColor(245, 245, 245);
    doc.rect(18, 164, 174, 14, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`Total estimado: ${fmtPDF(result.total)}`, 22, 173);

    // Notas
    if (result.notas) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("Notas del asistente", 20, 190);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const lines = doc.splitTextToSize(result.notas, 170);
      doc.text(lines, 20, 199);
    }

    // Footer
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text(
      "Estimacion generada por ConExporta AI - Los valores son aproximados y pueden variar.",
      20,
      285,
    );

    doc.save(`conexporta-estimacion-${fecha.replace(/\//g, "-")}.pdf`);
  }

  function copiarResumen() {
    const arsLine = arsRate
      ? `TOTAL en ARS: $ ${Math.round(result.total * arsRate).toLocaleString("es-AR")} (TC: $${Math.round(arsRate).toLocaleString("es-AR")}/USD)`
      : "";
    const lines = [
      "COTIZACIÓN CONEXPORTA",
      "========================",
      `Producto: ${form.producto} (${form.categoria})`,
      `Ruta: ${form.origen} → ${form.destino}`,
      `Modo: ${modoLabel}`,
      `Peso: ${form.peso} kg`,
      form.cargaPeligrosa ? "⚠ Carga peligrosa" : "",
      form.requiereRefrigeracion ? "❄ Requiere refrigeración" : "",
      "",
      "DESGLOSE DE COSTOS (USD)",
      "------------------------",
      ...items.map(
        (i) =>
          `${i.label}: USD ${i.value.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
      ),
      `TOTAL: USD ${result.total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
      arsLine,
      "",
      `Tiempo estimado: ${result.diasMinimo}–${result.diasMaximo} días`,
      `Llegada estimada: ${result.fechaLlegada || result.fechaLlegadaEstimada}`,
      `Incoterm recomendado: ${result.incoterm || "—"}`,
      "",
      `Notas: ${result.notas}`,
      "",
      "* Estimaciones orientativas. Consultá con un despachante para valores exactos.",
    ].filter(Boolean);

    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle size={18} className="text-green-400" />
          <span className="text-green-400 font-semibold text-sm">
            Cotización actualizada
          </span>
        </div>
        {/* Toggle USD/ARS */}
        {arsRate && (
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            {["USD", "ARS"].map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  currency === c
                    ? "bg-yellow-400 text-navy-900"
                    : "text-slate-400 hover:text-white"
                }`}
                style={currency === c ? { color: "#0a1628" } : {}}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Badge tipo de cambio */}
      {arsRate && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
          <TrendingUp size={14} className="text-green-400 flex-shrink-0" />
          <span className="text-green-300 text-xs">
            <strong>
              1 USD = ${Math.round(arsRate).toLocaleString("es-AR")} ARS
            </strong>
            {" · "}Cotización en tiempo real · FreeCurrencyAPI
          </span>
        </div>
      )}

      {/* Total */}
      <div className="glass-card p-6 text-center">
        <div className="text-slate-400 text-sm mb-1">Costo total estimado</div>
        <div className="text-4xl font-extrabold text-green-400">
          {fmt(result.total)}
        </div>
        {inARS && (
          <div className="text-slate-500 text-sm mt-1">
            USD{" "}
            {result.total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
          </div>
        )}
        <div className="grid grid-cols-3 gap-3 mt-4 text-center">
          <div>
            <div className="text-white font-semibold text-sm">
              {result.diasMinimo}–{result.diasMaximo} días
            </div>
            <div className="text-slate-500 text-xs">Tránsito</div>
          </div>
          <div>
            <div className="text-white font-semibold text-sm">
              {result.fechaLlegada || result.fechaLlegadaEstimada}
            </div>
            <div className="text-slate-500 text-xs">Llegada est.</div>
          </div>
          <div>
            <div className="text-yellow-400 font-semibold text-sm">
              {result.incoterm || "FOB"}
            </div>
            <div className="text-slate-500 text-xs">Incoterm rec.</div>
          </div>
        </div>
      </div>

      {/* Desglose */}
      <div className="glass-card p-5">
        <div className="text-white font-semibold mb-4 text-sm">
          Desglose de costos
        </div>
        <div className="flex flex-col gap-2 mb-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0"
            >
              <span className="text-slate-400 text-sm">{item.label}</span>
              <span className="text-white font-medium text-sm">
                {fmt(item.value)}
              </span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-3">
            <span className="text-white font-bold">Total</span>
            <span className="text-green-400 font-extrabold text-lg">
              USD{" "}
              {result.total.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="glass-card p-5">
        <div className="text-white font-semibold mb-4 text-sm">
          Distribución de costos
        </div>
        <BarChart items={items} />
      </div>

      {/* Notas */}
      {result.notas && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="text-blue-300 text-xs font-semibold mb-1">
            Notas del especialista
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            {result.notas}
          </p>
        </div>
      )}

      {/* Acciones */}
      <button
        onClick={downloadPDF}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/20 text-slate-300 hover:bg-white/5 transition-colors text-sm font-medium"
      >
        <Download size={16} />
        Descargar PDF
      </button>
      <div className="flex gap-3">
        <button
          onClick={copiarResumen}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 transition-colors text-sm font-medium"
        >
          {copied ? (
            <CheckCircle size={16} className="text-green-400" />
          ) : (
            <Copy size={16} />
          )}
          {copied ? "¡Copiado!" : "Copiar resumen"}
        </button>
        <button
          onClick={onReset}
          className="flex-1 btn-gold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
        >
          <RefreshCw size={16} />
          Nueva consulta
        </button>
      </div>

      <p className="text-slate-600 text-xs text-center">
        * Estimaciones orientativas. Consultá con un despachante para valores
        exactos.
      </p>
    </div>
  );
}

// ── Vista previa siempre visible ─────────────────────────────────────────────

function ResultadosPreview({ result, loading, hasResult }) {
  function fmtUSD(val) {
    if (val === null || val === undefined) return "--";
    return `USD ${Number(val).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
  }

  const fields = [
    {
      label: "Flete estimado",
      value: hasResult ? fmtUSD(result.costoFlete) : "--",
    },
    {
      label: "Seguro de carga",
      value: hasResult ? fmtUSD(result.seguro) : "--",
    },
    {
      label: "Tiempo de tránsito",
      value: hasResult
        ? `${result.diasMinimo}–${result.diasMaximo} días`
        : "--",
    },
    {
      label: "Incoterm recomendado",
      value: hasResult ? result.incoterm || "--" : "--",
      accent: true,
    },
    {
      label: "Total estimado",
      value: hasResult ? fmtUSD(result.total) : "--",
      isTotal: true,
    },
    { label: "Documentación requerida", value: "--" },
    {
      label: "Notas del asistente",
      value: hasResult && result.notas ? result.notas : "--",
      isNote: true,
    },
  ];

  return (
    <div
      className={`glass-card p-5 sticky top-24${loading ? " is-loading" : ""}${hasResult ? " has-value" : ""}`}
    >
      <div className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        Resultado estimado
        {hasResult && <CheckCircle size={13} className="text-green-400" />}
      </div>
      <div className="flex flex-col divide-y divide-white/5">
        {fields.map((field) => (
          <div key={field.label} className="py-2.5 first:pt-0 last:pb-0">
            <div className="text-slate-400 text-xs mb-1">{field.label}</div>
            {loading ? (
              <span className="skeleton-value" />
            ) : (
              <div
                className={`text-sm font-semibold ${
                  !hasResult
                    ? "text-slate-600"
                    : field.isTotal
                      ? "text-green-400"
                      : field.accent
                        ? "text-yellow-400"
                        : field.isNote
                          ? "text-slate-300 font-normal text-xs leading-relaxed line-clamp-3"
                          : "text-white"
                }`}
              >
                {field.value}
              </div>
            )}
          </div>
        ))}
      </div>
      {!hasResult && !loading && (
        <p className="text-slate-600 text-xs text-center mt-4 leading-relaxed">
          Completá el formulario para ver la estimación
        </p>
      )}
    </div>
  );
}

// ── Página principal ─────────────────────────────────────────────────────────

export default function CalculadoraPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [result, setResult] = useState(DEFAULT_RESULT);
  const [hasResult, setHasResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function setField(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function validStep1() {
    return form.origen && form.destino && form.modo;
  }
  function validStep2() {
    return form.producto && form.peso && Number(form.peso) > 0;
  }

  async function calcular() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/calcular-envio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      setResult(data);
      setHasResult(true);
      setStep(3);
    } catch {
      setError("Error de conexión. Verificá tu internet e intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep(1);
    setForm(INITIAL_FORM);
    setResult(DEFAULT_RESULT);
    setHasResult(false);
    setError("");
  }

  const inputCls =
    "w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400/50";
  const selectCls = inputCls + " cursor-pointer";
  const checkCls =
    "w-4 h-4 rounded border-white/30 bg-white/10 accent-yellow-400 cursor-pointer";

  return (
    <div className="min-h-screen" style={{ background: "var(--navy-900)" }}>
      <nav
        className="fixed top-0 left-0 right-0 z-50 navbar-scrolled px-4 h-16 flex items-center max-w-7xl mx-auto w-full"
        style={{ position: "fixed" }}
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-white font-bold">
            <div
              className="w-7 h-7 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center font-bold text-xs"
              style={{ color: "#0a1628" }}
            >
              CE
            </div>
            ConExporta <span className="gold-text ml-1">AI</span>
          </a>
          <a
            href="/"
            className="text-slate-400 hover:text-yellow-400 text-sm transition-colors"
          >
            ← Volver
          </a>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 pt-28 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            Calculadora de <span className="gold-text">Envíos</span>
          </h1>
          <p className="text-slate-400">
            Estimación de costos logísticos internacionales desde Argentina —
            powered by Claude AI
          </p>
        </div>

        <div className="grid lg:grid-cols-[200px_1fr_260px] gap-6 items-start">
          <ProductPanel form={form} />

          <div className="glass-card p-6 sm:p-8">
            <Stepper step={step} />

            {/* STEP 1 */}
            {step === 1 && (
              <div className="flex flex-col gap-5">
                <h2 className="text-white font-semibold text-lg">
                  Origen y destino
                </h2>

                <div>
                  <label className="text-slate-400 text-xs mb-1.5 block">
                    Puerto / ciudad de origen *
                  </label>
                  <select
                    value={form.origen}
                    onChange={(e) => setField("origen", e.target.value)}
                    className={selectCls}
                  >
                    <option value="" className="bg-gray-900">
                      Seleccioná el origen
                    </option>
                    {ORIGENES.map((o) => (
                      <option key={o} value={o} className="bg-gray-900">
                        {o}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 text-xs mb-1.5 block">
                    Puerto / ciudad de destino *
                  </label>
                  <select
                    value={form.destino}
                    onChange={(e) => setField("destino", e.target.value)}
                    className={selectCls}
                  >
                    <option value="" className="bg-gray-900">
                      Seleccioná el destino
                    </option>
                    {DESTINOS.map((d) => (
                      <option key={d} value={d} className="bg-gray-900">
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 text-xs mb-1.5 block">
                    Modo de transporte *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {MODOS.map((m) => (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => setField("modo", m.value)}
                        className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                          form.modo === m.value
                            ? "bg-yellow-400/15 border-yellow-400/60 text-yellow-400"
                            : "border-white/15 text-slate-400 hover:border-white/30"
                        }`}
                      >
                        {m.icon}
                        <div>
                          <div className="font-semibold">{m.label}</div>
                          <div className="text-xs opacity-70">{m.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!validStep1()}
                  className="btn-gold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Siguiente <ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="flex flex-col gap-5">
                <h2 className="text-white font-semibold text-lg">
                  Detalles de carga
                </h2>

                <div>
                  <label className="text-slate-400 text-xs mb-1.5 block">
                    Nombre del producto *
                  </label>
                  <input
                    type="text"
                    value={form.producto}
                    onChange={(e) => setField("producto", e.target.value)}
                    placeholder="ej: aceite de soja, cuero curtido"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-xs mb-1.5 block">
                    Categoría
                  </label>
                  <select
                    value={form.categoria}
                    onChange={(e) => setField("categoria", e.target.value)}
                    className={selectCls}
                  >
                    {CATEGORIAS.map((c) => (
                      <option key={c} value={c} className="bg-gray-900">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 text-xs mb-1.5 block">
                    Peso total (kg) *
                  </label>
                  <input
                    type="number"
                    value={form.peso}
                    onChange={(e) => setField("peso", e.target.value)}
                    placeholder="500"
                    min="0"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="text-slate-400 text-xs mb-1.5 block">
                    Dimensiones del embalaje (cm) — opcional
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      ["largo", "Largo"],
                      ["ancho", "Ancho"],
                      ["alto", "Alto"],
                    ].map(([k, lbl]) => (
                      <input
                        key={k}
                        type="number"
                        value={form[k]}
                        onChange={(e) => setField(k, e.target.value)}
                        placeholder={lbl}
                        min="0"
                        className={inputCls}
                      />
                    ))}
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={form.cargaPeligrosa}
                      onChange={(e) =>
                        setField("cargaPeligrosa", e.target.checked)
                      }
                      className={checkCls}
                    />
                    <span className="text-slate-300 text-sm group-hover:text-white transition-colors">
                      Carga peligrosa (materiales inflamables, tóxicos, etc.)
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={form.requiereRefrigeracion}
                      onChange={(e) =>
                        setField("requiereRefrigeracion", e.target.checked)
                      }
                      className={checkCls}
                    />
                    <span className="text-slate-300 text-sm group-hover:text-white transition-colors">
                      Requiere refrigeración (cadena de frío)
                    </span>
                  </label>
                </div>

                {error && (
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2.5">
                    <AlertCircle
                      size={15}
                      className="text-red-400 flex-shrink-0"
                    />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="px-5 py-3 rounded-xl border border-white/20 text-slate-400 hover:bg-white/5 transition-colors flex items-center gap-2 text-sm"
                  >
                    <ChevronLeft size={16} /> Atrás
                  </button>
                  <button
                    onClick={calcular}
                    disabled={!validStep2() || loading}
                    className="flex-1 btn-gold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Claude
                        está calculando tu envío...
                      </>
                    ) : (
                      "Calcular costo estimado"
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && hasResult && (
              <Resultados result={result} form={form} onReset={reset} />
            )}
          </div>

          <ResultadosPreview
            result={result}
            loading={loading}
            hasResult={hasResult}
          />
        </div>
      </div>
    </div>
  );
}
