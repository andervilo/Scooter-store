import { db } from "@/lib/db";
import { AuthorizationError, requireUser } from "@/lib/permissions";

export async function requireServiceOrderAccess(serviceOrderId: string) {
  const user = await requireUser();
  const sql = user.role === "CUSTOMER"
    ? "SELECT id FROM service_orders WHERE id=? AND customer_id=? LIMIT 1"
    : "SELECT id FROM service_orders WHERE id=? AND company_id=? LIMIT 1";
  const ownerId = user.role === "CUSTOMER" ? user.customerId : user.companyId;
  if (!ownerId) throw new AuthorizationError();
  const result = await db.execute({ sql, args: [serviceOrderId, ownerId] });
  if (!result.rows.length) throw new AuthorizationError();
  return user;
}
