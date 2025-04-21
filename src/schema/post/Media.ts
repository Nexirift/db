import { type InferSelectModel, relations, sql } from "drizzle-orm";
import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { citext, post } from "..";

export const postMedia = pgTable("post_media", {
  id: citext("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  postId: citext("post_id").references(() => post.id),
  url: citext("url").notNull(),
  alt: citext("alt").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const postMediaRelations = relations(postMedia, ({ one }) => ({
  post: one(post, {
    fields: [postMedia.postId],
    references: [post.id],
    relationName: "post_media",
  }),
}));

export type PostMediaSchemaType = InferSelectModel<typeof postMedia>;
