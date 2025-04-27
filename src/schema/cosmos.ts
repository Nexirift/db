import { relations } from "drizzle-orm";
import { pgTable, timestamp } from "drizzle-orm/pg-core";
import { citext } from "./types";
import { user } from "./user";

export const cosmosSetting = pgTable("cosmos_setting", {
  key: citext("key").notNull().primaryKey(),
  value: citext("value").notNull(),
});

export const cosmosAuditLog = pgTable("cosmos_audit_log", {
  id: citext("id").notNull().primaryKey(),
  userId: citext("user_id").notNull(),
  event: citext("event").notNull(),
  data: citext("data").notNull(),
  note: citext("note").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const cosmosAuditLogRelations = relations(cosmosAuditLog, ({ one }) => ({
  user: one(user, {
    relationName: "cosmos_audit_logs",
    fields: [cosmosAuditLog.userId],
    references: [user.id],
  }),
}));
