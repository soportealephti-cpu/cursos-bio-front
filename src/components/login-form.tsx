"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, LockKeyhole, Eye, EyeOff, ShieldCheck, GraduationCap, Clock3, ArrowRight, Info } from "lucide-react";

const features = [
  { icon: ShieldCheck, label: "Acceso seguro" },
  { icon: GraduationCap, label: "Cursos certificados" },
  { icon: Clock3, label: "Disponible 24/7" },
];

export default function LoginForm() {
  const [visible, setVisible] = useState(false);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setNotice(""); setLoading(true);
    try {
      const response = await fetch("https://api.cursos.bioelectronsac.com" + "/api/v1/auth/login", {
        method: "POST", credentials: "include", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({correo: data.get("correo"), password: data.get("password")})
      });
      if (!response.ok) { setNotice(response.status === 401 ? "Correo o contraseña incorrectos." : "No se pudo iniciar sesión."); return; }
      router.replace("/panel");
    } catch { setNotice("No se pudo conectar con el servidor."); }
    finally { setLoading(false); }
  }

  return (
    <main className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-[#092e40] text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-cover bg-center" style={{backgroundImage: "linear-gradient(to bottom, rgba(22,163,74,.80), rgba(37,99,235,.80)), url('https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1950&q=80')"}}/>
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:48px_48px]"/>
      <div className="flex flex-1 items-center justify-center px-5 py-10 sm:py-16">
        <div className="w-full max-w-[460px]">
          <header className="mb-7 flex flex-col items-center text-center">
            <Image src="/brand/bioelectron.svg" width={340} height={78} priority unoptimized alt="BIOELECTRON" className="h-auto w-[280px] sm:w-[340px]"/>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-100">Campus virtual</p>
          </header>
          <section className="rounded-[24px] border border-white/70 bg-white p-7 text-slate-900 shadow-[0_24px_80px_rgba(0,0,0,0.30)] sm:p-9" aria-labelledby="login-title">
            <div className="mb-8 text-center">
              <h1 id="login-title" className="text-3xl font-bold tracking-tight">¡Bienvenido!</h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">Ingresa a tu cuenta para acceder a los cursos.</p>
            </div>
            <form onSubmit={submit} onChange={() => setNotice("")} className="space-y-5">
              <div>
                <label htmlFor="correo" className="mb-2 block text-sm font-semibold text-slate-700">Correo electrónico</label>
                <div className="relative">
                  <Mail aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400"/>
                  <input id="correo" name="correo" type="email" autoComplete="username" required placeholder="ejemplo@correo.com" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100"/>
                </div>
              </div>
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">Contraseña</label>
                <div className="relative">
                  <LockKeyhole aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400"/>
                  <input id="password" name="password" type={visible ? "text" : "password"} autoComplete="current-password" required placeholder="••••••••" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-sm outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100"/>
                  <button type="button" aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"} aria-pressed={visible} onClick={() => setVisible(!visible)} className="absolute right-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-emerald-600">
                    {visible ? <EyeOff size={19}/> : <Eye size={19}/>}
                  </button>
                </div>
              </div>
              {notice && <div role="status" className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"><Info className="mt-0.5 size-4 shrink-0"/>{notice}</div>}
              <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#008b43] text-sm font-semibold text-white shadow-sm transition hover:bg-[#007438] focus-visible:ring-4 focus-visible:ring-emerald-200">
                {loading ? "Ingresando..." : "Iniciar sesión"} <ArrowRight size={18} aria-hidden="true"/>
              </button>
            </form>
            <a href="/recuperar" className="mt-4 block text-center text-sm font-semibold text-emerald-700 hover:underline">¿Olvidaste tu contraseña?</a>
            <div className="mt-7 grid grid-cols-3 gap-2 border-t border-slate-100 pt-6">
              {features.map(({icon: Icon,label}) => <div key={label} className="flex flex-col items-center gap-2 text-center"><span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Icon size={20} aria-hidden="true"/></span><span className="text-xs font-medium leading-tight text-slate-600">{label}</span></div>)}
            </div>
          </section>
        </div>
      </div>
      <footer className="px-5 pb-7 text-center text-xs leading-relaxed text-white/75">© {new Date().getFullYear()} BIOELECTRON S.A.C. <span className="hidden sm:inline">· </span><span className="block sm:inline">Todos los derechos reservados.</span></footer>
    </main>
  );
}
