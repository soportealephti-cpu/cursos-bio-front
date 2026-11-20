"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ShieldCheck } from "lucide-react";
const api = "https://api.cursos.bioelectronsac.com";
export default function Panel() {
 const router=useRouter();
 const [user,setUser]=useState<{email:string;role:string}|null>(null);
 const [error,setError]=useState("");
 useEffect(()=>{fetch(api+"/api/v1/auth/me",{credentials:"include",cache:"no-store"}).then(async r=>{if(r.status===401){router.replace("/login");return;}if(!r.ok)throw Error();setUser(await r.json());}).catch(()=>setError("No se pudo verificar la sesión."));},[router]);
 async function logout(){try{const r=await fetch(api+"/api/v1/auth/logout",{method:"POST",credentials:"include"});if(!r.ok)throw Error();router.replace("/login");}catch{setError("No se pudo cerrar la sesión.");}}
 return <main className="mx-auto max-w-5xl p-8">{error && <p role="alert">{error}</p>}{user ? <section className="rounded-2xl border border-slate-200 bg-white p-8"><ShieldCheck className="mb-4 text-emerald-700"/><h1 className="text-2xl font-bold">Campus virtual</h1><p className="mt-2">{user.email} · {user.role}</p><button onClick={logout} className="mt-6 flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 text-white"><LogOut size={18}/> Cerrar sesión</button></section>:!error && <p>Verificando sesión…</p>}</main>;
}
