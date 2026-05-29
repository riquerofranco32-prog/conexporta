const CACHE_MS = 3600 * 1000; // 1 hora
let cache = { rates: null, ts: 0 };

export async function GET() {
  try {
    const apiKey = process.env.CURRENCYAPI_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "CURRENCYAPI_KEY no configurada." },
        { status: 500 },
      );
    }

    // Devolver cache si es reciente (evitar quemar los 300 req/mes)
    if (cache.rates && Date.now() - cache.ts < CACHE_MS) {
      return Response.json({
        ...cache.rates,
        cached: true,
        updatedAt: cache.ts,
      });
    }

    const res = await fetch(
      `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&currencies=ARS,EUR,BRL`,
      { next: { revalidate: 3600 } },
    );

    if (!res.ok) throw new Error(`CurrencyAPI error ${res.status}`);

    const json = await res.json();
    const data = json?.data;

    if (!data?.ARS || !data?.EUR || !data?.BRL) {
      throw new Error("Respuesta inesperada de CurrencyAPI");
    }

    const rates = {
      ARS: data.ARS.value,
      EUR: data.EUR.value,
      BRL: data.BRL.value,
    };

    cache = { rates, ts: Date.now() };
    return Response.json({ ...rates, updatedAt: cache.ts });
  } catch (err) {
    console.error("[currency]", err);
    // Fallback: devolver cache vencida si existe
    if (cache.rates) {
      return Response.json({
        ...cache.rates,
        cached: true,
        stale: true,
        updatedAt: cache.ts,
      });
    }
    return Response.json(
      { error: "No se pudo obtener el tipo de cambio." },
      { status: 502 },
    );
  }
}
