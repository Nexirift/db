import { drizzle } from "drizzle-orm/node-postgres";
import { migrate as prodMigrate } from "drizzle-orm/node-postgres/migrator";
import { Client } from "pg";
import { sql } from "drizzle-orm";
import { migrate as testMigrate } from "drizzle-orm/pglite/migrator";
import { db } from "./db";
import { resolve } from "path";

// Get migrations folder path from CLI args or use default
const migrationsFolder =
  process.argv[2] ?? resolve(__dirname + "/../migrations");

/**
 * Handles database migrations based on environment
 * - In production: Uses node-postgres client
 * - In test: Uses pglite
 * Both environments ensure citext extension is available
 */
export async function migrator() {
  if (process.env.NODE_ENV !== "test") {
    // Production environment
    const client = db.$client as Client;
    try {
      await client.connect();
      await db.execute(sql`CREATE EXTENSION IF NOT EXISTS citext;`);
      await prodMigrate(drizzle(client), { migrationsFolder });
    } finally {
      await client.end();
    }
  } else {
    // Test environment
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS citext;`);
    await testMigrate(db, { migrationsFolder });
  }
}

// Auto-execute migrator if this file is run directly
(async () => {
  if (process.argv[1] === __filename) {
    await migrator();
  }
})();
