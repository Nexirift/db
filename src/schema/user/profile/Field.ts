import { type InferSelectModel, relations, sql } from "drizzle-orm";
import {
  boolean,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { citext, user, userProfile } from "../..";

export const userProfileField = pgTable(
  "user_profile_field",
  {
    userId: citext("user_id")
      .notNull()
      .references(() => userProfile.userId, { onDelete: "cascade" }),
    name: citext("name").notNull(),
    value: citext("value").notNull(),
    spotlighted: boolean("spotlighted").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.name] })],
);

export const userProfileFieldRelations = relations(
  userProfileField,
  ({ one }) => ({
    profile: one(userProfile, {
      fields: [userProfileField.userId],
      references: [userProfile.userId],
      relationName: "user_profile_field",
    }),
  }),
);

export type UserProfileFieldSchemaType = InferSelectModel<
  typeof userProfileField
>;
