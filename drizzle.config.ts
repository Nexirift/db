import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "dist/index.cjs",
  out: "../migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});
