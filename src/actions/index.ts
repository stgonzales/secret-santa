'use server'

import { db } from "@/db"
import { wishlist, NewWishlistItemType, children, WishlistItemType, childWishlist, NewChildWishlistItemType, ChildWishlistItemType } from "@/db/schema"
import { NewChildrenType } from "@/types"
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

export async function editWishlistItemAction({ data }: { data: WishlistItemType }) {
  const res = await db.update(wishlist).set(data).where(and(
    eq(wishlist.userId, data.userId),
    eq(wishlist.id, data.id)
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

export async function fetchChildrensAction({ userId }: { userId: string }) {
  return await db.select().from(children).where(eq(children.userId, userId))
}

export async function addChildAction({ data }: { data: NewChildrenType & { userId: string } }) {
  const res =  await db.insert(children).values(data).returning()

  revalidatePath('/')

  return res
}

export async function editChildAction({ childId, data }: { childId: string; data: NewWishlistItemType }) {
  const res = await db.update(children).set(data).where(and(
    eq(children.userId, data.userId),
    eq(children.id, childId)
  )).returning()

  revalidatePath('/')

  return res
}

export async function deleteChildAction({ childId, userId }: { childId: string; userId: string }) {
  await db.delete(children).where(and(
    eq(children.id, childId),
    eq(children.userId, userId)
  ))

  await db.delete(childWishlist).where(eq(childWishlist.childId, childId))

  revalidatePath('/')
}

export async function fetchChildWishListAction({ userId }: { userId: string }): Promise<Record<string, ChildWishlistItemType[]>> {
  const childrens = await fetchChildrensAction({ userId })

  let childrensWishlist: Record<string, ChildWishlistItemType[]> & {} = {}

  for (const child of childrens) {
    const res = await db.select().from(childWishlist).where(eq(childWishlist.childId, child.id))

    Object.assign(childrensWishlist, { [child.id]: res })
  }

  revalidatePath('/')

  return childrensWishlist
}

export async function addChildWishlistItemAction({ data }: { data: NewChildWishlistItemType }) {
  const res =  await db.insert(childWishlist).values(data).returning()

  revalidatePath('/')

  return res
}

export async function editChildWishlistItemAction({ data }: { data: ChildWishlistItemType }) {
  const res = await db.update(childWishlist).set(data).where(eq(childWishlist.childId, data.childId)).returning()

  revalidatePath('/')

  return res
}

export async function deleteChildWishlistItemAction({ itemId, childId }: { itemId: string; childId: string }) {
  await db.delete(childWishlist).where(and(
    eq(childWishlist.id, itemId),
    eq(childWishlist.childId, childId)
  ))
  revalidatePath('/')
}