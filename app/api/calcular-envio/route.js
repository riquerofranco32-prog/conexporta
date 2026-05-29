import Anthropic from "@anthropic-ai/sdk";
import { checkRateLimit } from "@/app/lib/rateLimit";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM =
  "Sos un experto en costos logísticos internacionales con foco en Argentina. Respondé SOLO con JSON válido, sin texto extra ni markdown.";

export async function POST(request) {
  if (!checkRateLimit(request)) {
    return Response.json(
      { error: "Demasiadas solicitudes. Esperá un minuto e intentá de nuevo." },
      { status: 429 },
    );
  }
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return Response.json(
        { error: "Content-Type inválido." },
        { status: 415 },
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json(
        { error: "ANTHROPIC_API_KEY no configurada." },
        { status: 500 },
      );
    }

    const body = await request.json();
    const {
      origen,
      destino,
      modo,
      producto,
      categoria,
      peso,
      largo,
      ancho,
      alto,
    } = body;

    if (!origen || !destino || !modo || !producto || !peso) {
      return Response.json(
        { error: "Faltan campos requeridos." },
        { status: 400 },
      );
    }

    const pesoVol =
      largo && ancho && alto
        ? modo === "aereo"
          ? (largo * ancho * alto) / 5000
          : (largo * ancho * alto) / 6000
        : null;
    const pesoFacturable = pesoVol
      ? Math.max(Number(peso), pesoVol)
      : Number(peso);

    const prompt = `Calculá los costos logísticos para este envío internacional desde Argentina:
- Origen: ${origen}
- Destino: ${destino}
- Modo de transporte: ${modo}
- Producto: ${producto}
- Categoría: ${categoria}
- Peso real: ${peso} kg${pesoVol ? `\n- Peso volumétrico: ${pesoVol.toFixed(1)} kg (peso a facturar: ${pesoFacturable.toFixed(1)} kg)` : ""}
${largo ? `- Dimensiones: ${largo}×${ancho}×${alto} cm` : ""}

Respondé SOLO con este JSON exacto (valores en USD):
{
  "costoFlete": number,
  "seguro": number,
  "gastosDestino": number,
  "derechosImportacion": number,
  "iva": number,
  "total": number,
  "diasMinimo": number,
  "diasMaximo": number,
  "fechaLlegadaEstimada": "DD MMM YYYY",
  "notas": "string breve con observaciones clave del envío"
}`;

    const response = await client.messages.create({
      model: process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system: SYSTEM,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = response.content?.[0]?.text || "";
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Respuesta inválida del asistente.");
      parsed = JSON.parse(match[0]);
    }

    return Response.json(parsed);
  } catch (error) {
    console.error("[calcular-envio]", error);
    if (error?.status === 429) {
      return Response.json(
        { error: "Límite de consultas alcanzado. Esperá unos segundos." },
        { status: 429 },
      );
    }
    return Response.json(
      { error: "No se pudo calcular el envío. Intentá de nuevo." },
      { status: 500 },
    );
  }
}
