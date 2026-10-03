import { NextResponse } from "next/server";
import { AuthorizationError, requireCompany, requireRole } from "@/lib/permissions";
import { editCompany, getCompany } from "@/modules/companies/service";

export async function GET(){
  try {
    const user=await requireCompany();
    const company=await getCompany(user.companyId);
    return company?NextResponse.json(company):NextResponse.json({error:"Empresa não encontrada."},{status:404});
  } catch(error) {
    return NextResponse.json({error:"Unauthorized"},{status:error instanceof AuthorizationError?403:500});
  }
}

export async function PUT(request:Request){
  try {
    const user=await requireRole("ADMIN");
    if(!user.companyId) return NextResponse.json({error:"Forbidden"},{status:403});
    const company=await editCompany(user.companyId,await request.json());
    return NextResponse.json(company);
  } catch(error) {
    if(error instanceof AuthorizationError) return NextResponse.json({error:"Forbidden"},{status:403});
    if(error instanceof Error && ["COMPANY_NAME_REQUIRED","INVALID_EMAIL"].includes(error.message)) return NextResponse.json({error:error.message},{status:400});
    return NextResponse.json({error:"Erro ao atualizar empresa."},{status:500});
  }
}
