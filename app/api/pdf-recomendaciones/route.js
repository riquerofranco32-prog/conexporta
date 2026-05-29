import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = `Sos un especialista en comercio exterior argentino.
Generás recomendaciones profesionales y concisas para incluir en cotizaciones formales.
Respondé en español, tono profesional.
Respondé SOLO con JSON válido, sin texto adicional, sin markdown, sin backticks.`;

export async function POST(request) {
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
    const { producto, ncm, origen, destino, transporte, peso } = body;

    const userPrompt = `Generá recomendaciones para este envío de comercio exterior desde Argentina:
- Producto: ${producto || "no especificado"}
- Código NCM: ${ncm || "no clasificado"}
- Origen: ${origen || "Argentina"}
- Destino: ${destino || "no especificado"}
- Modo de transporte: ${transporte || "marítimo"}
- Peso: ${peso || "no especificado"} kg

Respondé SOLO con este JSON exacto:
{
  "documentacion_requerida": ["doc1", "doc2", "doc3"],
  "organismos_intervinientes": ["org1", "org2"],
  "incoterm_recomendado": "string con incoterm y justificación breve",
  "riesgos_a_considerar": ["riesgo1", "riesgo2"],
  "recomendaciones_generales": ["rec1", "rec2", "rec3"],
  "tiempo_tramitacion_estimado": "string ej: 5-7 días hábiles previos al embarque"
}`;

    const response = await client.messages.create({
      model: process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001",
      max_tokens: 800,
      system: SYSTEM,
      messages: [{ role: "user", content: userPrompt }],
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
    console.error("[pdf-recomendaciones]", error);
    if (error?.status === 429) {
      return Response.json(
        { error: "Límite de consultas alcanzado. Esperá unos segundos." },
        { status: 429 },
      );
    }
    return Response.json(
      { error: "No se pudieron generar las recomendaciones." },
      { status: 500 },
    );
  }
}
