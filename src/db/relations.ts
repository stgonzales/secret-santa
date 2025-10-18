import { relations } from "drizzle-orm";
import { user, children, wishlist, draws } from "./schema";

export const usersRelations = relations(user, ({ many }) => ({
  children: many(children),
  wishlist: many(wishlist),
  givenDraws: many(draws, { relationName: "giver" }),
  receivedDraws: many(draws, { relationName: "receiver" }),
}));

export const childrenRelations = relations(children, ({ one, many }) => ({
  user: one(user, {
    fields: [children.userId],
    references: [user.id],
  }),
  wishlist: many(wishlist),
}));