"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LayoutDashboard, BookOpen, Users, GraduationCap, ClipboardList, Award, Bell, ChevronDown, LogOut, UserRound, Menu, X, ShieldCheck, Settings, BookOpenCheck, ArrowRight } from "lucide-react";

const api = "https://api.cursos.bioelectronsac.com";
type User = {email:string;role:string};
type Section = "inicio" | "cursos" | "estudiantes" | "evaluaciones" | "certificados" | "usuarios" | "perfil";
const labels: Record<Section,string> = {inicio:"Inicio",cursos:"Cursos",estudiantes:"Estudiantes",evaluaciones:"Evaluaciones",certificados:"Certificados",usuarios:"Gestión de usuarios",perfil:"Mi perfil"};
const roleLabels: Record<string,string> = {SA:"Superadministrador",ADMIN:"Administrador",STUDENT:"Estudiante"};

export default function Panel() {
  const router=useRouter();
  const [user,setUser]=useState<User|null>(null);
  const [error,setError]=useState("");
  const [section,setSection]=useState<Section>("inicio");
  const [dropdown,setDropdown]=useState(false);
  const [notifications,setNotifications]=useState(false);
  const [mobile,setMobile]=useState(false);
  const [leaving,setLeaving]=useState(false);
  const menuRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const controller=new AbortController();
    fetch(api+"/api/v1/auth/me",{credentials:"include",cache:"no-store",signal:controller.signal}).then(async r=>{
      if(r.status===401){router.replace("/login");return;}
      if(!r.ok)throw Error();
      setUser(await r.json());
    }).catch(e=>{if(e.name!=="AbortError")setError("No se pudo verificar la sesión.");});
    return ()=>controller.abort();
  },[router]);
  useEffect(()=>{
    function outside(e:MouseEvent){if(menuRef.current&&!menuRef.current.contains(e.target as Node)){setDropdown(false);setNotifications(false);}}
    function escape(e:KeyboardEvent){if(e.key==="Escape"){setDropdown(false);setNotifications(false);setMobile(false);}}
    document.addEventListener("mousedown",outside);document.addEventListener("keydown",escape);
    return ()=>{document.removeEventListener("mousedown",outside);document.removeEventListener("keydown",escape);};
  },[]);
  async function logout(){
    setLeaving(true);
    try{const r=await fetch(api+"/api/v1/auth/logout",{method:"POST",credentials:"include"});if(!r.ok)throw Error();router.replace("/login");}
    catch{setError("No se pudo cerrar la sesión.");setLeaving(false);}
  }
  function navigate(next:Section){setSection(next);setDropdown(false);setMobile(false);}
  if(!user)return <main className="grid min-h-dvh place-items-center bg-slate-50 p-6"><div className="text-center text-sm text-slate-600">{error?<><p role="alert">{error}</p><button onClick={()=>router.replace("/login")} className="mt-4 font-semibold text-emerald-700">Volver al inicio de sesión</button></>:<><div className="mx-auto mb-4 size-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"/>Verificando sesión…</>}</div></main>;
  const admin=user.role==="SA"||user.role==="ADMIN";
  const nav: {id:Section;icon:typeof LayoutDashboard}[] = [{id:"inicio",icon:LayoutDashboard},{id:"cursos",icon:BookOpen},...(admin?[{id:"estudiantes" as const,icon:Users}]:[]),{id:"evaluaciones",icon:ClipboardList},{id:"certificados",icon:Award}];
  const cards = [{id:"cursos" as const,title:admin?"Cursos":"Mis cursos",icon:BookOpen},{id:"estudiantes" as const,title:"Estudiantes",icon:GraduationCap},{id:"evaluaciones" as const,title:"Evaluaciones",icon:ClipboardList},{id:"certificados" as const,title:"Certificados",icon:Award}].filter(c=>admin||c.id!=="estudiantes");
  return (
    <div className="min-h-dvh bg-[#f4f7f6] text-slate-900">
      {mobile&&<button aria-label="Cerrar menú lateral" onClick={()=>setMobile(false)} className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"/>}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col border-r border-slate-200 bg-white transition-transform lg:translate-x-0 ${mobile?"translate-x-0":"-translate-x-full"}`}>
        <div className="flex h-24 shrink-0 items-center justify-center border-b border-slate-200 px-5">
          <div className="flex flex-col items-center gap-1">
            <Image src="/brand/bioelectron-dark.svg" alt="BIOELECTRON" width={210} height={48} unoptimized priority className="h-auto w-full"/>
            <span className="text-[10px] font-semibold uppercase tracking-[.24em] text-slate-500">Campus virtual</span>
          </div>
          <button onClick={()=>setMobile(false)} aria-label="Cerrar menú" className="absolute right-1 top-1 rounded p-1 text-slate-500 lg:hidden"><X size={18}/></button>
        </div>
        <nav aria-label="Módulos" className="flex-1 overflow-y-auto px-3 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">Módulos</p>
          {nav.map(({id,icon:Icon})=><button key={id} aria-current={section===id?"page":undefined} onClick={()=>navigate(id)} className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${section===id?"bg-emerald-50 font-semibold text-emerald-800":"text-slate-600 hover:bg-slate-50 hover:text-emerald-800"}`}><Icon size={19}/>{labels[id]}</button>)}
        </nav>
        <footer className="border-t border-slate-200 bg-slate-50 px-5 py-5"><p className="text-xs font-semibold text-emerald-800">BIOELECTRON S.A.C.</p><p className="mt-1 text-[11px] text-slate-500">Plataforma de formación</p></footer>
      </aside>
      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-20 flex min-h-[66px] items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:px-7">
          <div className="flex min-w-0 items-center gap-3"><button aria-label="Abrir menú" onClick={()=>setMobile(true)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"><Menu size={23}/></button><div className="min-w-0"><p className="text-xs text-slate-500">Campus BIOELECTRON</p><p className="truncate text-sm font-bold">Plataforma de formación</p></div></div>
          <div ref={menuRef} className="relative flex shrink-0 items-center gap-3 sm:gap-5">
            <span className="hidden items-center gap-2 text-xs text-slate-600 md:flex"><span className="size-2 rounded-full bg-emerald-600"/>Sesión activa</span>
            <button aria-label="Notificaciones" aria-expanded={notifications} onClick={()=>{setNotifications(!notifications);setDropdown(false);}} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Bell size={20}/></button>
            <button aria-label="Menú de usuario" aria-expanded={dropdown} onClick={()=>{setDropdown(!dropdown);setNotifications(false);}} className="flex items-center gap-2 rounded-full bg-slate-100 p-1.5 pr-3 hover:bg-slate-200"><span className="grid size-9 place-items-center rounded-full bg-[#008b43] text-sm font-bold text-white">{user.email.charAt(0).toUpperCase()}</span><ChevronDown size={15} className={dropdown?"rotate-180 text-slate-500":"text-slate-500"}/></button>
            {notifications&&<div className="absolute right-0 top-[54px] w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"><h2 className="text-sm font-semibold">Notificaciones</h2><p className="mt-2 text-xs text-slate-500">Módulo pendiente de habilitar.</p></div>}
            {dropdown&&<div className="absolute right-0 top-[54px] w-[min(310px,85vw)] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              <div className="border-b border-slate-100 px-3 py-3"><p className="break-all text-sm font-bold">{user.email}</p><p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-emerald-700">{roleLabels[user.role]||user.role}</p></div>
              <div className="py-2"><button onClick={()=>navigate("perfil")} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-slate-700 hover:bg-slate-50"><UserRound size={18} className="text-emerald-700"/>Mi perfil</button>{admin&&<button onClick={()=>navigate("usuarios")} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-slate-700 hover:bg-slate-50"><Users size={18} className="text-emerald-700"/>Gestión de usuarios</button>}</div>
              <div className="border-t border-slate-100 pt-1"><button disabled={leaving} onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"><LogOut size={18}/>{leaving?"Cerrando sesión…":"Cerrar sesión"}</button></div>
            </div>}
          </div>
        </header>
        <main className="w-full px-4 py-7 sm:px-8 sm:py-8">
          {error&&<p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <div className="mb-7"><p className="mb-2 text-[11px] font-bold uppercase tracking-[.18em] text-emerald-700">Gestión académica</p><h1 className="text-3xl font-bold tracking-tight">{section==="inicio"?"Panel de inicio":labels[section]}</h1><p className="mt-2 text-sm text-slate-500">{section==="inicio"?"Bienvenido a la plataforma de formación BIOELECTRON.":section==="perfil"?"Información de tu cuenta.":"Área de gestión del campus virtual."}</p></div>
          {section==="inicio"?<>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {cards.map(({id,title,icon:Icon})=><button key={id} onClick={()=>navigate(id)} className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-emerald-300 hover:shadow-md"><div className="flex items-center justify-between gap-2"><span className="text-sm font-medium text-slate-600">{title}</span><span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Icon size={21}/></span></div><p className="mt-3 text-lg font-semibold">Ver módulo</p><p className="mt-1 flex items-center gap-2 text-xs text-emerald-700">Acceder <ArrowRight size={13}/></p></button>)}
            </div>
            <section className="mt-7 rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 p-6"><h2 className="font-bold">Resumen del campus</h2><p className="mt-1 text-sm text-slate-500">Accesos y herramientas de la plataforma.</p></div><div className="flex flex-col items-center gap-3 px-6 py-12 text-center"><span className="grid size-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><BookOpenCheck size={27}/></span><h3 className="font-semibold">Tu espacio de formación</h3><p className="max-w-md text-sm text-slate-500">Los módulos académicos se habilitarán progresivamente. Tu sesión está activa.</p></div></section>
          </>:section==="perfil"?<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-5 flex items-center gap-3"><span className="grid size-12 place-items-center rounded-full bg-emerald-50 text-emerald-700"><UserRound size={24}/></span><div><h2 className="font-bold">Mi cuenta</h2><p className="text-xs text-slate-500">Datos de sesión</p></div></div><dl className="grid gap-5 sm:grid-cols-2"><div><dt className="text-xs font-medium text-slate-500">Correo electrónico</dt><dd className="mt-1 break-all text-sm font-semibold">{user.email}</dd></div><div><dt className="text-xs font-medium text-slate-500">Rol</dt><dd className="mt-1 flex items-center gap-2 text-sm font-semibold"><ShieldCheck size={17} className="text-emerald-700"/>{roleLabels[user.role]||user.role}</dd></div></dl></section>:<section className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm"><Settings size={32} className="mx-auto mb-4 text-emerald-700"/><h2 className="font-bold">{labels[section]}</h2><p className="mt-2 text-sm text-slate-500">Este módulo está preparado en la navegación. Su funcionalidad se implementará en la siguiente etapa.</p></section>}
        </main>
      </div>
    </div>
  );
}
