import { type InferSelectModel, relations, sql } from "drizzle-orm";
import { pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { citext, post, user } from "..";

export const userPlanet = pgTable("user_planet", {
  id: citext("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  creatorId: citext("creator_id")
    .notNull()
    .references(() => user.id),
  name: citext("name").notNull(),
  description: citext("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userPlanetRelations = relations(userPlanet, ({ one, many }) => ({
  creator: one(user, {
    fields: [userPlanet.creatorId],
    references: [user.id],
  }),
  members: many(userPlanetMember),
  posts: many(userPlanetPost),
}));

export const userPlanetMember = pgTable(
  "user_planet_member",
  {
    userId: citext("user_id")
      .notNull()
      .references(() => user.id),
    planetId: citext("planet_id")
      .notNull()
      .references(() => userPlanet.id),
    joinedAt: timestamp("joined_at").notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.planetId] })],
);

export const userPlanetMemberRelations = relations(
  userPlanetMember,
  ({ one }) => ({
    user: one(user, {
      fields: [userPlanetMember.userId],
      references: [user.id],
    }),
    planet: one(userPlanet, {
      fields: [userPlanetMember.planetId],
      references: [userPlanet.id],
    }),
  }),
);

export const userPlanetPost = pgTable(
  "user_planet_post",
  {
    postId: citext("post_id")
      .notNull()
      .references(() => post.id),
    planetId: citext("planet_id")
      .notNull()
      .references(() => userPlanet.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.postId, table.planetId] })],
);

export const userPlanetPostRelations = relations(userPlanetPost, ({ one }) => ({
  planet: one(userPlanet, {
    fields: [userPlanetPost.planetId],
    references: [userPlanet.id],
  }),
  post: one(post, {
    fields: [userPlanetPost.postId],
    references: [post.id],
  }),
}));

export type UserPlanetSchemaType = InferSelectModel<typeof userPlanet>;
