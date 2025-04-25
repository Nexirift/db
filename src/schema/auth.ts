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
  activeOrganizationId: citext("active_organization_id"),
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

export const oauthApplication = pgTable("oauth_application", {
  id: citext("id").primaryKey(),
  name: citext("name"),
  icon: citext("icon"),
  metadata: citext("metadata"),
  clientId: citext("client_id").unique(),
  clientSecret: citext("client_secret"),
  redirectURLs: citext("redirect_u_r_ls"),
  type: citext("type"),
  disabled: boolean("disabled"),
  userId: citext("user_id"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const oauthAccessToken = pgTable("oauth_access_token", {
  id: citext("id").primaryKey(),
  accessToken: citext("access_token").unique(),
  refreshToken: citext("refresh_token").unique(),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  clientId: citext("client_id"),
  userId: citext("user_id"),
  scopes: citext("scopes"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const oauthConsent = pgTable("oauth_consent", {
  id: citext("id").primaryKey(),
  clientId: citext("client_id"),
  userId: citext("user_id"),
  scopes: citext("scopes"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
  consentGiven: boolean("consent_given"),
});

export const customer = pgTable("customer", {
  id: citext("id").primaryKey(),
  stripeCustomerId: citext("stripe_customer_id"),
  userId: citext("user_id"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const subscription = pgTable("subscription", {
  id: citext("id").primaryKey(),
  plan: citext("plan").notNull(),
  referenceId: citext("reference_id").notNull(),
  stripeCustomerId: citext("stripe_customer_id"),
  stripeSubscriptionId: citext("stripe_subscription_id"),
  status: citext("status"),
  periodStart: timestamp("period_start"),
  periodEnd: timestamp("period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end"),
  seats: integer("seats"),
});

export const cosmosInvitation = pgTable("cosmos_invitation", {
  id: citext("id").primaryKey(),
  code: citext("code").notNull().unique(),
  creatorId: citext("creator_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  userId: citext("user_id").references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const violation = pgTable("violation", {
  id: citext("id").primaryKey(),
  content: citext("content").notNull(),
  publicComment: citext("public_comment"),
  internalNote: citext("internal_note"),
  severity: integer("severity").notNull(),
  applicableRules: citext("applicable_rules").notNull(),
  overturned: boolean("overturned"),
  moderatorId: citext("moderator_id").references(() => user.id, {
    onDelete: "cascade",
  }),
  userId: citext("user_id").references(() => user.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull(),
  lastUpdatedBy: citext("last_updated_by").references(() => user.id, {
    onDelete: "cascade",
  }),
  updatedAt: timestamp("updated_at").notNull(),
  amStatus: citext("am_status").notNull(),
  amMetadata: citext("am_metadata"),
});

export const violationDispute = pgTable("violation_dispute", {
  id: citext("id").primaryKey(),
  violationId: citext("violation_id")
    .notNull()
    .references(() => violation.id, { onDelete: "cascade" }),
  userId: citext("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  reason: citext("reason").notNull(),
  status: citext("status").notNull(),
  justification: citext("justification"),
  reviewedBy: citext("reviewed_by").references(() => user.id, {
    onDelete: "cascade",
  }),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const jwks = pgTable("jwks", {
  id: citext("id").primaryKey(),
  publicKey: citext("public_key").notNull(),
  privateKey: citext("private_key").notNull(),
  createdAt: timestamp("created_at").notNull(),
});
