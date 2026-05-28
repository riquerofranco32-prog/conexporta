export async function POST(request) {
  try {
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

    const systemPrompt =
      mode === "calculator" ? messages[0].content : chatSystemPrompt;
    const userMessages =
      mode === "calculator"
        ? [{ role: "user", content: messages[0].content }]
        : messages;

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-3-latest",
        messages: [
          {
            role: "system",
            content:
              mode === "calculator"
                ? "Sos un experto en costos logísticos argentinos. Respondé SOLO con JSON válido sin texto extra ni markdown."
                : chatSystemPrompt,
          },
          ...userMessages,
        ],
        temperature: mode === "calculator" ? 0.3 : 0.7,
        max_tokens: mode === "calculator" ? 512 : 1024,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return Response.json(
        { error: `Error de API: ${response.status}` },
        { status: 502 },
      );
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content || "Sin respuesta del asistente.";

    return Response.json({ reply });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
