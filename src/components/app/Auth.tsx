"use client";
import { useEffect, useState } from "react";
import { DISTRICTS, OFICIOS, type OficioId } from "@/lib/data";
import type { Backend, Profile, Role } from "@/lib/types";
import { Icon } from "../site/Icons";

export default function Auth({
  backend,
  initialRole,
  initialMode = "registro",
  onDone,
}: {
  backend: Backend;
  initialRole?: Role;
  initialMode?: "registro" | "ingreso";
  onDone: () => void;
}) {
  const [mode, setMode] = useState<"registro" | "ingreso">(initialMode);
  const [role, setRole] = useState<Role | null>(initialRole ?? null);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    district: "San Juan de Lurigancho",
    oficio: "electricista" as OficioId,
    years_exp: "5",
    price_from: "",
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
        return;
      }
      const phone = form.phone.replace(/\s/g, "");
      if (!/^9\d{8}$/.test(phone)) throw new Error("Escribe un celular peruano de 9 dígitos que empiece con 9.");
      const price = Number(form.price_from);
      if (role === "trabajador" && !(price > 0)) throw new Error("Pon tu precio desde en soles, por ejemplo 60.");
      const r = await backend.signUp({
        email: form.email,
        password: form.password,
        role: role!,
        full_name: form.full_name.trim(),
        phone,
        district: form.district,
        oficio: role === "trabajador" ? form.oficio : undefined,
        years_exp: role === "trabajador" ? Number(form.years_exp) : undefined,
        price_from: role === "trabajador" ? price : undefined,
        bio: role === "trabajador" ? form.bio.trim() : undefined,
      });
      if (r.needsConfirm) setSent(true);
      else onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo completar. Intenta otra vez.");
    } finally {
      setBusy(false);
    }
  }

  if (sent)
    return (
      <div className="confirm">
        <div className="check">
          <Icon name="check" />
        </div>
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
          <button type="button" onClick={() => setRole("cliente")}>
            <span className="r-ico">
              <Icon name="search" />
            </span>
            <b>Necesito un técnico</b>
            <span>Para mi casa, negocio o edificio.</span>
          </button>
          <button type="button" onClick={() => setRole("trabajador")}>
            <span className="r-ico">
              <Icon name="bolt" />
            </span>
            <b>Soy técnico</b>
            <span>Ofrezco mi oficio y quiero clientes cerca.</span>
          </button>
        </div>
        <p className="muted">
          ¿Ya tienes cuenta?{" "}
          <button type="button" className="linkish" onClick={() => setMode("ingreso")}>
            Ingresar
          </button>
        </p>
        {accounts.length > 0 && (
          <div className="panel">
            <h3>Cuentas creadas en este celular</h3>
            <div className="accounts">
              {accounts.map((a) => (
                <button key={a.id} type="button" className="btn btn-outline" onClick={() => backend.demoLogin!(a.id).then(onDone)}>
                  Entrar como {a.full_name} ({a.role === "trabajador" ? "técnico" : "cliente"})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );

  return (
    <form className="stack" onSubmit={submit} noValidate={false}>
      <div>
        <h1 className="h-app">{mode === "ingreso" ? "Ingresa a tu cuenta" : role === "trabajador" ? "Crea tu perfil de técnico" : "Crea tu cuenta"}</h1>
        {mode === "registro" && (
          <p className="sub-app">
            {role === "trabajador" ? "Tu perfil aparece en la web y en la app. " : "Es gratis. "}
            <button type="button" className="linkish" onClick={() => setRole(null)}>
              Cambiar tipo de cuenta
            </button>
          </p>
        )}
      </div>

      {mode === "registro" && (
        <>
          <div className="field">
            <label htmlFor="f-name">Nombre y apellido</label>
            <input id="f-name" className="input" required minLength={2} maxLength={80} value={form.full_name} onChange={set("full_name")} autoComplete="name" />
          </div>
          <div className="field">
            <label htmlFor="f-phone">Celular (WhatsApp)</label>
            <input id="f-phone" className="input" required inputMode="tel" placeholder="987654321" value={form.phone} onChange={set("phone")} autoComplete="tel-national" />
            <small>Solo lo ve la otra persona cuando se acepta un trabajo.</small>
          </div>
          <div className="field">
            <label htmlFor="f-district">{role === "trabajador" ? "Distrito donde trabajas" : "Tu distrito"}</label>
            <select id="f-district" className="input" value={form.district} onChange={set("district")}>
              {DISTRICTS.map((d) => (
                <option key={d.name}>{d.name}</option>
              ))}
            </select>
          </div>
          {role === "trabajador" && (
            <>
              <div className="field">
                <label htmlFor="f-oficio">Oficio</label>
                <select id="f-oficio" className="input" value={form.oficio} onChange={set("oficio")}>
                  {OFICIOS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.singular}
                    </option>
                  ))}
                </select>
              </div>
              <div className="price-row">
                <div className="field">
                  <label htmlFor="f-price">Precio desde (S/)</label>
                  <input id="f-price" className="input" type="number" min={1} max={100000} inputMode="numeric" required placeholder="60" value={form.price_from} onChange={set("price_from")} />
                </div>
                <div className="field">
                  <label htmlFor="f-years">Años de experiencia</label>
                  <input id="f-years" className="input" type="number" min={0} max={60} required value={form.years_exp} onChange={set("years_exp")} />
                </div>
              </div>
              <div className="field">
                <label htmlFor="f-bio">¿Qué trabajos haces?</label>
                <textarea id="f-bio" className="input" maxLength={400} value={form.bio} onChange={set("bio")} placeholder="Ej.: instalaciones, tableros y pozo a tierra." />
                <small>Las fotos de tus trabajos las subes después, desde Mi perfil.</small>
              </div>
            </>
          )}
        </>
      )}

      <div className="field">
        <label htmlFor="f-email">Correo</label>
        <input id="f-email" className="input" type="email" required value={form.email} onChange={set("email")} autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor="f-pass">Contraseña</label>
        <input
          id="f-pass"
          className="input"
          type="password"
          required
          minLength={6}
          value={form.password}
          onChange={set("password")}
          autoComplete={mode === "ingreso" ? "current-password" : "new-password"}
        />
        {mode === "registro" && <small>Mínimo 6 caracteres.</small>}
      </div>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <button className="btn btn-primary btn-block btn-lg" disabled={busy}>
        {busy ? "Un momento…" : mode === "ingreso" ? "Ingresar" : "Crear cuenta"}
      </button>
      <p className="muted">
        {mode === "ingreso" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
        <button type="button" className="linkish" onClick={() => setMode(mode === "ingreso" ? "registro" : "ingreso")}>
          {mode === "ingreso" ? "Créala gratis" : "Ingresar"}
        </button>
      </p>
    </form>
  );
}
