import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateOtp, hashOtp, normalizeEmail, validEmail } from "@/lib/otp";
import { sendOtp } from "@/lib/email";

export async function POST(request: Request) {
  const { email: raw } = await request.json(); const email=normalizeEmail(String(raw ?? ""));
  if (!validEmail(email)) return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
  const user=await db.execute({sql:"SELECT id FROM users WHERE email = ? AND active = 1 LIMIT 1",args:[email]});
  if (!user.rows.length) return NextResponse.json({ ok: true });
  const otp=generateOtp(); const expires=new Date(Date.now()+10*60*1000).toISOString();
  await db.execute({sql:"INSERT INTO auth_otps(id,email,code_hash,expires_at) VALUES (?,?,?,?)",args:[crypto.randomUUID(),email,hashOtp(email,otp),expires]});
  await sendOtp(email,otp);
  return NextResponse.json({ ok: true });
}
