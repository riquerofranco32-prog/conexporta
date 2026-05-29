// ── Chatbot ───────────────────────────────────────────────────────────────────

export const WELCOME_TEXT =
  "¡Hola! Soy ConExporta AI, tu asistente de comercio exterior argentino. Podés consultarme sobre documentación aduanera, Incoterms, logística, organismos reguladores y mucho más. ¿En qué te puedo ayudar hoy?";

export const SUGGESTED_QUESTIONS = [
  "¿Qué documentos necesito para exportar por primera vez?",
  "¿Cuál es la diferencia entre FOB y CIF?",
  "¿Qué hace SENASA en una exportación de alimentos?",
  "¿Cómo calculo la posición arancelaria de mi producto?",
  "¿Qué son los reintegros de exportación?",
  "¿Cuáles son los puertos principales de Argentina?",
];

export const TRUNCATE_AT = 400;
export const PREVIEW_LEN = 200;

// ── Calculadora ───────────────────────────────────────────────────────────────

export const PUERTOS = [
  "Buenos Aires (Exolgan)",
  "Rosario (Terminal 6)",
  "San Lorenzo",
  "Bahía Blanca",
  "Mar del Plata",
  "Mendoza (terrestre)",
  "Córdoba (aéreo)",
  "Ezeiza (aéreo)",
  "Miami, USA",
  "Rotterdam, Países Bajos",
  "Shanghai, China",
  "Santos, Brasil",
  "Valparaíso, Chile",
  "Hamburgo, Alemania",
];

export const CURRENCY_CACHE_KEY = "conexporta_rates";
export const CURRENCY_CACHE_TTL = 3_600_000;
export const CURRENCY_SYMBOLS = { USD: "USD", ARS: "$", EUR: "€", BRL: "R$" };
export const CURRENCY_LOCALES = {
  USD: "en-US",
  ARS: "es-AR",
  EUR: "de-DE",
  BRL: "pt-BR",
};

// ── Gestión de Firmas ─────────────────────────────────────────────────────────

export const EMPRESA_TIPOS = [
  "Exportador",
  "Importador",
  "Exportador/Importador",
];
export const EMPRESA_ESTADOS = ["Activo", "Pendiente", "Inactivo"];

export const SAMPLE_EMPRESAS = [
  {
    id: 1,
    razonSocial: "Agro Export SA",
    cuit: "30-12345678-9",
    contacto: "Carlos Pérez",
    email: "cperez@agroexport.com.ar",
    tipo: "Exportador",
    estado: "Activo",
  },
  {
    id: 2,
    razonSocial: "Import Tech SRL",
    cuit: "30-98765432-1",
    contacto: "María González",
    email: "mgonzalez@importech.com.ar",
    tipo: "Importador",
    estado: "Activo",
  },
  {
    id: 3,
    razonSocial: "Global Trade ARG",
    cuit: "30-55566677-8",
    contacto: "Juan Rodríguez",
    email: "jrodriguez@globaltrade.ar",
    tipo: "Exportador/Importador",
    estado: "Pendiente",
  },
];

// ── Hero ──────────────────────────────────────────────────────────────────────

export const ROTATE_WORDS = [
  "exportaciones",
  "importaciones",
  "Incoterms 2020",
  "logística internacional",
  "documentación aduanera",
];

export const PREVIEW_MSGS = [
  {
    role: "user",
    text: "¿Qué documentos necesito para exportar por primera vez?",
  },
  {
    role: "bot",
    text: "Para tu primera exportación necesitás:\n- **DJVE** ante AFIP\n- **Factura comercial** en inglés\n- **Packing list** detallado\n- **Certificado de origen** (si aplica)",
  },
  { role: "user", text: "¿Cuánto tarda el despacho?" },
];
