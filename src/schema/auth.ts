import { boolean, integer, pgTable, timestamp } from "drizzle-orm/pg-core";
import { user, citext } from ".";

export const userSession = pgTable("user_session", {
  id: citext("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: citext("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: citext("ip_address"),
  userAgent: citext("user_agent"),
  userId: citext("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: citext("impersonated_by"),
});

export const userAccount = pgTable("user_account", {
  id: citext("id").primaryKey(),
  accountId: citext("account_id").notNull(),
  providerId: citext("provider_id").notNull(),
  userId: citext("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: citext("access_token"),
  refreshToken: citext("refresh_token"),
  idToken: citext("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: citext("scope"),
  password: citext("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const userAuthVerification = pgTable("user_auth_verification", {
  id: citext("id").primaryKey(),
  identifier: citext("identifier").notNull(),
  value: citext("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const passkey = pgTable("passkey", {
  id: citext("id").primaryKey(),
  name: citext("name"),
  publicKey: citext("public_key").notNull(),
  userId: citext("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  credentialID: citext("credential_i_d").notNull(),
  counter: integer("counter").notNull(),
  deviceType: citext("device_type").notNull(),
  backedUp: boolean("backed_up").notNull(),
  transports: citext("transports"),
  createdAt: timestamp("created_at"),
});

export const twoFactor = pgTable("two_factor", {
  id: citext("id").primaryKey(),
  secret: citext("secret").notNull(),
  backupCodes: citext("backup_codes").notNull(),
  userId: citext("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});
