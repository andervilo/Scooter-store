import { getCurrentUser, type CurrentUser, type Role } from "@/lib/auth";

export class AuthorizationError extends Error {
  constructor(message = "Forbidden") { super(message); this.name = "AuthorizationError"; }
}

export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) throw new AuthorizationError("Unauthorized");
  return user;
}

export async function requireCompany(): Promise<CurrentUser & { companyId: string }> {
  const user = await requireUser();
  if (!user.companyId) throw new AuthorizationError();
  return user as CurrentUser & { companyId: string };
}

export async function requireRole(...roles: Role[]) {
  const user = await requireUser();
  if (!roles.includes(user.role)) throw new AuthorizationError();
  return user;
}

export async function requireCustomer(): Promise<CurrentUser & { customerId: string }> {
  const user = await requireRole("CUSTOMER");
  if (!user.customerId) throw new AuthorizationError();
  return user as CurrentUser & { customerId: string };
}
