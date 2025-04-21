import { relations, sql } from "drizzle-orm";
import { pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { citext, user } from "..";

export const userBadge = pgTable("user_badge", {
  id: citext("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  name: citext("name").notNull(),
  description: citext("description"),
  media: citext("media"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userBadgeRelations = relations(userBadge, ({ many }) => ({
  users: many(userBadges),
}));

export const userBadges = pgTable(
  "user_badges",
  {
    userId: citext("user_id")
      .notNull()
      .references(() => user.id),
    badgeId: citext("badge_id")
      .notNull()
      .references(() => userBadge.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.badgeId] })],
);

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(user, {
    fields: [userBadges.userId],
    references: [user.id],
  }),
  badge: one(userBadge, {
    fields: [userBadges.badgeId],
    references: [userBadge.id],
  }),
}));
