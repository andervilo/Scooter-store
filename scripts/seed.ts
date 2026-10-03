import { db } from "../src/lib/db";
import { migrate } from "../src/lib/migrations";
import { newId } from "../src/lib/ids";

async function seed() {
  await migrate();
  const companyId = newId();
  await db.execute({ sql: "INSERT INTO companies(id,name,trade_name,email) VALUES (?,?,?,?)", args: [companyId, "Scooter Store Demo", "Scooter Store Demo", "demo@scooter-store.local"] });
  await db.execute({ sql: "INSERT INTO users(id,company_id,name,email,role) VALUES (?,?,?,?,?)", args: [newId(), companyId, "Administrador Demo", "admin@scooter-store.local", "ADMIN"] });
  const planId = newId();
  await db.execute({ sql: "INSERT OR IGNORE INTO plans(id,code,name,max_employees,max_customers,max_vehicles) VALUES (?,?,?,?,?,?)", args: [planId, "STARTER", "Starter", 3, 200, 300] });
  const plan = await db.execute({ sql: "SELECT id FROM plans WHERE code=? LIMIT 1", args: ["STARTER"] });
  await db.execute({ sql: "INSERT OR IGNORE INTO company_subscriptions(id,company_id,plan_id,status) VALUES (?,?,?,?)", args: [newId(), companyId, String(plan.rows[0].id), "ACTIVE"] });
  console.log("Development seed created.");
}
seed().then(() => process.exit(0)).catch((error) => { console.error(error); process.exit(1); });
