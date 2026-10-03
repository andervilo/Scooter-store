import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
export default async function AppHome(){const session=await getSession();if(!session)redirect("/login");return <main className="p-6"><div className="mx-auto max-w-5xl"><h1 className="text-3xl font-bold">Scooter Store</h1><p className="mt-2 text-slate-600">Sessão autenticada: {session.email}</p></div></main>}
