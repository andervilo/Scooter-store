import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getCompany } from "@/modules/companies/service";
import { CompanyForm } from "./company-form";

export default async function SettingsPage(){
  const user=await getCurrentUser();
  if(!user) redirect("/login");
  if(user.role!=="ADMIN" || !user.companyId) redirect("/app");
  const company=await getCompany(user.companyId);
  if(!company) redirect("/app");
  return <main className="px-6 py-10"><div className="mx-auto max-w-3xl"><h1 className="text-3xl font-bold">Configurações da empresa</h1><p className="mt-2 text-slate-600">Dados da sua loja ou oficina.</p><CompanyForm initial={JSON.parse(JSON.stringify(company))}/></div></main>;
}
