import { relations, type InferSelectModel } from "drizzle-orm";
import { pgTable, primaryKey, timestamp } from "drizzle-orm/pg-core";
import { post } from "./post";
import { citext } from "./types";
import { user } from "./user";

export const topic = pgTable("topic", {
  name: citext("name").notNull().primaryKey(),
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

export const topicUser = pgTable(
  "topic_user",
  {
    topicName: citext("topic_name").notNull(),
    userId: citext("user_id").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [primaryKey({ columns: [table.topicName, table.userId] })],
);

export const topicUserRelations = relations(topicUser, ({ one }) => ({
  user: one(user, {
    relationName: "user_topics",
    fields: [topicUser.userId],
    references: [user.id],
  }),
  topic: one(topic, {
    relationName: "topic_to_users",
    fields: [topicUser.topicName],
    references: [topic.name],
  }),
}));

export const topicPost = pgTable(
  "topic_post",
  {
    topicName: citext("topic_name").notNull(),
    postId: citext("post_id").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [primaryKey({ columns: [table.topicName, table.postId] })],
);

export const topicPostRelations = relations(topicPost, ({ one }) => ({
  post: one(post, {
    relationName: "post_topics",
    fields: [topicPost.postId],
    references: [post.id],
  }),
  topic: one(topic, {
    relationName: "topic_to_posts",
    fields: [topicPost.topicName],
    references: [topic.name],
  }),
}));

export type TopicSchemaType = InferSelectModel<typeof topic>;
export type TopicUserSchemaType = InferSelectModel<typeof topicUser>;
export type TopicPostSchemaType = InferSelectModel<typeof topicPost>;
