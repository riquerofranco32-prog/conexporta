const MAX_MESSAGES = 30;
const MAX_MESSAGE_CHARS = 4000;
const MAX_USER_INPUT_CHARS = 2000;

export async function POST(request) {
  try {
    // Fix #2: Validate Content-Type before parsing
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return Response.json(
        { error: "Content-Type debe ser application/json." },
        { status: 415 },
      );
    }

    const { messages, mode } = await request.json();

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "XAI_API_KEY no configurada." },
        { status: 500 },
      );
    }

    const chatSystemPrompt = `Sos un experto en comercio exterior y logística internacional especializado en operaciones desde Argentina.
Tu nombre es ConExporta AI y trabajás para el Consultorio de Comercio Exterior universitario ConExporta.

Tu rol es ayudar con:
- Procesos de exportación e importación desde/hacia Argentina
- Documentación aduanera: DJVEs, permisos de exportación, certificados de origen, facturas comerciales
- Embalaje según normas internacionales (IRAM, INCOTERMS 2020)
- Rutas logísticas: marítimas, aéreas y terrestres
- Puertos principales: Buenos Aires, Rosario, San Lorenzo, Bahía Blanca
- Incoterms 2020: EXW, FOB, CIF, DDP y sus implicaciones prácticas
- Organismos: AFIP, SENASA, INAL, Cancillería
- Posiciones arancelarias (NCM/HS Code)
- Regímenes especiales: reintegros, draw-back, PYME exportadora

Respondé siempre en español argentino, de forma clara, profesional y empática. Usá ejemplos prácticos argentinos.
Si la consulta está fuera de tu área (comercio exterior), indicalo amablemente y redirigí al usuario.`;

    const model = process.env.GROK_MODEL || "grok-3";

    const systemContent =
      mode === "calculator"
        ? "Sos un experto en costos logísticos argentinos. Respondé SOLO con JSON válido sin texto extra ni markdown."
        : chatSystemPrompt;

    if (!messages?.length) {
      return Response.json({ error: "Sin mensajes." }, { status: 400 });
    }

    // Fix #1: Validate message count and per-message length
    if (messages.length > MAX_MESSAGES) {
      return Response.json(
        { error: `El historial no puede superar ${MAX_MESSAGES} mensajes.` },
        { status: 400 },
      );
    }

    for (const msg of messages) {
      if (
        typeof msg.content === "string" &&
        msg.content.length > MAX_MESSAGE_CHARS
      ) {
        return Response.json(
          {
            error: `Cada mensaje no puede superar ${MAX_MESSAGE_CHARS} caracteres.`,
          },
          { status: 400 },
        );
      }
    }

    // Fix #4: Sanitize user input — truncate each message to MAX_USER_INPUT_CHARS
    const sanitizedMessages = messages.map((msg) => ({
      ...msg,
      content:
        typeof msg.content === "string"
          ? msg.content.slice(0, MAX_USER_INPUT_CHARS)
          : msg.content,
    }));

    const userMessages =
      mode === "calculator"
        ? [{ role: "user", content: sanitizedMessages[0].content }]
        : sanitizedMessages;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: systemContent }, ...userMessages],
        temperature: mode === "calculator" ? 0.3 : 0.7,
        max_tokens: mode === "calculator" ? 512 : 2048,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      // Fix #3: Log full error server-side, return only a generic message to the client
      const errorText = await response.text();
      console.error(
        `[chat] Error de API xAI (${response.status}): ${errorText}`,
      );
      return Response.json(
        {
          error:
            "Error al comunicarse con el asistente. Intentá de nuevo más tarde.",
        },
        { status: 502 },
      );
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content || "Sin respuesta del asistente.";

    return Response.json({ reply });
  } catch (error) {
    // Fix #5: Log real error server-side, return a generic message to the client
    console.error("[chat] Error interno:", error);
    return Response.json(
      { error: "Error interno del servidor. Intentá de nuevo más tarde." },
      { status: 500 },
    );
  }
}
