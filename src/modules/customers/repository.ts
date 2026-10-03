import { db } from "@/lib/db";
import { newId } from "@/lib/ids";
export type CustomerInput={name:string;cpf?:string;phone?:string;whatsapp?:string;email?:string;notes?:string};

export async function listCustomers(companyId:string,query:string,page:number,size:number){
 const q=`%${query}%`;const offset=(page-1)*size;
 const where=query?" AND (name LIKE ? OR cpf LIKE ? OR phone LIKE ? OR whatsapp LIKE ? OR email LIKE ?)":"";
 const args:unknown[]=[companyId];if(query)args.push(q,q,q,q,q);
 const rows=await db.execute({sql:`SELECT id,name,cpf,phone,whatsapp,email,active,created_at,updated_at FROM customers WHERE company_id=?${where} ORDER BY name LIMIT ? OFFSET ?`,args:[...args,size,offset]});
 const count=await db.execute({sql:`SELECT COUNT(*) total FROM customers WHERE company_id=?${where}`,args});
 return {items:rows.rows,total:Number(count.rows[0]?.total??0),page,size};
}
export async function findCustomer(companyId:string,id:string){const r=await db.execute({sql:"SELECT id,name,cpf,phone,whatsapp,email,notes,active,created_at,updated_at FROM customers WHERE id=? AND company_id=? LIMIT 1",args:[id,companyId]});return r.rows[0]??null;}
export async function createCustomer(companyId:string,input:CustomerInput){const id=newId();await db.execute({sql:"INSERT INTO customers(id,company_id,name,cpf,phone,whatsapp,email,notes) VALUES (?,?,?,?,?,?,?,?)",args:[id,companyId,input.name,input.cpf||null,input.phone||null,input.whatsapp||null,input.email||null,input.notes||null]});return findCustomer(companyId,id);}
export async function updateCustomer(companyId:string,id:string,input:CustomerInput){await db.execute({sql:"UPDATE customers SET name=?,cpf=?,phone=?,whatsapp=?,email=?,notes=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND company_id=?",args:[input.name,input.cpf||null,input.phone||null,input.whatsapp||null,input.email||null,input.notes||null,id,companyId]});return findCustomer(companyId,id);}
export async function setCustomerActive(companyId:string,id:string,active:boolean){await db.execute({sql:"UPDATE customers SET active=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND company_id=?",args:[active?1:0,id,companyId]});return findCustomer(companyId,id);}
