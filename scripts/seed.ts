import { db } from "../src/lib/db";
import { migrate } from "../src/lib/migrations";
import { newId } from "../src/lib/ids";

async function seed() {
  await migrate();
  const companyId = newId();
  await db.execute({ sql: "INSERT INTO companies(id,name,trade_name,email) VALUES (?,?,?,?)", args: [companyId, "Scooter Store Demo", "Scooter Store Demo", "demo@scooter-store.local"] });
  await db.execute({ sql: "INSERT INTO users(id,company_id,name,email,role) VALUES (?,?,?,?,?)", args: [newId(), companyId, "Administrador Demo", "admin@scooter-store.local", "ADMIN"] });
  console.log("Development seed created.");
}
seed().then(() => process.exit(0)).catch((error) => { console.error(error); process.exit(1); });
