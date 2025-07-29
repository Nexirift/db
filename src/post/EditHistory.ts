import { post } from "../post";
import { citext } from "../types";
import { type InferSelectModel, relations, sql } from "drizzle-orm";
import { pgTable, timestamp } from "drizzle-orm/pg-core";

export const postEditHistory = pgTable("post_edit_history", {
  id: citext("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  postId: citext("post_id")
    .notNull()
    .references(() => post.id, { onDelete: "cascade" }),
  content: citext("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const postEditHistoryRelations = relations(
  postEditHistory,
  ({ one }) => ({
    post: one(post, {
      fields: [postEditHistory.postId],
      references: [post.id],
      relationName: "post_edit_history",
    }),
  }),
);

export type PostEditHistorySchemaType = InferSelectModel<
  typeof postEditHistory
>;
