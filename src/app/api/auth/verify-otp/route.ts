import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { hashOtp, normalizeEmail, otpMatches } from "@/lib/otp";

export async function POST(request: Request) {
  const {email:raw,otp}=await request.json(); const email=normalizeEmail(String(raw??"")); const code=String(otp??"");
  const result=await db.execute({sql:"SELECT id,code_hash FROM auth_otps WHERE email=? AND used_at IS NULL AND expires_at > ? ORDER BY created_at DESC LIMIT 1",args:[email,new Date().toISOString()]});
  if(!result.rows.length || !otpMatches(String(result.rows[0].code_hash),hashOtp(email,code))) return NextResponse.json({error:"Código inválido ou expirado."},{status:401});
  const user=await db.execute({sql:"SELECT id,email FROM users WHERE email=? AND active=1 LIMIT 1",args:[email]});
  if(!user.rows.length) return NextResponse.json({error:"Acesso não autorizado."},{status:401});
  await db.execute({sql:"UPDATE auth_otps SET used_at=CURRENT_TIMESTAMP WHERE id=?",args:[String(result.rows[0].id)]});
  await createSession({userId:String(user.rows[0].id),email:String(user.rows[0].email)});
  return NextResponse.json({ok:true});
}
