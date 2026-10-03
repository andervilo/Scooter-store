import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { listEmployees } from "@/modules/employees/service";
import { EmployeeManager } from "./employee-manager";

export default async function EmployeesPage(){
 const user=await getCurrentUser();if(!user)redirect("/login");if(user.role!=="ADMIN"||!user.companyId)redirect("/app");
 const employees=await listEmployees(user.companyId);
 return <main className="px-6 py-10"><div className="mx-auto max-w-4xl"><h1 className="text-3xl font-bold">Funcionários</h1><p className="mt-2 text-slate-600">Gerencie quem pode acessar a empresa.</p><EmployeeManager initial={JSON.parse(JSON.stringify(employees))}/></div></main>;
}
