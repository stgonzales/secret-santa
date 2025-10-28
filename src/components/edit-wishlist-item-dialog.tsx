"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WishlistItemType } from "@/db/schema"
import { AddWishlistItemType } from "@/types"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AddWishlistItemSchema } from "@/schemas"
import { Edit2 } from "lucide-react"

interface EditWishlistItemDialogProps {
  item: WishlistItemType
  receiverId: string;
  onEdit: (item: WishlistItemType, receiverId: string) => void
}

export function EditWishlistItemDialog({ item, receiverId, onEdit }: EditWishlistItemDialogProps) {
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, control, reset } = useForm({
    resolver: zodResolver(AddWishlistItemSchema),
    defaultValues: {
      ...item,
      url: item?.url || "",
    }
  })

  const handler = (data: AddWishlistItemType) => {
    onEdit({
      ...item,
      ...data,
    }, receiverId)

    reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
          <Edit2 className="w-4 h-4" />
          <span className="sr-only">Edit item</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit(handler)}>
          <DialogHeader>
            <DialogTitle>Edit Wishlist Item</DialogTitle>
            <DialogDescription>Update the details of your wishlist item.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                {...register("name")}
                placeholder="e.g., Wireless Headphones"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                {...register("description")}
                placeholder="Add details like color, size, or specific features..."
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">Product URL</Label>
              <Input
                {...register("url")}
                type="url"
                placeholder="https://..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}> 
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
