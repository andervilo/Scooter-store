"use client";
import { FormEvent, useState } from "react";

type Company={name:string;trade_name?:string|null;cnpj?:string|null;email?:string|null;phone?:string|null;whatsapp?:string|null;address?:string|null};
export function CompanyForm({initial}:{initial:Company}){
 const [form,setForm]=useState({name:initial.name,tradeName:initial.trade_name??"",cnpj:initial.cnpj??"",email:initial.email??"",phone:initial.phone??"",whatsapp:initial.whatsapp??"",address:initial.address??""});
 const [message,setMessage]=useState("");
 const set=(key:keyof typeof form)=>(e:React.ChangeEvent<HTMLInputElement>)=>setForm({...form,[key]:e.target.value});
 async function submit(e:FormEvent){e.preventDefault();setMessage("Salvando...");const r=await fetch("/api/company",{method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify(form)});setMessage(r.ok?"Dados atualizados.":"Não foi possível atualizar.");}
 const fields:[keyof typeof form,string,string][]=[["name","Razão social","text"],["tradeName","Nome fantasia","text"],["cnpj","CNPJ","text"],["email","E-mail","email"],["phone","Telefone","text"],["whatsapp","WhatsApp","text"],["address","Endereço","text"]];
 return <form onSubmit={submit} className="mt-8 grid gap-4 rounded-2xl bg-white p-6 shadow-sm">{fields.map(([key,label,type])=><label key={key} className="grid gap-1 text-sm font-medium">{label}<input type={type} required={key==="name"} value={form[key]} onChange={set(key)} className="rounded-lg border border-slate-300 p-3 font-normal"/></label>)}<div className="flex items-center gap-4"><button className="rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white">Salvar alterações</button>{message&&<span className="text-sm text-slate-600">{message}</span>}</div></form>;
}
