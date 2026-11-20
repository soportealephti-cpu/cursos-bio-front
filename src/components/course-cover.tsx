"use client";
import {useState} from "react";
import {BookOpen} from "lucide-react";
export default function CourseCover({id,title,hasCover,version=0,large=false}:{id:number;title:string;hasCover:boolean;version?:number;large?:boolean}){
 const url="https://api.cursos.bioelectronsac.com/api/v1/courses/"+id+"/cover?v="+version;
 const [failed,setFailed]=useState("");
 return <div className={"relative flex w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#123b39] to-[#087a61] "+(large?"aspect-[16/9] rounded-xl sm:aspect-[2/1]":"aspect-[16/9]")}>
 {hasCover&&failed!==url?<img src={url} alt={"Portada de "+title} className="absolute inset-0 size-full object-contain" loading={large?"eager":"lazy"} onError={()=>setFailed(url)}/>:<div className="flex flex-col items-center gap-2 text-emerald-100"><BookOpen size={large?54:38} strokeWidth={1.3}/><span className="text-xs font-medium">{hasCover?"Portada no disponible":"Sin portada"}</span></div>}
 </div>;
}
