import { db } from "@/lib/db";
import { AuthorizationError, requireUser } from "@/lib/permissions";

export async function requireVehicleAccess(vehicleId: string) {
  const user = await requireUser();
  const sql = user.role === "CUSTOMER"
    ? "SELECT id FROM vehicles WHERE id=? AND customer_id=? AND active=1 LIMIT 1"
    : "SELECT id FROM vehicles WHERE id=? AND company_id=? AND active=1 LIMIT 1";
  const ownerId = user.role === "CUSTOMER" ? user.customerId : user.companyId;
  if (!ownerId) throw new AuthorizationError();
  const result = await db.execute({ sql, args: [vehicleId, ownerId] });
  if (!result.rows.length) throw new AuthorizationError();
  return user;
}
