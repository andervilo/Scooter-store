import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const COOKIE = "scooter_session";
const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET ?? "dev-only-change-me");

export type Session = { userId: string; email: string };

export async function createSession(session: Session) {
  const token = await new SignJWT(session).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret());
  const store = await cookies();
  store.set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try { const { payload } = await jwtVerify(token, secret()); return { userId: String(payload.userId), email: String(payload.email) }; } catch { return null; }
}

export async function clearSession() { (await cookies()).delete(COOKIE); }
