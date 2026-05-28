"use client";

import { useState } from "react";
import {
  Anchor,
  Plane,
  Truck,
  Package,
  ChevronRight,
  ChevronLeft,
  Download,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

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
  "Otro",
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
};

// ── Stepper indicator ────────────────────────────────────────────────────────

function Stepper({ step }) {
  const steps = ["Origen y destino", "Detalles de carga", "Resultados"];
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                i + 1 < step
                  ? "bg-green-500 text-white"
                  : i + 1 === step
                    ? "bg-yellow-400 text-navy-900"
                    : "bg-white/10 text-slate-500"
              }`}
              style={i + 1 === step ? { color: "#0a1628" } : {}}
            >
              {i + 1 < step ? <CheckCircle size={16} /> : i + 1}
            </div>
            <span
              className={`text-xs whitespace-nowrap hidden sm:block ${i + 1 === step ? "text-yellow-400 font-medium" : "text-slate-500"}`}
            >
              {s}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`h-px w-12 sm:w-20 mx-1 mb-5 transition-all ${i + 1 < step ? "bg-green-500" : "bg-white/10"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Panel lateral (info del envío) ───────────────────────────────────────────

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
    <div className="glass-card p-6 flex flex-col gap-5 h-fit sticky top-24">
      {/* Imagen placeholder */}
      <div className="w-full aspect-square rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-3">
        <Package size={48} className="text-yellow-400/40" />
        <span className="text-slate-500 text-sm">Vista previa de carga</span>
      </div>

      {/* Nombre producto */}
      <div>
        <div className="text-xs text-slate-500 mb-1">Producto</div>
        <div className="text-white font-semibold">{form.producto || "—"}</div>
        {form.categoria && form.categoria !== "Otro" && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 mt-1 inline-block">
            {form.categoria}
          </span>
        )}
      </div>

      {/* Specs */}
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
            <span className="text-white">
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
      </div>
    </div>
  );
}

// ── Resultados ───────────────────────────────────────────────────────────────

function Resultados({ result, form, onReset }) {
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

  const chartData = {
    labels: items.map((i) => i.label),
    datasets: [
      {
        data: items.map((i) => i.value),
        backgroundColor: [
          "rgba(245, 200, 66, 0.8)",
          "rgba(99, 179, 237, 0.8)",
          "rgba(154, 205, 50, 0.8)",
          "rgba(252, 129, 74, 0.8)",
          "rgba(167, 139, 250, 0.8)",
        ],
        borderColor: "rgba(10, 22, 40, 0.8)",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#94a3b8", font: { size: 11 }, padding: 12 },
      },
    },
    cutout: "65%",
  };

  function downloadResumen() {
    const lines = [
      "COTIZACIÓN CONEXPORTA",
      "========================",
      `Producto: ${form.producto} (${form.categoria})`,
      `Ruta: ${form.origen} → ${form.destino}`,
      `Modo: ${MODOS.find((m) => m.value === form.modo)?.label}`,
      `Peso: ${form.peso} kg`,
      "",
      "DESGLOSE DE COSTOS (USD)",
      "------------------------",
      ...items.map(
        (i) =>
          `${i.label}: USD ${i.value.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
      ),
      `TOTAL: USD ${result.total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
      "",
      `Tiempo estimado: ${result.diasMinimo}–${result.diasMaximo} días`,
      `Llegada estimada: ${result.fechaLlegadaEstimada}`,
      "",
      `Notas: ${result.notas}`,
      "",
      "* Estimaciones orientativas. Consultá con un despachante para valores exactos.",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cotizacion-conexporta-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Badge */}
      <div className="flex items-center gap-2">
        <CheckCircle size={18} className="text-green-400" />
        <span className="text-green-400 font-semibold text-sm">
          Cotización actualizada
        </span>
      </div>

      {/* Total */}
      <div className="glass-card p-6 text-center">
        <div className="text-slate-400 text-sm mb-1">Costo total estimado</div>
        <div className="text-4xl font-extrabold text-green-400">
          USD{" "}
          {result.total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
        </div>
        <div className="text-slate-400 text-sm mt-2">
          {result.diasMinimo}–{result.diasMaximo} días · Llegada:{" "}
          {result.fechaLlegadaEstimada}
        </div>
      </div>

      {/* Desglose */}
      <div className="glass-card p-5">
        <div className="text-white font-semibold mb-4 text-sm">
          Desglose de costos
        </div>
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex justify-between items-center py-2 border-b border-white/5 last:border-0"
            >
              <span className="text-slate-400 text-sm">{item.label}</span>
              <span className="text-white font-medium text-sm">
                USD{" "}
                {item.value.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-3 mt-1">
            <span className="text-white font-bold">Total estimado</span>
            <span className="text-green-400 font-extrabold text-lg">
              USD{" "}
              {result.total.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Donut chart */}
      <div className="glass-card p-5">
        <div className="text-white font-semibold mb-4 text-sm">
          Distribución de costos
        </div>
        <div className="max-w-xs mx-auto">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Notas */}
      {result.notas && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="text-blue-300 text-xs font-medium mb-1">
            Observaciones
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            {result.notas}
          </p>
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-3">
        <button
          onClick={downloadResumen}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 transition-colors text-sm font-medium"
        >
          <Download size={16} />
          Descargar detalle
        </button>
        <button
          onClick={onReset}
          className="flex-1 btn-gold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
        >
          Nueva cotización
        </button>
      </div>

      <p className="text-slate-600 text-xs text-center">
        * Estimaciones orientativas. Consultá con un despachante para valores
        exactos.
      </p>
    </div>
  );
}

// ── Página principal ─────────────────────────────────────────────────────────

export default function CalculadoraPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [result, setResult] = useState(null);
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
    setResult(null);
    setError("");
  }

  // Input style helper
  const inputCls =
    "w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400/50";
  const selectCls = inputCls + " cursor-pointer";

  return (
    <div className="min-h-screen" style={{ background: "var(--navy-900)" }}>
      {/* Navbar sencillo */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 navbar-scrolled px-4 h-16 flex items-center justify-between max-w-7xl mx-auto w-full"
        style={{ position: "fixed" }}
      >
        <a href="/" className="flex items-center gap-2 text-white font-bold">
          <div
            className="w-7 h-7 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center font-bold text-xs"
            style={{ color: "#0a1628" }}
          >
            CE
          </div>
          ConExporta <span className="gold-text">AI</span>
        </a>
        <a
          href="/"
          className="text-slate-400 hover:text-yellow-400 text-sm transition-colors"
        >
          ← Volver
        </a>
      </nav>

      <div className="max-w-6xl mx-auto px-4 pt-28 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            Calculadora de <span className="gold-text">Envíos</span>
          </h1>
          <p className="text-slate-400">
            Estimación de costos logísticos internacionales desde Argentina
          </p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
          {/* Panel lateral */}
          <ProductPanel form={form} />

          {/* Panel principal */}
          <div className="glass-card p-6 sm:p-8">
            <Stepper step={step} />

            {/* ── STEP 1 ── */}
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

            {/* ── STEP 2 ── */}
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
                        <Loader2 size={18} className="animate-spin" />{" "}
                        Calculando...
                      </>
                    ) : (
                      "Calcular costo estimado"
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3 ── */}
            {step === 3 && result && (
              <Resultados result={result} form={form} onReset={reset} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
