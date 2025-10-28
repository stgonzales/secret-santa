"use client"

import { useEffect, useState, useTransition } from "react"
import { Trash2, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddWishlistItemDialog } from "@/components/add-wishlist-item-dialog"
import { EditWishlistItemDialog } from "@/components/edit-wishlist-item-dialog"
import { addWishlistItemAction, deleteWishlistItemAction, editWishlistItemAction, fetchWishlistAction } from "@/actions"
import { UserType, WishlistItemType } from "@/db/schema"
import { AddWishlistItemType } from "@/types"

export function MyWishlist({ userId }: { userId: UserType["id"] }) {
  const [items, setItems] = useState<WishlistItemType[]>([])
  const [, startTransition] = useTransition()

  const handleAddItem = async (item: AddWishlistItemType) => {
    const [newItem] = await addWishlistItemAction({
      data: {
        ...item,
        receiverId: userId,
      },
    })

    setItems((v) => [
      ...v,
      newItem,
    ])
  }

  const handleEditItem = async (editedItem: WishlistItemType) => {
    const [ item ] = await editWishlistItemAction({
      data: {
        ...editedItem,
        receiverId: userId,
      },
    })

    setItems(v => v.map(i =>
      i.id === item.id ? item : i
    ))
  }

  const handleDeleteItem = async (itemId: string) => {
    await deleteWishlistItemAction({
      receiverId: userId,
      itemId,
    })

    setItems((v) => items.filter(i => i.id !== itemId))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-primary/10 text-primary border-primary/20"
      case "medium":
        return "bg-secondary/10 text-secondary border-secondary/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  useEffect(() => {
    startTransition(async () => {
      const result = await fetchWishlistAction({ receiverId: userId })
      setItems(result)
    })
  }, [])

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" />
                My Wishlist
              </CardTitle>
              <CardDescription>Items you'd love to receive</CardDescription>
            </div>
            <AddWishlistItemDialog onAdd={handleAddItem} />
          </div>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-muted flex items-center justify-center">
                  <Gift className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground" />
                </div>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">Your wishlist is empty</p>
              <AddWishlistItemDialog onAdd={handleAddItem} />
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 sm:p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-semibold text-card-foreground text-sm sm:text-base">{item.name}</h4>
                        <Badge variant="outline" className={`text-xs sm:text-sm ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </Badge>
                      </div>
                      {item.description && <p className="text-xs sm:text-sm text-muted-foreground mb-2">{item.description}</p>}
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-primary hover:underline"
                        >
                          View product
                        </a>
                      )}
                    </div>
                    <div className="flex gap-1 sm:gap-2 justify-end">
                      <EditWishlistItemDialog
                        item={item}
                        receiverId={userId}
                        onEdit={handleEditItem}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteItem(item.id)}
                        className="h-7 w-7 sm:h-8 sm:w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="sr-only">Delete item</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
