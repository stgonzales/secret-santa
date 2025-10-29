'use server'

import { db } from "@/db"
import { wishlist, NewWishlistItemType, children, WishlistItemType, user, draws } from "@/db/schema"
import { NewChildrenType } from "@/types"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function fetchUsersAction() {
  return await db.select().from(user)
}

export async function fetchWishlistAction({ receiverId }: { receiverId: string }): Promise<WishlistItemType[]> {
  return await db.select().from(wishlist).where(eq(wishlist.receiverId, receiverId))
}

export async function addWishlistItemAction({ data }: { data: NewWishlistItemType }) {
  const res =  await db.insert(wishlist).values(data).returning()

  revalidatePath('/', 'layout')

  return res
}

export async function editWishlistItemAction({ data }: { data: WishlistItemType }) {
  const res = await db.update(wishlist).set(data).where(and(
    eq(wishlist.receiverId, data.receiverId),
    eq(wishlist.id, data.id)
  )).returning()

  revalidatePath('/', 'layout')

  return res
}

export async function deleteWishlistItemAction({ itemId, receiverId }: { itemId: string; receiverId: string }) {
  await db.delete(wishlist).where(and(
    eq(wishlist.id, itemId),
    eq(wishlist.receiverId, receiverId)
  ))
  revalidatePath('/', 'layout')
}

export async function fetchChildrensAction() {
  return await db.select().from(children)
}

export async function fetchChildrensPerUserAction({ userId }: { userId: string }) {
  return await db.select().from(children).where(eq(children.userId, userId))
}

export async function addChildAction({ data }: { data: NewChildrenType & { userId: string } }) {
  const { firstName, lastName, ...rest} = data
  const res =  await db.insert(children).values({
    ...rest,
    name: `${firstName} ${lastName}`
  }).returning()

  revalidatePath('/', 'layout')

  return res
}

export async function editChildAction({ childId, data }: { childId: string; data: NewWishlistItemType }) {
  const res = await db.update(children).set(data).where(and(
    eq(children.userId, data.receiverId),
    eq(children.id, childId)
  )).returning()

  revalidatePath('/', 'layout')

  return res
}

export async function deleteChildAction({ childId, userId }: { childId: string; userId: string }) {
  await db.delete(children).where(and(
    eq(children.id, childId),
    eq(children.userId, userId)
  ))

  await db.delete(wishlist).where(eq(wishlist.receiverId, childId))

  revalidatePath('/', 'layout')
}

export async function fetchUserReceiverName(giverId: string): Promise<[{ id: string; name: string; }, WishlistItemType[]] | undefined> {
  const receiver = await db.select({
    receiverId: draws.receiverId
  }).from(draws).where(eq(draws.giverId, giverId))

  if(receiver.length === 0) return undefined

  const { receiverId } = receiver[0]

  const childrens = await db.select().from(children).where(eq(children.id, receiverId))

  if(childrens[0]) {
    const [ child ] = childrens
    const wishlistItems = await db.select().from(wishlist).where(eq(wishlist.receiverId, child.id))

    return [{ id: child.id, name: child.name }, wishlistItems]
  } else {
    const users = await db.select().from(user).where(eq(user.id, receiverId))
    
    const wishlistItems = await db.select().from(wishlist).where(eq(wishlist.receiverId, users[0].id))

    return [{ id: users[0].id, name: users[0].name }, wishlistItems]
  }
}

export async function availableRecipientNames() {
  const users = await db.select({
    id: user.id,
    name: user.name
  }).from(user)
  const childrens = await db.select({
    id: children.id,
    name: children.name,
  }).from(children)
  

  return [...users, ...childrens]
}

export async function addDrawnNames({
  giverId,
  receiverId,
}: {
  giverId: string;
  receiverId: string;
}) {
  await db.insert(draws).values({
    giverId,
    receiverId,
  })
  revalidatePath('/', 'layout')
}

export async function deleteDrawnNames() {
  await db.delete(draws)
  revalidatePath('/', 'layout')
}