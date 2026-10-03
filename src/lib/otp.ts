import { createHash, randomInt, timingSafeEqual } from "node:crypto";

export const normalizeEmail = (email: string) => email.trim().toLowerCase();
export const validEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);
export const generateOtp = () => randomInt(100000, 1000000).toString();
export const hashOtp = (email: string, otp: string) => createHash("sha256").update(`${normalizeEmail(email)}:${otp}:${process.env.AUTH_SECRET ?? "dev-only-change-me"}`).digest("hex");
export const otpMatches = (expected: string, actual: string) => { const a=Buffer.from(expected); const b=Buffer.from(actual); return a.length===b.length && timingSafeEqual(a,b); };
