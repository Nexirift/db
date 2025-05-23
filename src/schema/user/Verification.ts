import { type InferSelectModel, relations } from "drizzle-orm";
import { pgEnum, pgTable, primaryKey, timestamp } from "drizzle-orm/pg-core";
import { citext, user } from "..";

export const userVerificationType = pgEnum("user_verification_type", [
  "NOTABLE",
  "ORGANIZATION",
  "GOVERNMENT",
]);

export const userVerification = pgTable("user_verification", {
  userId: citext("user_id")
    .notNull()
    .primaryKey()
    .references(() => user.id),
  type: userVerificationType("user_verification_type").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const userVerificationRelations = relations(
  userVerification,
  ({ one }) => ({
    user: one(user, {
      fields: [userVerification.userId],
      references: [user.id],
      relationName: "user_verification",
    }),
  }),
);

export type UserVerificationSchemaType = InferSelectModel<
  typeof userVerification
>;
