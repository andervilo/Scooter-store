import { NextResponse } from "next/server";
import { AuthorizationError, requireRole } from "@/lib/permissions";
import { createEmployee,listEmployees } from "@/modules/employees/service";

async function admin(){const u=await requireRole("ADMIN");if(!u.companyId)throw new AuthorizationError();return u;}
export async function GET(){try{const u=await admin();return NextResponse.json(await listEmployees(u.companyId));}catch(e){return NextResponse.json({error:"Forbidden"},{status:e instanceof AuthorizationError?403:500});}}
export async function POST(req:Request){try{const u=await admin();return NextResponse.json(await createEmployee(u.companyId,await req.json()),{status:201});}catch(e){if(e instanceof AuthorizationError)return NextResponse.json({error:"Forbidden"},{status:403});if(e instanceof Error&&["NAME_REQUIRED","INVALID_EMAIL","INVALID_ROLE"].includes(e.message))return NextResponse.json({error:e.message},{status:400});return NextResponse.json({error:"Não foi possível cadastrar funcionário."},{status:409});}}
