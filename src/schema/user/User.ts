import { InferSelectModel, relations, sql } from "drizzle-orm";
import { boolean, pgEnum, pgTable, timestamp } from "drizzle-orm/pg-core";
import {
  citext,
  post,
  postCollection,
  postInteraction,
  userConversationParticipant,
  userPlanet,
  userPlanetMember,
  userProfileField,
  userRelationship,
  userSetting,
  userVerification,
} from "..";

export const userType = pgEnum("user_type", ["PUBLIC", "PRIVATE"]);

export const user = pgTable("user", {
  id: citext("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  email: citext("email").unique(),
  emailVerified: boolean("email_verified").notNull(),
  username: citext("username").notNull().unique(),
  displayUsername: citext("display_username"),
  displayName: citext("display_name"),
  bio: citext("bio"),
  extendedBio: citext("extended_bio"),
  avatar: citext("avatar"),
  banner: citext("banner"),
  background: citext("background"),
  suspended: boolean("suspended").default(false),
  type: userType("user_type").default("PUBLIC"),
  profession: citext("profession"),
  location: citext("location"),
  website: citext("website"),
  stripe_customer_id: citext("stripe_customer_id"),
  stripe_subscription_id: citext("stripe_subscription_id"),
  role: citext("role"),
  banned: boolean("banned"),
  banReason: citext("ban_reason"),
  banExpires: timestamp("ban_expires"),
  twoFactorEnabled: boolean("two_factor_enabled"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const userRelations = relations(user, ({ one, many }) => ({
  toRelationships: many(userRelationship, {
    relationName: "user_to_relationships",
  }),
  fromRelationships: many(userRelationship, {
    relationName: "user_from_relationships",
  }),
  posts: many(post),
  postInteraction: many(postInteraction),
  verification: one(userVerification),
  profileFields: many(userProfileField),
  ownedPlanets: many(userPlanet),
  joinedPlanets: many(userPlanetMember),
  settings: many(userSetting),
  conversations: many(userConversationParticipant),
  collections: many(postCollection),
}));

export type UserSchemaType = InferSelectModel<typeof user>;
