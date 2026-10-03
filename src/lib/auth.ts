import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { db } from "@/lib/db";

const COOKIE = "scooter_session";
const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-only-change-me");

export type Role = "ADMIN" | "EMPLOYEE" | "CUSTOMER";
export type Session = { userId: string; email: string };

export type CurrentUser = {
  id: string;
  email: string;
  role: Role;
  companyId: string | null;
  customerId: string | null;
};

export async function createSession(session: Session) {
  const token = await new SignJWT(session).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret());
  const store = await cookies();
  store.set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return { userId: String(payload.userId), email: String(payload.email) };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getSession();
  if (!session) return null;
  const result = await db.execute({
    sql: "SELECT id,email,role,company_id,customer_id FROM users WHERE id=? AND email=? AND active=1 LIMIT 1",
    args: [session.userId, session.email],
  });
  if (!result.rows.length) return null;
  const row = result.rows[0];
  return {
    id: String(row.id),
    email: String(row.email),
    role: String(row.role) as Role,
    companyId: row.company_id ? String(row.company_id) : null,
    customerId: row.customer_id ? String(row.customer_id) : null,
  };
}

export async function clearSession() { (await cookies()).delete(COOKIE); }
