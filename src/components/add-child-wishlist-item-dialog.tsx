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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddWishlistItemSchema } from "@/schemas"
import { AddWishlistItemType } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { url } from "inspector"
import { setPriority } from "os"
import { useForm } from "react-hook-form"

interface AddChildWishlistItemDialogProps {
  onAdd: (item: AddWishlistItemType, childId?: string) => void
}

export function AddChildWishlistItemDialog({ childId, userId, onAdd }: AddChildWishlistItemDialogProps) {
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, reset, control } = useForm({
    resolver: zodResolver(AddWishlistItemSchema),
  })

  const handleClose = (state: boolean) => {
    reset()
    setOpen(state)
  }

  const handler = async (data: AddWishlistItemType) => {
    onAdd(data)
    handleClose(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit(handler)}>
          <DialogHeader>
            <DialogTitle>Add Item for {childName}</DialogTitle>
            <DialogDescription>Add a new item to {childName}'s wishlist for Secret Santa.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="child-item-name">Item Name *</Label>
              <Input
                id="child-item-name"
                placeholder="e.g., LEGO Castle Set"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="child-item-description">Description</Label>
              <Textarea
                id="child-item-description"
                placeholder="Add details like color, size, or specific features..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="child-item-url">Product URL</Label>
              <Input
                id="child-item-url"
                type="url"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="child-item-priority">Priority</Label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger id="child-item-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
