import { requireCompany } from "@/lib/permissions";

export async function tenantContext() {
  const user = await requireCompany();
  return { userId: user.id, companyId: user.companyId, role: user.role };
}

// companyId is intentionally derived from the authenticated user.
// API payload/query parameters must never be used as authorization context.
