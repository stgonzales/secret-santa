import { cache } from 'react'
import { db } from '@/db'
import { wishlist } from '@/db/schema'
import { eq } from 'drizzle-orm'
 
export const getWishlistItems = cache(async (id: string) => {
  return await db.select().from(wishlist).where(eq(wishlist.userId, id))
})