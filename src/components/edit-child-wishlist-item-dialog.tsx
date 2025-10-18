"use client"

import type React from "react"

import { useState, useEffect } from "react"
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

interface WishlistItem {
  id: string
  name: string
  description?: string
  url?: string
  priority: "low" | "medium" | "high"
}

interface EditChildWishlistItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  childName: string
  item: WishlistItem
  onEdit: (item: WishlistItem) => void
}

export function EditChildWishlistItemDialog({
  open,
  onOpenChange,
  childName,
  item,
  onEdit,
}: EditChildWishlistItemDialogProps) {
  const [name, setName] = useState(item.name)
  const [description, setDescription] = useState(item.description || "")
  const [url, setUrl] = useState(item.url || "")
  const [priority, setPriority] = useState<"low" | "medium" | "high">(item.priority)

  useEffect(() => {
    setName(item.name)
    setDescription(item.description || "")
    setUrl(item.url || "")
    setPriority(item.priority)
  }, [item])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onEdit({
      ...item,
      name: name.trim(),
      description: description.trim() || undefined,
      url: url.trim() || undefined,
      priority,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Item for {childName}</DialogTitle>
            <DialogDescription>Update the details of this wishlist item.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-child-item-name">Item Name *</Label>
              <Input
                id="edit-child-item-name"
                placeholder="e.g., LEGO Castle Set"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-child-item-description">Description</Label>
              <Textarea
                id="edit-child-item-description"
                placeholder="Add details like color, size, or specific features..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-child-item-url">Product URL</Label>
              <Input
                id="edit-child-item-url"
                type="url"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-child-item-priority">Priority</Label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger id="edit-child-item-priority">
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
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
