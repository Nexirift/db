import { type InferSelectModel, relations } from "drizzle-orm";
import { pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { citext, user } from "..";

export const userSetting = pgTable(
  "user_setting",
  {
    userId: citext("user_id")
      .notNull()
      .references(() => user.id),
    key: citext("key").notNull(),
    value: citext("value").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.key] })],
);

export const userSettingRelations = relations(userSetting, ({ one }) => ({
  user: one(user, {
    fields: [userSetting.userId],
    references: [user.id],
    relationName: "user_setting",
  }),
}));

export type UserSettingSchemaType = InferSelectModel<typeof userSetting>;
