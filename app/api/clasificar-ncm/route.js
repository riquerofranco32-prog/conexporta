import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = `Sos un experto en clasificación arancelaria internacional.
Tu tarea es determinar el código NCM (Nomenclatura Común del Mercosur)
y HS (Harmonized System) más preciso para productos de exportación/importación desde Argentina.
Respondé SOLO con un objeto JSON válido, sin texto adicional, sin markdown, sin backticks.`;

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
    const { descripcion } = body;

    if (!descripcion?.trim()) {
      return Response.json(
        { error: "La descripción del producto es requerida." },
        { status: 400 },
      );
    }

    const sanitized = String(descripcion).slice(0, 1000);

    const userPrompt = `Clasificá este producto para exportación/importación desde Argentina:
${sanitized}

Respondé SOLO con este JSON exacto:
{
  "codigo_hs6": "string de 6 dígitos (estándar internacional)",
  "codigo_ncm": "string de 8 dígitos con punto (ej: 6403.99.00)",
  "descripcion_oficial": "string con la descripción arancelaria oficial",
  "seccion": "string con la sección del arancel (ej: Sección XII — Calzado)",
  "capitulo": "string con el capítulo (ej: Capítulo 64 — Calzado)",
  "confianza": "alta | media | baja",
  "alternativas": ["codigo1", "codigo2"],
  "notas": "string con observaciones sobre la clasificación o documentación requerida"
}`;

    const response = await client.messages.create({
      model: process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001",
      max_tokens: 600,
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

    // Validar contra htsapi.com (server-side, sin CORS)
    const hs6 = String(parsed.codigo_hs6 || "")
      .replace(/\D/g, "")
      .slice(0, 6);
    let validado_hs = false;
    let hs_descripcion = null;

    if (hs6.length === 6) {
      try {
        const htsRes = await fetch(`https://htsapi.com/v1/hs/${hs6}`, {
          headers: { Accept: "application/json" },
          signal: AbortSignal.timeout(5000),
        });
        if (htsRes.ok) {
          const htsData = await htsRes.json();
          validado_hs = true;
          hs_descripcion = htsData.description || null;
        }
      } catch {
        // Degradar gracefully — el resultado de Claude se muestra igual
      }
    }

    return Response.json({ ...parsed, validado_hs, hs_descripcion });
  } catch (error) {
    console.error("[clasificar-ncm]", error);
    if (error?.status === 429) {
      return Response.json(
        { error: "Límite de consultas alcanzado. Esperá unos segundos." },
        { status: 429 },
      );
    }
    return Response.json(
      { error: "No se pudo clasificar el producto. Intentá de nuevo." },
      { status: 500 },
    );
  }
}
