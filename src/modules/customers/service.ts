import * as repo from "@/modules/customers/repository";
import type { CustomerInput } from "@/modules/customers/repository";
const clean=(v?:string)=>v?.trim()||undefined;
function normalize(i:CustomerInput):CustomerInput{const name=clean(i.name);if(!name)throw new Error("NAME_REQUIRED");const email=clean(i.email)?.toLowerCase();if(email&&!/^\S+@\S+\.\S+$/.test(email))throw new Error("INVALID_EMAIL");return{name,cpf:clean(i.cpf),phone:clean(i.phone),whatsapp:clean(i.whatsapp),email,notes:clean(i.notes)};}
export const findCustomer=repo.findCustomer;export const setCustomerActive=repo.setCustomerActive;
export const listCustomers=(companyId:string,q="",page=1,size=20)=>repo.listCustomers(companyId,q.trim(),Math.max(1,page),Math.min(100,Math.max(1,size)));
export const createCustomer=(companyId:string,i:CustomerInput)=>repo.createCustomer(companyId,normalize(i));
export const updateCustomer=(companyId:string,id:string,i:CustomerInput)=>repo.updateCustomer(companyId,id,normalize(i));
