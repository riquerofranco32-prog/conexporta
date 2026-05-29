"use client";

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1628] text-white px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">⚠</span>
        </div>
        <h2 className="text-2xl font-bold mb-3">Algo salió mal</h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          {error?.message
            ? "Hubo un problema inesperado. Por favor intentá de nuevo."
            : "Hubo un problema al cargar la página."}
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:brightness-110 transition-all"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
