import { boolean, pgTable, timestamp } from "drizzle-orm/pg-core";
import { citext } from "../types";
import { user } from "../user";
import type { InferSelectModel } from "drizzle-orm";

export const organization = pgTable("organization", {
  id: citext("id").primaryKey(),
  name: citext("name").notNull(),
  slug: citext("slug").unique(),
  logo: citext("logo"),
  createdAt: timestamp("created_at").notNull(),
  metadata: citext("metadata"),
});

export const organizationInvitation = pgTable("organization_invitation", {
  id: citext("id").primaryKey(),
  code: citext("code").notNull().unique(),
  creatorId: citext("creator_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  userId: citext("user_id").references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  organizationId: citext("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  email: citext("email").notNull(),
  role: citext("role"),
  teamId: citext("team_id"),
  status: citext("status").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  inviterId: citext("inviter_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const organizationMember = pgTable("organization_member", {
  id: citext("id").primaryKey(),
  organizationId: citext("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  userId: citext("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  role: citext("role").notNull(),
  teamId: citext("team_id"),
  affiliated: boolean("affiliated").default(false),
  createdAt: timestamp("created_at").notNull(),
});

export const organizationTeam = pgTable("organization_team", {
  id: citext("id").primaryKey(),
  name: citext("name").notNull(),
  organizationId: citext("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at"),
});

export type OrganizationSchemaType = InferSelectModel<typeof organization>;

export type OrganizationInvitationSchemaType = InferSelectModel<
  typeof organizationInvitation
>;

export type OrganizationMemberSchemaType = InferSelectModel<
  typeof organizationMember
>;

export type OrganizationTeamSchemaType = InferSelectModel<
  typeof organizationTeam
>;
