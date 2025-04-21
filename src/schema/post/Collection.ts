import { type InferSelectModel, relations, sql } from "drizzle-orm";
import { pgEnum, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { citext, post, user } from "..";

export const postCollectionType = pgEnum("post_collection_type", [
  "PUBLIC",
  "PRIVATE",
]);

export const postCollection = pgTable("post_collection", {
  id: citext("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  name: citext("name").notNull(),
  description: citext("description"),
  type: postCollectionType("type").notNull().default("PRIVATE"),
  userId: citext("user_id")
    .notNull()
    .references(() => user.id),
});

export const postCollectionRelations = relations(
  postCollection,
  ({ one, many }) => ({
    user: one(user, {
      fields: [postCollection.userId],
      references: [user.id],
      relationName: "user__collections",
    }),
    items: many(postCollectionItem),
  }),
);

export const postCollectionItem = pgTable(
  "post_collection_item",
  {
    collectionId: citext("collection_id")
      .notNull()
      .references(() => postCollection.id),
    postId: citext("post_id")
      .notNull()
      .references(() => post.id),
  },
  (table) => [primaryKey({ columns: [table.collectionId, table.postId] })],
);

export const postCollectionItemRelations = relations(
  postCollectionItem,
  ({ one }) => ({
    collection: one(postCollection, {
      fields: [postCollectionItem.collectionId],
      references: [postCollection.id],
      relationName: "collection__items",
    }),
    post: one(post, {
      fields: [postCollectionItem.postId],
      references: [post.id],
      relationName: "post__collections",
    }),
  }),
);

export type PostCollectionSchemaType = InferSelectModel<typeof postCollection>;
export type PostCollectionItemSchemaType = InferSelectModel<
  typeof postCollectionItem
>;
