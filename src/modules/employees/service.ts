import * as repo from "@/modules/employees/repository";
export type EmployeeInput={name:string;email:string;role:"ADMIN"|"EMPLOYEE"};

function normalize(input:EmployeeInput):EmployeeInput{
 const name=input.name?.trim();const email=input.email?.trim().toLowerCase();
 if(!name)throw new Error("NAME_REQUIRED");
 if(!/^\S+@\S+\.\S+$/.test(email))throw new Error("INVALID_EMAIL");
 if(!["ADMIN","EMPLOYEE"].includes(input.role))throw new Error("INVALID_ROLE");
 return {name,email,role:input.role};
}
export const listEmployees=repo.listEmployees;
export const findEmployee=repo.findEmployee;
export const createEmployee=(companyId:string,input:EmployeeInput)=>repo.createEmployee(companyId,normalize(input));
export const updateEmployee=(companyId:string,id:string,input:EmployeeInput)=>repo.updateEmployee(companyId,id,normalize(input));
export const setEmployeeActive=repo.setEmployeeActive;
