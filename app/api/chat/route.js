import { GoogleGenerativeAI } from "@google/generative-ai";

const MAX_MESSAGES = 30;
const MAX_MESSAGE_CHARS = 4000;
const MAX_USER_INPUT_CHARS = 2000;

const CHAT_SYSTEM_PROMPT = `Sos un experto en comercio exterior y logística internacional especializado en operaciones desde Argentina.
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

const CALCULATOR_SYSTEM_PROMPT =
  "Sos un experto en costos logísticos argentinos. Respondé SOLO con JSON válido sin texto extra ni markdown.";

export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return Response.json(
        { error: "Content-Type debe ser application/json." },
        { status: 415 },
      );
    }

    const { messages, mode } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "GEMINI_API_KEY no configurada." },
        { status: 500 },
      );
    }

    if (!messages?.length) {
      return Response.json({ error: "Sin mensajes." }, { status: 400 });
    }

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

    const sanitized = messages.map((m) => ({
      role: m.role,
      content:
        typeof m.content === "string"
          ? m.content.slice(0, MAX_USER_INPUT_CHARS)
          : m.content,
    }));

    const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    const systemPrompt =
      mode === "calculator" ? CALCULATOR_SYSTEM_PROMPT : CHAT_SYSTEM_PROMPT;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemPrompt,
    });

    let reply;

    if (mode === "calculator") {
      const result = await model.generateContent(sanitized[0].content);
      reply = result.response.text();
    } else {
      // Separar historial del último mensaje
      const history = sanitized.slice(0, -1).map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));
      const lastMessage = sanitized[sanitized.length - 1].content;

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(lastMessage);
      reply = result.response.text();
    }

    return Response.json({ reply: reply || "Sin respuesta del asistente." });
  } catch (error) {
    console.error("[chat] Error interno:", error);

    const status = error?.status || error?.httpStatus;
    if (status === 429) {
      return Response.json(
        {
          error:
            "Límite de consultas alcanzado (plan gratuito). Esperá unos segundos e intentá de nuevo.",
        },
        { status: 429 },
      );
    }
    if (status) {
      const msg = (error?.message || "").slice(0, 200);
      return Response.json(
        { error: `Error ${status} de la API: ${msg}` },
        { status: 502 },
      );
    }

    return Response.json(
      { error: "Error interno del servidor. Intentá de nuevo más tarde." },
      { status: 500 },
    );
  }
}
