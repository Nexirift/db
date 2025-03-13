import { drizzle as prodDrizzle } from "drizzle-orm/node-postgres";
import { Client as prodClient } from "pg";
import * as schema from "./schema";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { PgliteDatabase } from "drizzle-orm/pglite";

// Initialize production database client with connection string from environment
export const prodDbClient = new prodClient({
  connectionString: process.env.DATABASE_URL as string,
});

// Define database type that can be either production or test database
let db:
  | (NodePgDatabase<typeof schema> & { $client: prodClient })
  | (PgliteDatabase<typeof schema> & {
      $client: import("@electric-sql/pglite").PGlite;
    });

// Database initialization based on environment
if (process.env.NODE_ENV !== "test") {
  // Production: Use PostgreSQL database
  db = prodDrizzle(prodDbClient, { schema });
} else {
  // Test environment: Use in-memory PGlite database
  // Load dependencies asynchronously to reduce initial bundle size
  Promise.all([
    import("@electric-sql/pglite"),
    import("drizzle-orm/pglite"),
    import("@electric-sql/pglite/dist/contrib/citext"),
  ]).then(([{ PGlite: testClient }, { drizzle: testDrizzle }, { citext }]) => {
    db = testDrizzle(new testClient({ extensions: { citext } }), {
      schema,
    });
  });
}

function connect() {
  if (db.$client instanceof prodClient) {
    return db.$client.connect();
  }
  return null;
}

function end() {
  if (db.$client instanceof prodClient) {
    return db.$client.end();
  }
  return null;
}

export { db, connect, end };
