"use client";
import { useState } from "react";
import { Search, Plus, X, Trash2, AlertTriangle } from "lucide-react";
import {
  EMPRESA_TIPOS,
  EMPRESA_ESTADOS,
  SAMPLE_EMPRESAS,
} from "@/app/lib/constants";

const INITIAL_EMPRESA = {
  razonSocial: "",
  cuit: "",
  contacto: "",
  email: "",
  tipo: "Exportador",
  estado: "Activo",
};

export default function GestionFirmas() {
  const [empresas, setEmpresas] = useState(SAMPLE_EMPRESAS);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(INITIAL_EMPRESA);
  const [showForm, setShowForm] = useState(false);
  const [nextId, setNextId] = useState(4);
  const [formError, setFormError] = useState("");

  const filtered = empresas.filter(
    (e) =>
      e.razonSocial.toLowerCase().includes(search.toLowerCase()) ||
      e.cuit.includes(search) ||
      e.contacto.toLowerCase().includes(search.toLowerCase()),
  );

  const stats = {
    total: empresas.length,
    activas: empresas.filter((e) => e.estado === "Activo").length,
    pendientes: empresas.filter((e) => e.estado === "Pendiente").length,
  };

  function setField(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function agregarEmpresa(e) {
    e.preventDefault();
    if (
      !form.razonSocial ||
      !form.cuit ||
      !form.contacto ||
      !form.email ||
      !form.email.includes("@")
    ) {
      setFormError(
        "Completá todos los campos obligatorios con un email válido.",
      );
      return;
    }
    setFormError("");
    setEmpresas((prev) => [...prev, { ...form, id: nextId }]);
    setNextId((n) => n + 1);
    setForm(INITIAL_EMPRESA);
    setShowForm(false);
  }

  function eliminarEmpresa(id) {
    setEmpresas((prev) => prev.filter((e) => e.id !== id));
  }

  const estadoColor = {
    Activo: "text-green-400 bg-green-400/10",
    Pendiente: "text-yellow-400 bg-yellow-400/10",
    Inactivo: "text-slate-400 bg-slate-400/10",
  };

  return (
    <section id="gestion" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 animate-on-scroll">
            Gestión de <span className="gold-text">Firmas</span>
          </h2>
          <p className="text-slate-400">
            Mini-CRM para gestionar los operadores de comercio exterior del
            consultorio
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Total empresas",
              value: stats.total,
              color: "text-white",
            },
            { label: "Activas", value: stats.activas, color: "text-green-400" },
            {
              label: "Pendientes",
              value: stats.pendientes,
              color: "text-yellow-400",
            },
          ].map((s, i) => (
            <div
              key={s.label}
              className="glass-card p-5 text-center fade-in-scale"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-slate-400 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search & Add */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por empresa, CUIT o contacto..."
              className="w-full bg-white/10 border border-white/20 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400/50"
            />
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-gold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2"
          >
            <Plus size={16} />
            Nueva firma
          </button>
        </div>

        {/* New empresa form */}
        {showForm && (
          <form
            onSubmit={agregarEmpresa}
            className="glass-card p-6 mb-6 grid sm:grid-cols-2 gap-4"
          >
            <h3 className="text-white font-semibold sm:col-span-2">
              Registrar nueva empresa
            </h3>
            {[
              {
                key: "razonSocial",
                label: "Razón social *",
                placeholder: "Empresa SA",
              },
              { key: "cuit", label: "CUIT *", placeholder: "30-12345678-9" },
              {
                key: "contacto",
                label: "Contacto *",
                placeholder: "Nombre apellido",
              },
              {
                key: "email",
                label: "Email *",
                placeholder: "contacto@empresa.com",
              },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-slate-400 text-xs mb-1 block">
                  {f.label}
                </label>
                <input
                  type={f.key === "email" ? "email" : "text"}
                  value={form[f.key]}
                  onChange={(e) => setField(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400/50"
                />
              </div>
            ))}
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Tipo</label>
              <select
                value={form.tipo}
                onChange={(e) => setField("tipo", e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400/50"
              >
                {EMPRESA_TIPOS.map((t) => (
                  <option key={t} value={t} className="bg-gray-900">
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">
                Estado
              </label>
              <select
                value={form.estado}
                onChange={(e) => setField("estado", e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400/50"
              >
                {EMPRESA_ESTADOS.map((s) => (
                  <option key={s} value={s} className="bg-gray-900">
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2 flex flex-col gap-3">
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="btn-gold px-6 py-2 rounded-lg text-sm"
                  style={{ color: "#0a1628" }}
                >
                  Guardar empresa
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setForm(INITIAL_EMPRESA);
                    setFormError("");
                  }}
                  className="px-6 py-2 rounded-lg text-sm border border-white/20 text-slate-400 hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
              </div>
              {formError && <p className="text-red-400 text-sm">{formError}</p>}
            </div>
          </form>
        )}

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="table-mobile-wrapper overflow-x-auto">
            <table className="table-mobile w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-left">
                  <th className="px-5 py-3 font-medium">Empresa</th>
                  <th className="px-5 py-3 font-medium">CUIT</th>
                  <th className="px-5 py-3 font-medium">Contacto</th>
                  <th className="px-5 py-3 font-medium">Tipo</th>
                  <th className="px-5 py-3 font-medium">Estado</th>
                  <th className="px-5 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500">
                      No se encontraron empresas.
                    </td>
                  </tr>
                )}
                {filtered.map((e) => (
                  <tr
                    key={e.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td data-label="Empresa" className="px-5 py-3">
                      <div className="font-medium text-white">
                        {e.razonSocial}
                      </div>
                      <div className="text-slate-500 text-xs">{e.email}</div>
                    </td>
                    <td
                      data-label="CUIT"
                      className="px-5 py-3 text-slate-300 font-mono text-xs"
                    >
                      {e.cuit}
                    </td>
                    <td
                      data-label="Contacto"
                      className="px-5 py-3 text-slate-300"
                    >
                      {e.contacto}
                    </td>
                    <td
                      data-label="Tipo"
                      className="px-5 py-3 text-slate-400 text-xs"
                    >
                      {e.tipo}
                    </td>
                    <td data-label="Estado" className="px-5 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${estadoColor[e.estado]}`}
                      >
                        {e.estado}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => eliminarEmpresa(e.id)}
                        className="text-slate-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-slate-600 text-xs mt-3 text-center">
          Los datos se almacenan en memoria. Para persistencia real integrá
          Supabase en versiones futuras.
        </p>
        {process.env.NODE_ENV === "development" && (
          <p className="text-xs text-yellow-500 mt-2 text-center">
            ⚠ Datos de ejemplo — integrar Supabase para persistencia
          </p>
        )}
      </div>
    </section>
  );
}
