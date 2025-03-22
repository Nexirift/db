import { relations, type InferSelectModel } from "drizzle-orm";
import { pgTable, timestamp } from "drizzle-orm/pg-core";
import { user, citext, userProfileField } from "../..";

export const userProfile = pgTable("user_profile", {
  userId: citext("user_id")
    .notNull()
    .references(() => user.id)
    .primaryKey(),
  bio: citext("bio"),
  extendedBio: citext("extended_bio"),
  profession: citext("profession"),
  location: citext("location"),
  website: citext("website"),
  banner: citext("banner"),
  background: citext("background"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const userProfileRelations = relations(userProfile, ({ one, many }) => ({
  user: one(user, {
    fields: [userProfile.userId],
    references: [user.id],
  }),
  profileFields: many(userProfileField),
}));

export type UserProfileSchemaType = InferSelectModel<typeof userProfile>;
