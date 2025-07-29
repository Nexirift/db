import { cosmosAuditLog } from "../cosmos";
import { post, postCollection, postInteraction } from "../post";
import { topicUser } from "../topic";
import { citext } from "../types";
import {
  userConversationParticipant,
  userPlanet,
  userPlanetMember,
  userProfile,
  userRelationship,
  userSetting,
  userVerification,
} from "../user";
import { type InferSelectModel, relations, sql } from "drizzle-orm";
import { boolean, pgEnum, pgTable, timestamp } from "drizzle-orm/pg-core";

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
  avatar: citext("avatar"),
  suspended: boolean("suspended").default(false),
  type: userType("user_type").default("PUBLIC"),
  role: citext("role"),
  banned: boolean("banned"),
  banReason: citext("ban_reason"),
  banExpires: timestamp("ban_expires"),
  twoFactorEnabled: boolean("two_factor_enabled"),
  birthday: citext("birthday").notNull(), // *sigh* better-auth doesn't process Dates properly...
  stripeCustomerId: citext("stripe_customer_id"),
  usernameAliases: citext("username_aliases"),
  invitation: citext("invitation"),
  flags: citext("flags"), // private version of attributes
  attributes: citext("attributes"), // public version of flags
  apPublicKey: citext("ap_public_key"),
  apPrivateKey: citext("ap_private_key"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const userRelations = relations(user, ({ one, many }) => ({
  topics: many(topicUser, {
    relationName: "user_topics",
  }),
  profile: one(userProfile),
  toRelationships: many(userRelationship, {
    relationName: "user_to_relationships",
  }),
  fromRelationships: many(userRelationship, {
    relationName: "user_from_relationships",
  }),
  posts: many(post),
  postInteraction: many(postInteraction),
  verification: one(userVerification),
  ownedPlanets: many(userPlanet),
  joinedPlanets: many(userPlanetMember),
  settings: many(userSetting),
  conversations: many(userConversationParticipant),
  collections: many(postCollection),
  auditLogs: many(cosmosAuditLog),
}));

export type UserSchemaType = InferSelectModel<typeof user>;
