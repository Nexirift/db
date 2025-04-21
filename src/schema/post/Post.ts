import { type InferSelectModel, relations, sql } from "drizzle-orm";
import {
  type AnyPgColumn,
  boolean,
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import {
  citext,
  postCollectionItem,
  postEditHistory,
  postGiveaway,
  postInteraction,
  postMedia,
  postPoll,
  topicPost,
  user,
  userPlanetPost,
} from "..";

export const post = pgTable("post", {
  id: citext("id").default(sql`gen_random_uuid()`),
  authorId: citext("author_id")
    .notNull()
    .references(() => user.id),
  parentId: citext("parent_id").references((): AnyPgColumn => post.id),
  content: citext("content").notNull(),
  published: boolean("published").notNull().default(false),
  deleted: boolean("deleted").notNull().default(false),
  pinned: boolean("pinned").notNull().default(false),
  hidden: boolean("hidden").notNull().default(false),
  quoted: boolean("quote").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const postRelations = relations(post, ({ one, many }) => ({
  topics: many(topicPost, {
    relationName: "post_topics",
  }),
  author: one(user, {
    fields: [post.authorId],
    references: [user.id],
  }),
  parent: one(post, {
    relationName: "post_parent_replies",
    fields: [post.parentId],
    references: [post.id],
  }),
  replies: many(post, {
    relationName: "post_parent_replies",
  }),
  interactions: many(postInteraction),
  editHistory: many(postEditHistory),
  poll: one(postPoll),
  giveaway: one(postGiveaway),
  planet: one(userPlanetPost),
  media: many(postMedia),
  collections: many(postCollectionItem),
}));

export type PostSchemaType = InferSelectModel<typeof post>;
