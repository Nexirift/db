import { type InferSelectModel, relations, sql } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { citext, user } from "..";

export const userConversationType = pgEnum("user_conversation_type", [
  "DIRECT",
  "GROUP",
]);

export const userConversation = pgTable("user_conversation", {
  id: citext("id")
    .default(sql`gen_random_uuid()`)
    .notNull()
    .primaryKey(),
  name: citext("name"),
  type: userConversationType("conversation_type").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userConversationRelations = relations(
  userConversation,
  ({ many }) => ({
    messages: many(userConversationMessage),
    participants: many(userConversationParticipant),
    roles: many(userConversationRole),
  }),
);

export const userConversationMessage = pgTable(
  "user_conversation_message",
  {
    id: citext("id")
      .default(sql`gen_random_uuid()`)
      .notNull(),
    conversationId: citext("conversation_id")
      .notNull()
      .references(() => userConversation.id),
    senderId: citext("sender_id")
      .notNull()
      .references(() => userConversationParticipant.id),
    content: citext("content").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.id, table.conversationId, table.senderId] }),
  ],
);

export const userConversationMessageRelations = relations(
  userConversationMessage,
  ({ one }) => ({
    conversation: one(userConversation, {
      fields: [userConversationMessage.conversationId],
      references: [userConversation.id],
    }),
    sender: one(userConversationParticipant, {
      fields: [userConversationMessage.senderId],
      references: [userConversationParticipant.id],
    }),
  }),
);

export const userConversationParticipant = pgTable(
  "user_conversation_participant",
  {
    id: citext("id")
      .default(sql`gen_random_uuid()`)
      .notNull()
      .unique(),
    conversationId: citext("conversation_id")
      .notNull()
      .references(() => userConversation.id),
    userId: citext("user_id")
      .notNull()
      .references(() => user.id),
    active: boolean("active").notNull().default(true),
    joinedAt: timestamp("joined_at").notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.id, table.conversationId, table.userId] }),
  ],
);

export const userConversationParticipantRelations = relations(
  userConversationParticipant,
  ({ one, many }) => ({
    messages: many(userConversationMessage),
    conversation: one(userConversation, {
      fields: [userConversationParticipant.conversationId],
      references: [userConversation.id],
    }),
    user: one(user, {
      fields: [userConversationParticipant.userId],
      references: [user.id],
    }),
    roles: many(userConversationParticipantRole),
  }),
);

export const userConversationRole = pgTable("user_conversation_role", {
  id: citext("id")
    .default(sql`gen_random_uuid()`)
    .notNull()
    .primaryKey(),
  name: citext("name").notNull(),
  description: citext("description"),
  conversationId: citext("conversation_id")
    .notNull()
    .references(() => userConversation.id),
  default: boolean("default").notNull().default(false),
  permissions: citext("permissions")
    .notNull()
    .default(sql`'{}'::citext[]`),
});

export const userConversationRoleRelations = relations(
  userConversationRole,
  ({ one, many }) => ({
    conversation: one(userConversation, {
      fields: [userConversationRole.conversationId],
      references: [userConversation.id],
    }),
    members: many(userConversationParticipantRole),
  }),
);

export const userConversationParticipantRole = pgTable(
  "user_conversation_participant_role",
  {
    participantId: citext("participant_id")
      .notNull()
      .references(() => userConversationParticipant.id),
    roleId: citext("role_id")
      .notNull()
      .references(() => userConversationRole.id),
  },
  (table) => [primaryKey({ columns: [table.participantId, table.roleId] })],
);

export const userConversationParticipantRoleRelations = relations(
  userConversationParticipantRole,
  ({ one }) => ({
    participant: one(userConversationParticipant, {
      fields: [userConversationParticipantRole.participantId],
      references: [userConversationParticipant.id],
    }),
    role: one(userConversationRole, {
      fields: [userConversationParticipantRole.roleId],
      references: [userConversationRole.id],
    }),
  }),
);

export type UserConversationSchemaType = InferSelectModel<
  typeof userConversation
>;
export type UserConversationMessageSchemaType = InferSelectModel<
  typeof userConversationMessage
>;
export type UserConversationRoleSchemaType = InferSelectModel<
  typeof userConversationRole
>;
export type UserConversationParticipantSchemaType = InferSelectModel<
  typeof userConversationParticipant
>;
export type UserConversationParticipantRoleSchemaType = InferSelectModel<
  typeof userConversationParticipantRole
>;
