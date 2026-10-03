import { db } from "@/lib/db";
import { newId } from "@/lib/ids";

export type EmployeeInput={name:string;email:string;role:"ADMIN"|"EMPLOYEE"};

export async function listEmployees(companyId:string){
 const r=await db.execute({sql:"SELECT id,name,email,role,active,created_at,updated_at FROM users WHERE company_id=? AND role IN ('ADMIN','EMPLOYEE') ORDER BY name",args:[companyId]});
 return r.rows;
}
export async function createEmployee(companyId:string,input:EmployeeInput){
 const id=newId();
 await db.execute({sql:"INSERT INTO users(id,company_id,name,email,role,active) VALUES (?,?,?,?,?,1)",args:[id,companyId,input.name,input.email,input.role]});
 return findEmployee(companyId,id);
}
export async function findEmployee(companyId:string,id:string){
 const r=await db.execute({sql:"SELECT id,name,email,role,active,created_at,updated_at FROM users WHERE id=? AND company_id=? AND role IN ('ADMIN','EMPLOYEE') LIMIT 1",args:[id,companyId]});
 return r.rows[0]??null;
}
export async function updateEmployee(companyId:string,id:string,input:EmployeeInput){
 await db.execute({sql:"UPDATE users SET name=?,email=?,role=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND company_id=? AND role IN ('ADMIN','EMPLOYEE')",args:[input.name,input.email,input.role,id,companyId]});
 return findEmployee(companyId,id);
}
export async function setEmployeeActive(companyId:string,id:string,active:boolean){
 await db.execute({sql:"UPDATE users SET active=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND company_id=? AND role IN ('ADMIN','EMPLOYEE')",args:[active?1:0,id,companyId]});
 return findEmployee(companyId,id);
}
