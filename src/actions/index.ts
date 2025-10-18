'use server'

import { db } from "@/db"
import { wishlist, NewWishlistItemType } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function fetchWishlistAction({ userId }: { userId: string }) {
  return await db.select().from(wishlist).where(eq(wishlist.userId, userId))
}

export async function addWishlistItemAction({ data }: { data: NewWishlistItemType }) {
  const res =  await db.insert(wishlist).values(data).returning()

  revalidatePath('/')

  return res
}

// export async function fetchWishlistItemAction({ userId, itemId }: { userId: string, itemId: string }) {
//   await db.select().from(wishlist).where(and(
//     eq(wishlist.userId, userId),
//     eq(wishlist.id, itemId)
//   ))
// }

export async function editWishlistItemAction({ itemId, data }: { itemId: string; data: NewWishlistItemType }) {
  const res = await db.update(wishlist).set(data).where(and(
    eq(wishlist.userId, data.userId),
    eq(wishlist.id, itemId)
  )).returning()

  revalidatePath('/')

  return res
}

export async function deleteWishlistItemAction({ itemId, userId }: { itemId: string; userId: string }) {
  await db.delete(wishlist).where(and(
    eq(wishlist.id, itemId),
    eq(wishlist.userId, userId)
  ))
  revalidatePath('/')
}