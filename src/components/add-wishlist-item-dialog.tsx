"use client"

import type React from "react"

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
import { AddWishlistItemType } from "@/types"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AddWishlistItemSchema } from "@/schemas"
import { Plus } from "lucide-react"
import { useState } from "react"
import { ChildrenType } from "@/db/schema"

type AddWishlistItemDialogProps = {
  onAdd: (item: AddWishlistItemType, childId?: string) => void
  child?: ChildrenType
}

export function AddWishlistItemDialog({ onAdd, child }: AddWishlistItemDialogProps) {
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, reset, control } = useForm({
    resolver: zodResolver(AddWishlistItemSchema),
  })

  const handleClose = (state: boolean) => {
    reset()
    setOpen(state)
  }

  const handler = async (data: AddWishlistItemType) => {
    onAdd(data, child?.id)
    handleClose(false)
  }

  return (
    <Dialog open={open} onOpenChange={(handleClose)}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit(handler)}>
          <DialogHeader>
            <DialogTitle>Add Wishlist Item</DialogTitle>
            <DialogDescription>{child ? `Add a new item to ${child.name}'s wishlist for Secret Santa.` : "Add a new item to your wishlist for Secret Santa."}</DialogDescription>
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
                defaultValue="low"
                render={({ field }) => (
                  <Select {...field}> 
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
            <Button type="button" variant="outline" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
