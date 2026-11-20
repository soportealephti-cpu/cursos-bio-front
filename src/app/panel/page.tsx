"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import UserManagement from "@/components/user-management";
import CourseManagement from "@/components/course-management";
import ExamManagement from "@/components/exam-management";
import CertificateManagement from "@/components/certificate-management";
import Dashboard from "@/components/dashboard";
import RoleCampus from "@/components/role-campus";
import { useRouter } from "next/navigation";
import { LayoutDashboard, BookOpen, Users, ClipboardList, Award, Bell, ChevronDown, LogOut, UserRound, ShieldCheck, Settings } from "lucide-react";

const api = "https://api.cursos.bioelectronsac.com";
type User = {email:string;role:string};
type Section = "inicio" | "cursos" | "estudiantes" | "evaluaciones" | "certificados" | "usuarios" | "perfil";
const labels: Record<Section,string> = {inicio:"Inicio",cursos:"Cursos",estudiantes:"Estudiantes",evaluaciones:"Evaluaciones",certificados:"Certificados",usuarios:"Gestión de usuarios",perfil:"Mi perfil"};
const roleLabels: Record<string,string> = {SA:"Superadministrador",ADMIN:"Administrador",TEACHER:"Docente",STUDENT:"Estudiante"};

export default function Panel() {
  const router=useRouter();
  const [user,setUser]=useState<User|null>(null);
  const [error,setError]=useState("");
  const [section,setSection]=useState<Section>("inicio");
  const [dropdown,setDropdown]=useState(false);
  const [notifications,setNotifications]=useState(false);
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
    function escape(e:KeyboardEvent){if(e.key==="Escape"){setDropdown(false);setNotifications(false);}}
    document.addEventListener("mousedown",outside);document.addEventListener("keydown",escape);
    return ()=>{document.removeEventListener("mousedown",outside);document.removeEventListener("keydown",escape);};
  },[]);
  async function logout(){
    setLeaving(true);
    try{const r=await fetch(api+"/api/v1/auth/logout",{method:"POST",credentials:"include"});if(!r.ok)throw Error();router.replace("/login");}
    catch{setError("No se pudo cerrar la sesión.");setLeaving(false);}
  }
  function navigate(next:Section){if(next!==section)window.scrollTo({top:0,behavior:"instant"});setSection(next);setDropdown(false);setNotifications(false);const path=next==="usuarios"?"/gestion-usuarios":next==="cursos"?"/cursos":next==="evaluaciones"?"/evaluaciones":next==="certificados"?"/certificados":next==="inicio"?"/dashboard":"/panel";if(window.location.pathname!==path)window.history.pushState(null,"",path);}
  useEffect(()=>{function sync(){setSection(window.location.pathname==="/gestion-usuarios"?"usuarios":window.location.pathname==="/cursos"?"cursos":window.location.pathname==="/evaluaciones"?"evaluaciones":window.location.pathname==="/certificados"?"certificados":"inicio");}sync();window.addEventListener("popstate",sync);return()=>window.removeEventListener("popstate",sync);},[]);
  if(!user)return <main className="grid min-h-dvh place-items-center bg-slate-50 p-6"><div className="text-center text-sm text-slate-600">{error?<><p role="alert">{error}</p><button onClick={()=>router.replace("/login")} className="mt-4 font-semibold text-emerald-700">Volver al inicio de sesión</button></>:<><div className="mx-auto mb-4 size-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"/>Verificando sesión…</>}</div></main>;
  const admin=user.role==="SA"||user.role==="ADMIN";
  const nav: {id:Section;icon:typeof LayoutDashboard}[] = [{id:"inicio",icon:LayoutDashboard},{id:"cursos",icon:BookOpen},{id:"evaluaciones",icon:ClipboardList},...((user.role==="TEACHER")?[]:[{id:"certificados" as const,icon:Award}])];
  function navLabel(id:Section){return !admin&&id==="cursos"?(user!.role==="TEACHER"?"Cursos a cargo":"Mis cursos"):!admin&&id==="certificados"?"Mis certificados":labels[id];}
  const mobileTitle=section==="inicio"?"Panel de inicio":navLabel(section);
  return (
    <div className="min-h-dvh min-w-0 bg-[#f4f7f6] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-24 shrink-0 items-center justify-center border-b border-slate-200 px-5">
          <div className="flex flex-col items-center gap-1">
            <Image src="/brand/bioelectron-dark.svg" alt="BIOELECTRON" width={210} height={48} unoptimized priority className="h-auto w-full"/>
            <span className="text-[10px] font-semibold uppercase tracking-[.24em] text-slate-500">Campus virtual</span>
          </div>
        </div>
        <nav aria-label="Módulos" className="flex-1 overflow-y-auto px-3 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">Módulos</p>
          {nav.map(({id,icon:Icon})=><button key={id} aria-current={section===id?"page":undefined} onClick={()=>navigate(id)} className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${section===id?"bg-emerald-50 font-semibold text-emerald-800":"text-slate-600 hover:bg-slate-50 hover:text-emerald-800"}`}><Icon size={19}/>{navLabel(id)}</button>)}
        </nav>
        <footer className="border-t border-slate-200 bg-slate-50 px-5 py-5"><p className="text-xs font-semibold text-emerald-800">BIOELECTRON S.A.C.</p><p className="mt-1 text-[11px] text-slate-500">Plataforma de formación</p></footer>
      </aside>
      <div className="min-w-0 lg:pl-[248px]">
        <header className="sticky top-0 z-40 flex min-h-[64px] items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 pt-[env(safe-area-inset-top,0px)] sm:px-7 lg:min-h-[66px] lg:gap-3 lg:pt-0">
          <div className="min-w-0 flex-1"><p className="truncate text-xs text-slate-500">Campus BIOELECTRON</p><p className="truncate text-sm font-bold lg:hidden" title={mobileTitle}>{mobileTitle}</p><p className="hidden truncate text-sm font-bold lg:block">Plataforma de formación</p></div>
          <div ref={menuRef} className="relative flex shrink-0 items-center gap-1.5 sm:gap-5">
            <span className="hidden items-center gap-2 text-xs text-slate-600 md:flex"><span className="size-2 rounded-full bg-emerald-600"/>Sesión activa</span>
            <button aria-label="Notificaciones" aria-expanded={notifications} onClick={()=>{setNotifications(!notifications);setDropdown(false);}} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Bell size={20}/></button>
            <button aria-label="Menú de usuario" aria-expanded={dropdown} onClick={()=>{setDropdown(!dropdown);setNotifications(false);}} className="flex items-center gap-2 rounded-full bg-slate-100 p-1.5 pr-3 hover:bg-slate-200"><span className="grid size-9 place-items-center rounded-full bg-[#008b43] text-sm font-bold text-white">{user.email.charAt(0).toUpperCase()}</span><ChevronDown size={15} className={dropdown?"rotate-180 text-slate-500":"text-slate-500"}/></button>
            {notifications&&<div className="absolute right-0 top-full mt-2 w-[min(256px,calc(100vw-24px))] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"><h2 className="text-sm font-semibold">Notificaciones</h2><p className="mt-2 text-xs text-slate-500">Módulo pendiente de habilitar.</p></div>}
            {dropdown&&<div className="absolute right-0 top-full mt-2 w-[min(310px,calc(100vw-24px))] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              <div className="border-b border-slate-100 px-3 py-3"><p className="break-all text-sm font-bold">{user.email}</p><p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-emerald-700">{roleLabels[user.role]||user.role}</p></div>
              <div className="py-2"><button onClick={()=>navigate("perfil")} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-slate-700 hover:bg-slate-50"><UserRound size={18} className="text-emerald-700"/>Mi perfil</button>{admin&&<button onClick={()=>navigate("usuarios")} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-slate-700 hover:bg-slate-50"><Users size={18} className="text-emerald-700"/>Gestión de usuarios</button>}</div>
              <div className="border-t border-slate-100 pt-1"><button disabled={leaving} onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"><LogOut size={18}/>{leaving?"Cerrando sesión…":"Cerrar sesión"}</button></div>
            </div>}
          </div>
        </header>
        <main className="campus-content w-full min-w-0 px-3 pt-5 pb-[calc(92px+env(safe-area-inset-bottom,0px))] sm:px-6 sm:pt-7 lg:px-8 lg:py-8">
          {error&&<p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <div className="mb-5 lg:mb-7"><p className="mb-2 text-[11px] font-bold uppercase tracking-[.18em] text-emerald-700">{admin?"Gestión académica":user.role==="TEACHER"?"Área docente":"Mi aprendizaje"}</p><h1 className="break-words text-2xl font-bold tracking-tight sm:text-3xl">{section==="inicio"?"Panel de inicio":labels[section]}</h1><p className="mt-2 text-sm text-slate-500">{section==="inicio"?"Bienvenido a la plataforma de formación BIOELECTRON.":section==="perfil"?"Información de tu cuenta.":"Área de gestión del campus virtual."}</p></div>
          {section==="inicio"&&admin?<Dashboard email={user.email} role={user.role} navigate={navigate}/>:!admin&&(user.role==="TEACHER"||user.role==="STUDENT")&&(section==="inicio"||section==="cursos"||section==="evaluaciones"||(section==="certificados"&&user.role==="STUDENT"))?<RoleCampus email={user.email} role={user.role} section={section} navigate={navigate}/>:section==="certificados"&&admin?<CertificateManagement/>:section==="evaluaciones"&&admin?<ExamManagement/>:section==="cursos"&&admin?<CourseManagement/>:section==="usuarios"&&admin?<UserManagement role={user.role} email={user.email}/>:section==="perfil"?<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-5 flex items-center gap-3"><span className="grid size-12 place-items-center rounded-full bg-emerald-50 text-emerald-700"><UserRound size={24}/></span><div><h2 className="font-bold">Mi cuenta</h2><p className="text-xs text-slate-500">Datos de sesión</p></div></div><dl className="grid gap-5 sm:grid-cols-2"><div><dt className="text-xs font-medium text-slate-500">Correo electrónico</dt><dd className="mt-1 break-all text-sm font-semibold">{user.email}</dd></div><div><dt className="text-xs font-medium text-slate-500">Rol</dt><dd className="mt-1 flex items-center gap-2 text-sm font-semibold"><ShieldCheck size={17} className="text-emerald-700"/>{roleLabels[user.role]||user.role}</dd></div></dl></section>:<section className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm"><Settings size={32} className="mx-auto mb-4 text-emerald-700"/><h2 className="font-bold">{labels[section]}</h2><p className="mt-2 text-sm text-slate-500">Este módulo está preparado en la navegación. Su funcionalidad se implementará en la siguiente etapa.</p></section>}
        </main>
      </div>
      <nav aria-label="Navegación inferior" className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white px-2 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_20px_rgba(15,23,42,.07)] lg:hidden print:hidden">
        <div className="mx-auto flex min-h-[68px] w-full max-w-2xl items-stretch gap-1 py-1">
          {nav.map(({id,icon:Icon})=>{
            const active=section===id;
            return <button key={id} type="button" aria-current={active?"page":undefined} aria-label={navLabel(id)} onClick={()=>navigate(id)} className={`flex min-h-[60px] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-0.5 py-2 text-center text-[10px] leading-tight transition-colors focus-visible:outline-2 focus-visible:outline-emerald-600 sm:text-xs ${active?"bg-emerald-50 font-bold text-[#007a50]":"font-medium text-slate-500 hover:bg-slate-50 hover:text-emerald-800"}`}><Icon size={22} strokeWidth={active?2.3:1.8} aria-hidden="true"/><span>{labels[id]}</span></button>;
          })}
        </div>
      </nav>
    </div>
  );
}
