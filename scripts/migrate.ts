import { migrate } from "../src/lib/migrations";

migrate().then(() => { console.log("Database migrated."); process.exit(0); }).catch((error) => { console.error(error); process.exit(1); });
