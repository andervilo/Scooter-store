import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function AppHome() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "CUSTOMER") redirect("/cliente");
  if (!user.companyId) redirect("/login");
  return <main className="p-6"><div className="mx-auto max-w-5xl"><h1 className="text-3xl font-bold">Scooter Store</h1><p className="mt-2 text-slate-600">Empresa: {user.companyId}</p><p className="text-slate-600">Perfil: {user.role}</p></div></main>;
}
