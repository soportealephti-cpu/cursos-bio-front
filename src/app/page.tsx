import { BookOpen, GraduationCap, LayoutDashboard } from "lucide-react";
export default function Home() {
 return <main className="min-h-screen px-6 py-12"><div className="mx-auto max-w-5xl">
 <div className="mb-12 flex items-center gap-3"><GraduationCap size={36} className="text-blue-700"/><div><h1 className="text-3xl font-bold">Cursos Bio</h1><p className="text-slate-500">Plataforma de formación</p></div></div>
 <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"><h2 className="text-2xl font-semibold">Bienvenido a Cursos Bio</h2><p className="mt-3 text-slate-600">Proyecto base listo para comenzar el desarrollo del aula virtual.</p>
 <div className="mt-8 grid gap-4 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-5"><BookOpen className="mb-3 text-blue-700"/><h3 className="font-semibold">Cursos</h3><p className="mt-1 text-sm text-slate-600">Catálogo y materiales de aprendizaje (próximamente).</p></div>
 <div className="rounded-xl bg-slate-50 p-5"><LayoutDashboard className="mb-3 text-blue-700"/><h3 className="font-semibold">Panel</h3><p className="mt-1 text-sm text-slate-600">Administración académica (próximamente).</p></div></div></section></div></main>;
}
