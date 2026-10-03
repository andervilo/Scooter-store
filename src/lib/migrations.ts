import { db } from "@/lib/db";

const statements = [
`CREATE TABLE IF NOT EXISTS schema_migrations (version TEXT PRIMARY KEY, applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
`CREATE TABLE IF NOT EXISTS companies (id TEXT PRIMARY KEY, name TEXT NOT NULL, trade_name TEXT, cnpj TEXT, email TEXT, phone TEXT, whatsapp TEXT, address TEXT, active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0,1)), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
`CREATE TABLE IF NOT EXISTS customers (id TEXT PRIMARY KEY, company_id TEXT NOT NULL REFERENCES companies(id), name TEXT NOT NULL, cpf TEXT, phone TEXT, whatsapp TEXT, email TEXT, notes TEXT, active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0,1)), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, company_id TEXT REFERENCES companies(id), customer_id TEXT REFERENCES customers(id), name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, role TEXT NOT NULL CHECK(role IN ('ADMIN','EMPLOYEE','CUSTOMER')), active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0,1)), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, CHECK ((role = 'CUSTOMER' AND customer_id IS NOT NULL) OR (role IN ('ADMIN','EMPLOYEE') AND company_id IS NOT NULL)))`,
`CREATE TABLE IF NOT EXISTS vehicles (id TEXT PRIMARY KEY, company_id TEXT NOT NULL REFERENCES companies(id), customer_id TEXT NOT NULL REFERENCES customers(id), type TEXT NOT NULL CHECK(type IN ('ELECTRIC_SCOOTER','ELECTRIC_BIKE','SCOOTER','BIKE','OTHER')), brand TEXT NOT NULL, model TEXT NOT NULL, serial_number TEXT, color TEXT, motor_power_watts INTEGER, voltage REAL, notes TEXT, active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0,1)), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
`CREATE TABLE IF NOT EXISTS batteries (id TEXT PRIMARY KEY, company_id TEXT NOT NULL REFERENCES companies(id), vehicle_id TEXT NOT NULL REFERENCES vehicles(id), technology TEXT NOT NULL CHECK(technology IN ('LEAD_ACID','LITHIUM_ION','LIFEPO4','OTHER')), voltage REAL NOT NULL, capacity_ah REAL NOT NULL, manufacturer TEXT, serial_number TEXT, installed_at TEXT, removed_at TEXT, notes TEXT, active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0,1)), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
`CREATE TABLE IF NOT EXISTS service_orders (id TEXT PRIMARY KEY, company_id TEXT NOT NULL REFERENCES companies(id), customer_id TEXT NOT NULL REFERENCES customers(id), vehicle_id TEXT NOT NULL REFERENCES vehicles(id), number INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'OPEN' CHECK(status IN ('OPEN','DIAGNOSIS','WAITING_APPROVAL','WAITING_PART','IN_SERVICE','READY','DELIVERED','CANCELED')), problem_description TEXT NOT NULL, diagnosis TEXT, technical_notes TEXT, customer_notes TEXT, opened_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, completed_at TEXT, delivered_at TEXT, next_service_at TEXT, subtotal INTEGER NOT NULL DEFAULT 0 CHECK(subtotal >= 0), discount INTEGER NOT NULL DEFAULT 0 CHECK(discount >= 0), total INTEGER NOT NULL DEFAULT 0 CHECK(total >= 0), created_by TEXT NOT NULL REFERENCES users(id), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(company_id, number))`,
`CREATE TABLE IF NOT EXISTS service_order_items (id TEXT PRIMARY KEY, service_order_id TEXT NOT NULL REFERENCES service_orders(id) ON DELETE CASCADE, type TEXT NOT NULL CHECK(type IN ('SERVICE','PART')), description TEXT NOT NULL, quantity REAL NOT NULL CHECK(quantity > 0), unit_price INTEGER NOT NULL CHECK(unit_price >= 0), total_price INTEGER NOT NULL CHECK(total_price >= 0), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
`CREATE TABLE IF NOT EXISTS auth_otps (id TEXT PRIMARY KEY, email TEXT NOT NULL, code_hash TEXT NOT NULL, expires_at TEXT NOT NULL, used_at TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
`CREATE INDEX IF NOT EXISTS idx_auth_otps_email ON auth_otps(email, created_at)`,
`CREATE INDEX IF NOT EXISTS idx_customers_company ON customers(company_id)`,
`CREATE INDEX IF NOT EXISTS idx_customers_cpf ON customers(cpf)`,
`CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone)`,
`CREATE INDEX IF NOT EXISTS idx_vehicles_company ON vehicles(company_id)`,
`CREATE INDEX IF NOT EXISTS idx_vehicles_customer ON vehicles(customer_id)`,
`CREATE INDEX IF NOT EXISTS idx_vehicles_serial ON vehicles(serial_number)`,
`CREATE INDEX IF NOT EXISTS idx_batteries_vehicle ON batteries(vehicle_id)`,
`CREATE INDEX IF NOT EXISTS idx_service_orders_company ON service_orders(company_id)`,
`CREATE INDEX IF NOT EXISTS idx_service_orders_customer ON service_orders(customer_id)`,
`CREATE INDEX IF NOT EXISTS idx_service_orders_vehicle ON service_orders(vehicle_id)`,
`CREATE INDEX IF NOT EXISTS idx_service_orders_status ON service_orders(status)`,
`CREATE TABLE IF NOT EXISTS plans (id TEXT PRIMARY KEY, code TEXT NOT NULL UNIQUE, name TEXT NOT NULL, max_employees INTEGER, max_customers INTEGER, max_vehicles INTEGER, active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0,1)), created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
`CREATE TABLE IF NOT EXISTS company_subscriptions (id TEXT PRIMARY KEY, company_id TEXT NOT NULL UNIQUE REFERENCES companies(id), plan_id TEXT NOT NULL REFERENCES plans(id), status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('TRIAL','ACTIVE','PAST_DUE','CANCELED')), trial_ends_at TEXT, current_period_ends_at TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
`CREATE INDEX IF NOT EXISTS idx_company_subscriptions_plan ON company_subscriptions(plan_id)`
];

export async function migrate() {
  await db.execute("PRAGMA foreign_keys = ON");
  for (const sql of statements) await db.execute(sql);
  await db.execute({ sql: "INSERT OR IGNORE INTO schema_migrations(version) VALUES (?)", args: ["0001_initial_schema"] });
}
