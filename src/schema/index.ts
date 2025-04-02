import { pgTable, timestamp } from "drizzle-orm/pg-core";
import { citext } from "./types";
import { relations, type InferSelectModel } from "drizzle-orm";
import { post } from "./post";
import { user } from "./user";

// types MUST be first.
export * from "./types";
export * from "./organization";
export * from "./post";
export * from "./user";
export * from "./auth";

// TODO: Migrate these to a separate file.

export const topic = pgTable("topic", {
  id: citext("id").primaryKey(),
  name: citext("name").notNull(),
  description: citext("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const topicRelations = relations(topic, ({ many }) => ({
  posts: many(topicPost, {
    relationName: "topic_to_posts",
  }),
  users: many(topicUser, {
    relationName: "topic_to_users",
  }),
}));

export const topicUser = pgTable("topic_user", {
  topicId: citext("topic_id").notNull(),
  userId: citext("user_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const topicUserRelations = relations(topicUser, ({ one }) => ({
  user: one(user, {
    relationName: "user_topics",
    fields: [topicUser.userId],
    references: [user.id],
  }),
  topic: one(topic, {
    relationName: "topic_to_users",
    fields: [topicUser.topicId],
    references: [topic.id],
  }),
}));

export const topicPost = pgTable("topic_post", {
  topicId: citext("topic_id").notNull(),
  postId: citext("post_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const topicPostRelations = relations(topicPost, ({ one }) => ({
  post: one(post, {
    relationName: "post_topics",
    fields: [topicPost.postId],
    references: [post.id],
  }),
  topic: one(topic, {
    relationName: "topic_to_posts",
    fields: [topicPost.topicId],
    references: [topic.id],
  }),
}));

export type TopicSchemaType = InferSelectModel<typeof topic>;
export type TopicUserSchemaType = InferSelectModel<typeof topicUser>;
export type TopicPostSchemaType = InferSelectModel<typeof topicPost>;

export const cosmosSetting = pgTable("cosmos_setting", {
  key: citext("key").notNull(),
  value: citext("value").notNull(),
});
