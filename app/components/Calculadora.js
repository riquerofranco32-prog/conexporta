"use client";
import { useState, useEffect } from "react";
import {
  Search,
  Anchor,
  Plane,
  Truck,
  Package,
  FileText,
  Calculator,
  AlertTriangle,
  Tag,
  Copy,
  CheckCheck,
  ChevronRight,
  Info,
  Send,
} from "lucide-react";
import {
  PUERTOS,
  CURRENCY_CACHE_KEY,
  CURRENCY_CACHE_TTL,
  CURRENCY_SYMBOLS,
  CURRENCY_LOCALES,
} from "@/app/lib/constants";

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

async function getRates() {
  try {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(CURRENCY_CACHE_KEY);
      if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < CURRENCY_CACHE_TTL)
          return { data, timestamp };
      }
    }
    const res = await fetch("/api/currency");
    const json = await res.json();
    if (json.error) throw new Error(json.error);
    const ts = json.updatedAt ?? Date.now();
    if (typeof window !== "undefined") {
      localStorage.setItem(
        CURRENCY_CACHE_KEY,
        JSON.stringify({ timestamp: ts, data: json }),
      );
    }
    return { data: json, timestamp: ts };
  } catch {
    return null;
  }
}

export default function Calculadora() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rates, setRates] = useState(null);
  const [ratesError, setRatesError] = useState(false);
  const [ratesUpdatedAt, setRatesUpdatedAt] = useState(null);
  const [displayCurrency, setDisplayCurrency] = useState("USD");

  // NCM classifier state
  const [ncmQuery, setNcmQuery] = useState("");
  const [ncmResult, setNcmResult] = useState(null);
  const [ncmLoading, setNcmLoading] = useState(false);
  const [ncmError, setNcmError] = useState("");
  const [ncmCopied, setNcmCopied] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    getRates().then((res) => {
      if (!res) {
        setRatesError(true);
        return;
      }
      setRates(res.data);
      setRatesUpdatedAt(res.timestamp);
    });
  }, []);

  function setField(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function convertAmt(usdAmt) {
    if (!rates || displayCurrency === "USD" || !rates[displayCurrency])
      return usdAmt;
    return usdAmt * rates[displayCurrency];
  }

  function fmtAmt(usdAmt) {
    const val = convertAmt(usdAmt);
    const locale = CURRENCY_LOCALES[displayCurrency] ?? "en-US";
    return `${CURRENCY_SYMBOLS[displayCurrency]} ${val.toLocaleString(locale, { maximumFractionDigits: 0 })}`;
  }

  function minutesSince(ts) {
    if (!ts) return null;
    return Math.floor((Date.now() - ts) / 60000);
  }

  async function clasificarNCM() {
    if (!ncmQuery.trim()) return;
    setNcmError("");
    setNcmResult(null);
    setNcmLoading(true);
    try {
      const res = await fetch("/api/clasificar-ncm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ descripcion: ncmQuery }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setNcmResult(data);
    } catch (err) {
      setNcmError(
        err.message || "No se pudo clasificar el producto. Intentá de nuevo.",
      );
    } finally {
      setNcmLoading(false);
    }
  }

  function usarNCM() {
    if (!ncmResult) return;
    setField("producto", ncmResult.descripcion_oficial);
    document
      .getElementById("calculadora-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function generarPDF() {
    if (!result) return;
    setPdfLoading(true);
    try {
      // Fetch AI recommendations (non-blocking — PDF generates even if this fails)
      let recom = null;
      try {
        const recomRes = await fetch("/api/pdf-recomendaciones", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            producto: form.producto,
            ncm: ncmResult?.codigo_ncm || null,
            origen: form.origen,
            destino: form.destino,
            transporte: form.tipo,
            peso: form.peso,
          }),
        });
        recom = await recomRes.json();
      } catch {
        /* generate without recommendations */
      }

      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const MX = 20;
      const PW = 210;
      const CW = PW - 2 * MX;
      const COL = CW / 2;
      let y = 20;

      const sf = (r, g, b) => doc.setFillColor(r, g, b);
      const st = (r, g, b) => doc.setTextColor(r, g, b);
      const sd = (r, g, b) => doc.setDrawColor(r, g, b);

      const checkBreak = (needed) => {
        if (y + needed > 277) {
          doc.addPage();
          y = 20;
        }
      };

      const sectionTitle = (title) => {
        checkBreak(14);
        st(29, 78, 216);
        doc.setFontSize(10.5);
        doc.setFont("helvetica", "bold");
        doc.text(title, MX, y);
        sd(29, 78, 216);
        doc.setLineWidth(0.4);
        doc.line(MX, y + 2, PW - MX, y + 2);
        sd(226, 232, 240);
        doc.setLineWidth(0.1);
        y += 8;
      };

      const tableRow = (label, value) => {
        checkBreak(8);
        const rh = 7;
        sf(248, 250, 252);
        doc.rect(MX, y, COL, rh, "F");
        sf(255, 255, 255);
        doc.rect(MX + COL, y, COL, rh, "F");
        sd(226, 232, 240);
        doc.setLineWidth(0.1);
        doc.rect(MX, y, CW, rh, "S");
        st(100, 116, 139);
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "bold");
        doc.text(String(label), MX + 3, y + 4.8);
        st(30, 41, 59);
        doc.setFont("helvetica", "normal");
        const lines = doc.splitTextToSize(String(value ?? "-"), COL - 6);
        doc.text(lines[0] ?? "", MX + COL + 3, y + 4.8);
        y += rh;
      };

      // ── Header ──
      sf(29, 78, 216);
      doc.rect(MX, y, CW, 28, "F");
      sf(245, 200, 66);
      doc.rect(MX + 4, y + 4, 20, 20, "F");
      st(10, 22, 40);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("CE", MX + 14, y + 16.5, { align: "center" });
      st(255, 255, 255);
      doc.setFontSize(15);
      doc.setFont("helvetica", "bold");
      doc.text("ConExporta AI", MX + 30, y + 11);
      doc.setFontSize(9.5);
      doc.setFont("helvetica", "normal");
      doc.text("Cotizacion de Comercio Exterior", MX + 30, y + 18);
      doc.setFontSize(7.5);
      doc.text("UTN San Rafael - Mendoza, Argentina", MX + 30, y + 24);
      y += 32;

      const cotNum = `COT-${Date.now().toString().slice(-8)}`;
      const now = new Date();
      const fechaStr = now.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const horaStr = now.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      sf(241, 245, 249);
      doc.rect(MX, y, CW, 12, "F");
      st(100, 116, 139);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(`N de cotizacion: ${cotNum}`, MX + 4, y + 4.5);
      doc.text(`Fecha: ${fechaStr}   Hora: ${horaStr} hs`, MX + 4, y + 9.5);
      y += 16;

      // ── Section 1: Ficha del Envio ──
      sectionTitle("SECCION 1 - FICHA DEL ENVIO");
      const modoLabel =
        form.tipo === "aereo"
          ? "Aereo"
          : form.tipo === "terrestre"
            ? "Terrestre"
            : "Maritimo";
      tableRow("Origen", form.origen);
      tableRow("Destino", form.destino);
      tableRow("Modo de transporte", modoLabel);
      tableRow("Producto", form.producto);
      tableRow("Peso total", `${form.peso} kg`);
      if (form.largo && form.ancho && form.alto) {
        tableRow(
          "Dimensiones",
          `${form.largo} x ${form.ancho} x ${form.alto} cm`,
        );
        const volM3 = (
          (Number(form.largo) * Number(form.ancho) * Number(form.alto)) /
          1000000
        ).toFixed(3);
        tableRow("Volumen estimado", `${volM3} m3`);
      }
      y += 5;

      // ── Section 2: NCM (conditional) ──
      if (ncmResult) {
        checkBreak(60);
        sectionTitle("SECCION 2 - POSICION ARANCELARIA NCM/HS");
        tableRow("Codigo NCM", ncmResult.codigo_ncm);
        tableRow("Codigo HS (6 digitos)", ncmResult.codigo_hs6);
        tableRow("Descripcion oficial", ncmResult.descripcion_oficial);
        tableRow("Seccion arancelaria", ncmResult.seccion);
        tableRow("Capitulo", ncmResult.capitulo);
        tableRow(
          "Nivel de confianza",
          ncmResult.confianza
            ? ncmResult.confianza.charAt(0).toUpperCase() +
                ncmResult.confianza.slice(1)
            : "-",
        );
        st(148, 163, 184);
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "italic");
        doc.text(
          "* Clasificacion orientativa. Verificar con despachante de aduana oficial.",
          MX,
          y + 5,
        );
        y += 11;
      }

      // ── Section 3: Costos ──
      checkBreak(55);
      sectionTitle("SECCION 3 - DESGLOSE DE COSTOS ESTIMADOS");
      sf(29, 78, 216);
      doc.rect(MX, y, CW, 7, "F");
      st(255, 255, 255);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.text("Concepto", MX + 3, y + 5);
      doc.text("Estimado (USD)", MX + CW - 44, y + 5);
      y += 7;
      tableRow(
        "Flete internacional",
        `USD ${result.flete_min?.toLocaleString() ?? 0} - ${result.flete_max?.toLocaleString() ?? 0}`,
      );
      tableRow(
        "Seguro de carga",
        `USD ${result.seguro_min?.toLocaleString() ?? 0} - ${result.seguro_max?.toLocaleString() ?? 0}`,
      );

      const totalMid = Math.round(
        ((result.flete_min ?? 0) +
          (result.flete_max ?? 0) +
          (result.seguro_min ?? 0) +
          (result.seguro_max ?? 0)) /
          2,
      );
      checkBreak(10);
      sf(254, 243, 199);
      doc.rect(MX, y, CW, 8, "F");
      sd(217, 119, 6);
      doc.setLineWidth(0.4);
      doc.rect(MX, y, CW, 8, "S");
      doc.setLineWidth(0.1);
      st(146, 64, 14);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("TOTAL ESTIMADO", MX + 3, y + 5.5);
      doc.text(`USD ${totalMid.toLocaleString()}`, MX + CW - 44, y + 5.5);
      y += 8;

      if (rates?.ARS) {
        st(100, 116, 139);
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "italic");
        doc.text(
          `Aprox. $ ${Math.round(totalMid * rates.ARS).toLocaleString("es-AR")} ARS (TC: 1 USD = ${Math.round(rates.ARS).toLocaleString("es-AR")} ARS)`,
          MX,
          y + 5,
        );
        y += 10;
      } else {
        y += 4;
      }

      // ── Section 4: Tiempos ──
      checkBreak(45);
      sectionTitle("SECCION 4 - TIEMPOS Y LOGISTICA");
      tableRow(
        "Tiempo de transito estimado",
        `${result.tiempo_dias_min ?? "-"} - ${result.tiempo_dias_max ?? "-"} dias`,
      );
      tableRow("Incoterm sugerido", result.incoterm_recomendado || "-");
      if (result.documentos_clave?.length) {
        tableRow("Documentacion clave", result.documentos_clave.join(", "));
      }
      if (result.notas) {
        y += 4;
        checkBreak(22);
        const notaLines = doc.splitTextToSize(`Nota: ${result.notas}`, CW - 8);
        const notaH = Math.max(12, notaLines.length * 5 + 6);
        sf(239, 246, 255);
        doc.rect(MX, y, CW, notaH, "F");
        st(29, 78, 216);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(notaLines, MX + 4, y + 5);
        y += notaH + 4;
      }

      // ── Page 2: Recommendations ──
      doc.addPage();
      y = 20;

      sf(29, 78, 216);
      doc.rect(MX, y, CW, 12, "F");
      st(255, 255, 255);
      doc.setFontSize(10.5);
      doc.setFont("helvetica", "bold");
      doc.text(
        "SECCION 5 - RECOMENDACIONES DEL ESPECIALISTA IA",
        MX + 4,
        y + 8,
      );
      y += 16;

      st(100, 116, 139);
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.text(
        "Analisis generado por Claude AI - ConExporta - UTN San Rafael",
        MX,
        y,
      );
      y += 10;

      if (recom && !recom.error) {
        const renderList = (title, items) => {
          if (!items?.length) return;
          checkBreak(10 + items.length * 6);
          st(29, 78, 216);
          doc.setFontSize(9.5);
          doc.setFont("helvetica", "bold");
          doc.text(title, MX, y);
          y += 6;
          st(30, 41, 59);
          doc.setFontSize(8.5);
          doc.setFont("helvetica", "normal");
          for (const item of items) {
            checkBreak(7);
            const lines = doc.splitTextToSize(`- ${item}`, CW - 8);
            doc.text(lines, MX + 4, y);
            y += lines.length * 5 + 1;
          }
          y += 5;
        };

        renderList("Documentacion Requerida", recom.documentacion_requerida);
        renderList(
          "Organismos Intervinientes",
          recom.organismos_intervinientes,
        );

        if (recom.incoterm_recomendado) {
          checkBreak(18);
          st(29, 78, 216);
          doc.setFontSize(9.5);
          doc.setFont("helvetica", "bold");
          doc.text("Incoterm Recomendado", MX, y);
          y += 6;
          st(30, 41, 59);
          doc.setFontSize(8.5);
          doc.setFont("helvetica", "normal");
          const incLines = doc.splitTextToSize(
            recom.incoterm_recomendado,
            CW - 4,
          );
          doc.text(incLines, MX + 4, y);
          y += incLines.length * 5 + 6;
        }

        renderList("Riesgos a Considerar", recom.riesgos_a_considerar);
        renderList(
          "Recomendaciones Generales",
          recom.recomendaciones_generales,
        );

        if (recom.tiempo_tramitacion_estimado) {
          checkBreak(16);
          st(29, 78, 216);
          doc.setFontSize(9.5);
          doc.setFont("helvetica", "bold");
          doc.text("Tiempo de Tramitacion Estimado", MX, y);
          y += 6;
          st(30, 41, 59);
          doc.setFontSize(8.5);
          doc.setFont("helvetica", "normal");
          doc.text(recom.tiempo_tramitacion_estimado, MX + 4, y);
          y += 10;
        }
      } else {
        sf(254, 243, 199);
        doc.rect(MX, y, CW, 14, "F");
        st(146, 64, 14);
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "normal");
        doc.text(
          "Las recomendaciones IA no estuvieron disponibles al generar este documento.",
          MX + 4,
          y + 9,
        );
        y += 18;
      }

      // ── Footer on last page ──
      const footY = 276;
      sd(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(MX, footY, PW - MX, footY);
      st(148, 163, 184);
      doc.setFontSize(7);
      doc.setFont("helvetica", "italic");
      doc.text(
        "Este documento es una estimacion orientativa generada por IA. No constituye asesoramiento legal ni oficial.",
        MX,
        footY + 5,
      );
      doc.text(
        "Verificar siempre con un despachante de aduana habilitado y los organismos oficiales vigentes.",
        MX,
        footY + 10,
      );
      doc.text(`ConExporta AI - UTN San Rafael - ${fechaStr}`, MX, footY + 16);

      // Page numbers on all pages
      const totalPages = doc.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        st(148, 163, 184);
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.text(`Pagina ${p} de ${totalPages}`, PW - MX, 290, {
          align: "right",
        });
      }

      doc.save(`ConExporta-${cotNum}.pdf`);
    } catch (err) {
      console.error("[generarPDF]", err);
      setError("No se pudo generar el PDF. Intentá de nuevo.");
    } finally {
      setPdfLoading(false);
    }
  }

  // Calcula el peso volumétrico según el tipo de transporte
  const pesoVolumetrico = (() => {
    const l = Number(form.largo);
    const a = Number(form.ancho);
    const h = Number(form.alto);
    if (!l || !a || !h) return null;
    const divisor = form.tipo === "aereo" ? 5000 : 6000;
    return parseFloat(((l * a * h) / divisor).toFixed(2));
  })();

  const pesoFacturable = (() => {
    const real = Number(form.peso);
    if (!pesoVolumetrico || !real) return null;
    return Math.max(real, pesoVolumetrico);
  })();

  async function calcular(e) {
    e.preventDefault();
    if (
      !form.destino ||
      !form.producto ||
      !form.peso ||
      Number(form.peso) <= 0
    ) {
      setError("Completá destino, producto y peso para continuar.");
      return;
    }
    setError("");
    setResult(null);
    setLoading(true);

    const pesoParaFacturar = pesoFacturable ?? Number(form.peso);
    const notaVolumen =
      pesoVolumetrico !== null
        ? `- Peso volumétrico: ${pesoVolumetrico} kg (${form.tipo === "aereo" ? "fórmula /5000" : "fórmula /6000"})
- Peso a facturar: ${pesoParaFacturar} kg (${pesoFacturable !== null && pesoFacturable === pesoVolumetrico ? "se usa el volumétrico, es mayor" : "se usa el real, es mayor"})`
        : "";

    const prompt = `Sos un experto en costos logísticos argentinos.
El usuario quiere calcular un envío con estos datos:
- Tipo de transporte: ${form.tipo}
- Origen: ${form.origen}
- Destino: ${form.destino}
- Peso real: ${form.peso} kg
- Producto: ${form.producto}
${ncmResult ? `- Código NCM: ${ncmResult.codigo_ncm}\n- Código HS: ${ncmResult.codigo_hs6}` : ""}
${form.largo ? `- Dimensiones: ${form.largo}x${form.ancho}x${form.alto} cm` : ""}
${notaVolumen}

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
          messages: [{ role: "user", content: prompt }],
          mode: "calculator",
        }),
      });
      const data = await res.json();
      const raw = data.reply || "";
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        // Limpiar markdown fences y reintentar
        const cleaned = raw
          .replace(/^```(?:json)?s*/i, "")
          .replace(/s*```$/, "")
          .trim();
        try {
          parsed = JSON.parse(cleaned);
        } catch {
          // Extracción greedy: toma el bloque JSON más externo
          const jsonMatch = raw.match(/{[sS]*}/);
          if (!jsonMatch)
            throw new Error("Respuesta inesperada del asistente.");
          parsed = JSON.parse(jsonMatch[0]);
        }
      }
      setResult(parsed);
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
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 animate-on-scroll">
            Calculadora de <span className="gold-text-animated">Envíos</span>
          </h2>
          <p className="text-slate-400">
            Estimaciones orientativas de flete, seguro y tiempos de tránsito —
            powered by Claude AI
          </p>
        </div>

        {/* ── Clasificador NCM ── */}
        <div className="mb-8">
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-1">
              <Tag size={16} className="text-yellow-400" />
              <h3 className="text-white font-semibold text-base">
                Clasificador de Posición Arancelaria
              </h3>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Encontrá el código NCM/HS de tu producto — powered by Claude AI
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <textarea
                rows={2}
                value={ncmQuery}
                onChange={(e) => setNcmQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    clasificarNCM();
                  }
                }}
                placeholder="Describí tu producto: material, uso, características... Ej: zapatillas de cuero vacuno con suela de goma"
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400/50 resize-none"
              />
              <button
                type="button"
                onClick={clasificarNCM}
                disabled={ncmLoading || !ncmQuery.trim()}
                className="btn-gold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 disabled:opacity-50 self-start sm:self-end"
              >
                <Search size={15} />
                {ncmLoading ? "Clasificando..." : "Clasificar producto"}
              </button>
            </div>

            {ncmLoading && (
              <div className="mt-4 flex items-center gap-3 text-slate-400 text-sm">
                <div className="flex gap-1">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
                Claude está analizando tu producto...
              </div>
            )}

            {ncmError && (
              <div className="mt-3 flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2.5">
                <AlertTriangle
                  size={15}
                  className="text-red-400 flex-shrink-0"
                />
                <p className="text-red-400 text-sm">{ncmError}</p>
              </div>
            )}

            {ncmResult && (
              <div className="mt-4 border border-white/10 rounded-xl p-5 bg-white/5">
                <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-yellow-400" />
                    <span className="text-white font-semibold text-sm">
                      Posición Arancelaria Sugerida
                    </span>
                  </div>
                  {ncmResult.validado_hs && (
                    <span className="text-xs text-green-400 flex items-center gap-1">
                      <CheckCheck size={13} />
                      Validado en base HS internacional
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs">NCM:</span>
                    <span
                      className="bg-yellow-400 text-xs font-bold px-2.5 py-1 rounded-md"
                      style={{ color: "#0a1628" }}
                    >
                      {ncmResult.codigo_ncm}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs">HS:</span>
                    <span className="bg-white/10 text-slate-300 text-xs font-mono px-2.5 py-1 rounded-md">
                      {ncmResult.codigo_hs6}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs">Confianza:</span>
                    <span
                      className={`flex items-center gap-1 text-xs font-medium ${
                        ncmResult.confianza === "alta"
                          ? "text-green-400"
                          : ncmResult.confianza === "media"
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                    >
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          ncmResult.confianza === "alta"
                            ? "bg-green-400"
                            : ncmResult.confianza === "media"
                              ? "bg-yellow-400"
                              : "bg-red-400"
                        }`}
                      />
                      {ncmResult.confianza?.charAt(0).toUpperCase() +
                        ncmResult.confianza?.slice(1)}
                    </span>
                  </div>
                </div>

                <p className="text-slate-200 text-sm font-medium mb-1">
                  &ldquo;{ncmResult.descripcion_oficial}&rdquo;
                </p>
                <p className="text-slate-400 text-xs mb-3">
                  {ncmResult.seccion} · {ncmResult.capitulo}
                </p>

                {ncmResult.notas && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2.5 mb-3">
                    <p className="text-blue-300 text-xs font-medium mb-0.5">
                      Notas del clasificador
                    </p>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {ncmResult.notas}
                    </p>
                  </div>
                )}

                {ncmResult.alternativas?.length > 0 && (
                  <p className="text-slate-500 text-xs mb-3">
                    Códigos alternativos: {ncmResult.alternativas.join(" / ")}
                  </p>
                )}

                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={usarNCM}
                    className="btn-gold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5"
                  >
                    <ChevronRight size={13} />
                    Usar este NCM en la calculadora
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(ncmResult.codigo_ncm);
                      setNcmCopied(true);
                      setTimeout(() => setNcmCopied(false), 2000);
                    }}
                    className="px-4 py-2 rounded-lg text-xs border border-white/20 text-slate-300 hover:border-yellow-400/40 flex items-center gap-1.5 transition-colors"
                  >
                    {ncmCopied ? (
                      <CheckCheck size={13} className="text-green-400" />
                    ) : (
                      <Copy size={13} />
                    )}
                    {ncmCopied ? "¡Copiado!" : "Copiar código"}
                  </button>
                </div>
              </div>
            )}

            <p className="text-slate-500 text-xs mt-3 flex items-start gap-1.5">
              <AlertTriangle
                size={12}
                className="mt-0.5 flex-shrink-0 text-amber-500"
              />
              Resultado orientativo. Verificá siempre con un despachante de
              aduana oficial.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <form
            id="calculadora-form"
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
              <div className="flex flex-col sm:flex-row gap-2">
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
              {/* Peso volumétrico calculado */}
              {pesoVolumetrico !== null && (
                <div className="mt-2 flex items-start gap-2 bg-yellow-400/5 border border-yellow-400/20 rounded-lg px-3 py-2">
                  <Info
                    size={14}
                    className="text-yellow-400 mt-0.5 flex-shrink-0"
                  />
                  <div className="text-xs text-slate-300 leading-relaxed">
                    <span className="font-medium text-yellow-400">
                      Peso volumétrico: {pesoVolumetrico} kg
                    </span>
                    {" — Se factura el mayor"}
                    {pesoFacturable !== null && (
                      <span className="block text-slate-400 mt-0.5">
                        Peso a facturar:{" "}
                        <span className="font-medium text-white">
                          {pesoFacturable} kg
                        </span>{" "}
                        (
                        {pesoFacturable === pesoVolumetrico
                          ? "volumétrico"
                          : "real"}
                        )
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Error — justo arriba del botón */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2.5">
                <AlertTriangle
                  size={15}
                  className="text-red-400 flex-shrink-0"
                />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

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
                  Claude está analizando las rutas logísticas...
                </p>
              </div>
            )}

            {result && (
              <>
                {/* Header + toggle de moneda */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-white font-semibold text-lg">
                    Estimación de costos
                  </h3>
                  <div className="flex gap-1 bg-white/5 rounded-lg p-1">
                    {["USD", "ARS", "EUR", "BRL"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setDisplayCurrency(c)}
                        disabled={c !== "USD" && (!rates || !rates[c])}
                        className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                          displayCurrency === c
                            ? "bg-yellow-400"
                            : "text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        }`}
                        style={
                          displayCurrency === c ? { color: "#0a1628" } : {}
                        }
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {ratesError && (
                  <div className="flex items-center gap-2 text-amber-400 text-xs bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
                    <AlertTriangle size={13} className="flex-shrink-0" />
                    Tipo de cambio no disponible — mostrando valores en USD
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {/* Flete */}
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-slate-400 text-xs mb-1">
                      Flete estimado
                    </div>
                    <div className="text-yellow-400 font-bold text-lg">
                      {fmtAmt(result.flete_min ?? 0)} –{" "}
                      {fmtAmt(result.flete_max ?? 0)}
                    </div>
                    {displayCurrency !== "USD" && (
                      <div className="text-slate-500 text-xs mt-0.5">
                        USD {result.flete_min?.toLocaleString()} –{" "}
                        {result.flete_max?.toLocaleString()}
                      </div>
                    )}
                    {displayCurrency === "USD" && rates?.ARS && (
                      <div className="text-slate-500 text-xs mt-0.5">
                        ${" "}
                        {(result.flete_min * rates.ARS).toLocaleString(
                          "es-AR",
                          { maximumFractionDigits: 0 },
                        )}{" "}
                        –{" "}
                        {(result.flete_max * rates.ARS).toLocaleString(
                          "es-AR",
                          { maximumFractionDigits: 0 },
                        )}{" "}
                        ARS
                      </div>
                    )}
                  </div>

                  {/* Seguro */}
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-slate-400 text-xs mb-1">
                      Seguro de carga
                    </div>
                    <div className="text-yellow-400 font-bold text-lg">
                      {fmtAmt(result.seguro_min ?? 0)} –{" "}
                      {fmtAmt(result.seguro_max ?? 0)}
                    </div>
                    {displayCurrency !== "USD" && (
                      <div className="text-slate-500 text-xs mt-0.5">
                        USD {result.seguro_min} – {result.seguro_max}
                      </div>
                    )}
                    {displayCurrency === "USD" && rates?.ARS && (
                      <div className="text-slate-500 text-xs mt-0.5">
                        ${" "}
                        {(result.seguro_min * rates.ARS).toLocaleString(
                          "es-AR",
                          { maximumFractionDigits: 0 },
                        )}{" "}
                        –{" "}
                        {(result.seguro_max * rates.ARS).toLocaleString(
                          "es-AR",
                          { maximumFractionDigits: 0 },
                        )}{" "}
                        ARS
                      </div>
                    )}
                  </div>

                  {/* Tránsito */}
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-slate-400 text-xs mb-1">
                      Tiempo de tránsito
                    </div>
                    <div className="text-white font-bold text-lg">
                      {result.tiempo_dias_min} – {result.tiempo_dias_max} días
                    </div>
                  </div>

                  {/* Incoterm */}
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-slate-400 text-xs mb-1">
                      Incoterm recomendado
                    </div>
                    <div className="text-green-400 font-bold text-lg">
                      {result.incoterm_recomendado}
                    </div>
                  </div>

                  {/* Total estimado */}
                  <div className="col-span-2 bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-4">
                    <div className="text-yellow-400 text-xs font-medium mb-1">
                      Total estimado (flete + seguro)
                    </div>
                    <div className="text-yellow-300 font-bold text-xl">
                      {fmtAmt(
                        (result.flete_min ?? 0) + (result.seguro_min ?? 0),
                      )}{" "}
                      –{" "}
                      {fmtAmt(
                        (result.flete_max ?? 0) + (result.seguro_max ?? 0),
                      )}
                    </div>
                    {displayCurrency !== "USD" && (
                      <div className="text-slate-500 text-xs mt-0.5">
                        USD{" "}
                        {(
                          (result.flete_min ?? 0) + (result.seguro_min ?? 0)
                        ).toLocaleString()}{" "}
                        –{" "}
                        {(
                          (result.flete_max ?? 0) + (result.seguro_max ?? 0)
                        ).toLocaleString()}
                      </div>
                    )}
                    {displayCurrency === "USD" && rates?.ARS && (
                      <div className="text-yellow-400/70 text-sm mt-1.5 font-medium">
                        ${" "}
                        {(
                          ((result.flete_min ?? 0) + (result.seguro_min ?? 0)) *
                          rates.ARS
                        ).toLocaleString("es-AR", {
                          maximumFractionDigits: 0,
                        })}{" "}
                        –{" "}
                        {(
                          ((result.flete_max ?? 0) + (result.seguro_max ?? 0)) *
                          rates.ARS
                        ).toLocaleString("es-AR", {
                          maximumFractionDigits: 0,
                        })}{" "}
                        ARS
                      </div>
                    )}
                    {rates?.ARS && (
                      <div className="text-slate-500 text-xs mt-2 leading-relaxed">
                        Tipo de cambio: 1 USD ={" "}
                        {rates.ARS.toLocaleString("es-AR", {
                          maximumFractionDigits: 0,
                        })}{" "}
                        ARS
                        {ratesUpdatedAt !== null &&
                          ` · actualizado hace ${minutesSince(ratesUpdatedAt)} min`}
                        {" · "}Fuente: CurrencyAPI
                      </div>
                    )}
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

                <div className="flex items-start gap-1.5">
                  <Info
                    size={13}
                    className="text-slate-400 mt-0.5 flex-shrink-0"
                  />
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Estimaciones orientativas. Consultá con un despachante para
                    valores exactos.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={generarPDF}
                  disabled={pdfLoading}
                  className="btn-gold w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FileText size={16} />
                  {pdfLoading ? "Generando PDF..." : "Descargar cotización PDF"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
