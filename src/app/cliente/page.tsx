import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function CustomerHome() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "CUSTOMER" || !user.customerId) redirect("/app");
  return <main className="p-6"><div className="mx-auto max-w-5xl"><h1 className="text-3xl font-bold">Portal do Cliente</h1><p className="mt-2 text-slate-600">Bem-vindo, {user.email}.</p></div></main>;
}
