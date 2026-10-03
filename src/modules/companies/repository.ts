import { db } from "@/lib/db";

export type CompanyInput = {
  name: string; tradeName?: string; cnpj?: string; email?: string;
  phone?: string; whatsapp?: string; address?: string;
};

export async function findCompanyById(id: string) {
  const result = await db.execute({
    sql: "SELECT id,name,trade_name,cnpj,email,phone,whatsapp,address,active,created_at,updated_at FROM companies WHERE id=? LIMIT 1",
    args: [id],
  });
  return result.rows[0] ?? null;
}

export async function updateCompany(id: string, input: CompanyInput) {
  await db.execute({
    sql: `UPDATE companies SET name=?,trade_name=?,cnpj=?,email=?,phone=?,whatsapp=?,address=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`,
    args: [input.name,input.tradeName||null,input.cnpj||null,input.email||null,input.phone||null,input.whatsapp||null,input.address||null,id],
  });
  return findCompanyById(id);
}
