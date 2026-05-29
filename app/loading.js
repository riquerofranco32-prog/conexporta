export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1628]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Cargando ConExporta...</p>
      </div>
    </div>
  );
}
