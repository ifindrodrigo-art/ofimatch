"use client";
import { useEffect, useState } from "react";
import { DISTRICTS, OFICIOS, type OficioId } from "@/lib/data";
import type { Backend, Profile, Role } from "@/lib/types";

export default function Auth({ backend, initialRole, onDone }: { backend: Backend; initialRole?: Role; onDone: () => void }) {
  const [mode, setMode] = useState<"registro" | "ingreso">("registro");
  const [role, setRole] = useState<Role | null>(initialRole ?? null);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    district: "San Juan de Lurigancho",
    oficio: "electricista" as OficioId,
    years_exp: "5",
    bio: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [accounts, setAccounts] = useState<Profile[]>([]);

  useEffect(() => {
    backend.demoAccounts?.().then(setAccounts);
  }, [backend]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "ingreso") {
        await backend.signIn(form.email, form.password);
        onDone();
      } else {
        if (!/^9\d{8}$/.test(form.phone.replace(/\s/g, ""))) throw new Error("Escribe un celular peruano de 9 dígitos que empiece con 9.");
        const r = await backend.signUp({
          email: form.email,
          password: form.password,
          role: role!,
          full_name: form.full_name.trim(),
          phone: form.phone.replace(/\s/g, ""),
          district: form.district,
          oficio: role === "trabajador" ? form.oficio : undefined,
          years_exp: role === "trabajador" ? Number(form.years_exp) : undefined,
          bio: role === "trabajador" ? form.bio.trim() : undefined,
        });
        if (r.needsConfirm) setSent(true);
        else onDone();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo completar. Intenta otra vez.");
    } finally {
      setBusy(false);
    }
  }

  if (sent)
    return (
      <div className="confirm">
        <div className="check">✓</div>
        <h1 className="h-app">Revisa tu correo</h1>
        <p>Te enviamos un enlace a {form.email}. Ábrelo para activar tu cuenta y volver a la app.</p>
      </div>
    );

  if (mode === "registro" && !role)
    return (
      <div className="stack">
        <div>
          <h1 className="h-app">¿Cómo vas a usar OfiMatch?</h1>
          <p className="sub-app">Lo eliges una sola vez, al crear tu cuenta.</p>
        </div>
        <div className="role-pick">
          <button onClick={() => setRole("cliente")}>
            <b>Necesito un servicio</b>
            <span>Busco un electricista, gasfitero, albañil o soldador.</span>
          </button>
          <button className="worker" onClick={() => setRole("trabajador")}>
            <b>Ofrezco mis servicios</b>
            <span>Soy trabajador de oficio y quiero clientes cerca.</span>
          </button>
        </div>
        <p className="muted">
          ¿Ya tienes cuenta?{" "}
          <button className="linkish" onClick={() => setMode("ingreso")}>
            Inicia sesión
          </button>
        </p>
        {accounts.length > 0 && (
          <div className="card">
            <h3>Cuentas creadas en este dispositivo</h3>
            {accounts.map((a) => (
              <button key={a.id} className="btn btn-ghost btn-s" onClick={() => backend.demoLogin!(a.id).then(onDone)}>
                Entrar como {a.full_name} ({a.role})
              </button>
            ))}
          </div>
        )}
      </div>
    );

  return (
    <form className="stack" onSubmit={submit}>
      <div>
        <h1 className="h-app">
          {mode === "ingreso" ? "Inicia sesión" : role === "trabajador" ? "Crea tu perfil de trabajador" : "Crea tu cuenta"}
        </h1>
        {mode === "registro" && (
          <p className="sub-app">
            <button type="button" className="linkish" onClick={() => setRole(null)}>
              Cambiar tipo de cuenta
            </button>
          </p>
        )}
      </div>

      {mode === "registro" && (
        <>
          <label className="field">
            <span>Nombre y apellido</span>
            <input className="input" required minLength={2} maxLength={80} value={form.full_name} onChange={set("full_name")} autoComplete="name" />
          </label>
          <label className="field">
            <span>Celular (WhatsApp)</span>
            <input className="input" required inputMode="tel" placeholder="987654321" value={form.phone} onChange={set("phone")} autoComplete="tel-national" />
            <small>Solo lo ve la otra persona cuando se acepta un trabajo.</small>
          </label>
          <label className="field">
            <span>{role === "trabajador" ? "Distrito donde trabajas" : "Tu distrito"}</span>
            <select className="input" value={form.district} onChange={set("district")}>
              {DISTRICTS.map((d) => (
                <option key={d.name}>{d.name}</option>
              ))}
            </select>
          </label>
          {role === "trabajador" && (
            <>
              <label className="field">
                <span>Oficio</span>
                <select className="input" value={form.oficio} onChange={set("oficio")}>
                  {OFICIOS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.singular}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Años de experiencia</span>
                <input className="input" type="number" min={0} max={60} required value={form.years_exp} onChange={set("years_exp")} />
              </label>
              <label className="field">
                <span>¿Qué trabajos haces? (opcional)</span>
                <textarea className="input" maxLength={400} value={form.bio} onChange={set("bio")} placeholder="Ej.: instalaciones, tableros, pozo a tierra…" />
              </label>
            </>
          )}
        </>
      )}

      <label className="field">
        <span>Correo</span>
        <input className="input" type="email" required value={form.email} onChange={set("email")} autoComplete="email" />
      </label>
      <label className="field">
        <span>Contraseña</span>
        <input
          className="input"
          type="password"
          required
          minLength={6}
          value={form.password}
          onChange={set("password")}
          autoComplete={mode === "ingreso" ? "current-password" : "new-password"}
        />
        {mode === "registro" && <small>Mínimo 6 caracteres.</small>}
      </label>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <button className="btn btn-primary btn-block" disabled={busy}>
        {busy ? "Un momento…" : mode === "ingreso" ? "Iniciar sesión" : "Crear cuenta"}
      </button>
      <p className="muted">
        {mode === "ingreso" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
        <button type="button" className="linkish" onClick={() => setMode(mode === "ingreso" ? "registro" : "ingreso")}>
          {mode === "ingreso" ? "Créala gratis" : "Inicia sesión"}
        </button>
      </p>
    </form>
  );
}
