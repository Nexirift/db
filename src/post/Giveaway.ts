import { post } from "../post";
import { citext } from "../types";
import { user } from "../user";
import { type InferSelectModel, relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  json,
  pgEnum,
  pgTable,
  primaryKey,
  timestamp,
} from "drizzle-orm/pg-core";

export const postGiveawayType = pgEnum("post_giveaway_type", [
  "GIVEAWAY",
  "RAFFLE",
]);

export const postGiveaway = pgTable("post_giveaway", {
  id: citext("id")
    .default(sql`gen_random_uuid()`)
    .notNull()
    .primaryKey(),
  postId: citext("post_id")
    .notNull()
    .references(() => post.id),
  type: postGiveawayType("post_giveaway_type").notNull(),
  finish: timestamp("finish").notNull().defaultNow(),
  requirements: json("requirements").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const postGiveawayRelations = relations(postGiveaway, ({ one }) => ({
  post: one(post, {
    fields: [postGiveaway.postId],
    references: [post.id],
    relationName: "post_giveaway",
  }),
  metadata: one(postGiveawayMeta, {
    fields: [postGiveaway.id],
    references: [postGiveawayMeta.giveawayId],
    relationName: "post_giveaway_metadata",
  }),
}));

export const postGiveawayMeta = pgTable("post_giveaway_metadata", {
  giveawayId: citext("giveaway_id")
    .notNull()
    .primaryKey()
    .references(() => postGiveaway.id),
  replyLengthMin: integer("reply_length_min").notNull(),
  mustIncludeMedia: boolean("must_include_media").notNull(),
});

export const postGiveawayMetaRelations = relations(
  postGiveawayMeta,
  ({ one }) => ({
    giveaway: one(postGiveaway, {
      fields: [postGiveawayMeta.giveawayId],
      references: [postGiveaway.id],
      relationName: "post_giveaway_metadata",
    }),
  }),
);

export const postGiveawayEntry = pgTable(
  "post_giveaway_entry",
  {
    giveawayId: citext("giveaway_id")
      .notNull()
      .references(() => postGiveaway.id),
    userId: citext("user_id")
      .notNull()
      .references(() => user.id),
    requirements: json("requirements").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.giveawayId, table.userId] })],
);

export const postGiveawayEntryRelations = relations(
  postGiveawayEntry,
  ({ one }) => ({
    giveaway: one(postGiveaway, {
      fields: [postGiveawayEntry.giveawayId],
      references: [postGiveaway.id],
      relationName: "post_giveaway_entry",
    }),
    user: one(user, {
      fields: [postGiveawayEntry.userId],
      references: [user.id],
      relationName: "post_giveaway_entry",
    }),
  }),
);

export type PostGiveawaySchemaType = InferSelectModel<typeof postGiveaway>;
export type PostGiveawayMetaSchemaType = InferSelectModel<
  typeof postGiveawayMeta
>;
export type PostGiveawayEntrySchemaType = InferSelectModel<
  typeof postGiveawayEntry
>;
