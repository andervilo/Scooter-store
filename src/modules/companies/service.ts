import { findCompanyById, updateCompany, type CompanyInput } from "@/modules/companies/repository";

const clean = (value?: string) => value?.trim() || undefined;

export async function getCompany(companyId: string) {
  return findCompanyById(companyId);
}

export async function editCompany(companyId: string, input: CompanyInput) {
  const name=clean(input.name);
  if(!name) throw new Error("COMPANY_NAME_REQUIRED");
  if(input.email && !/^\S+@\S+\.\S+$/.test(input.email.trim())) throw new Error("INVALID_EMAIL");
  return updateCompany(companyId,{
    name,
    tradeName:clean(input.tradeName),
    cnpj:clean(input.cnpj),
    email:clean(input.email)?.toLowerCase(),
    phone:clean(input.phone),
    whatsapp:clean(input.whatsapp),
    address:clean(input.address),
  });
}
