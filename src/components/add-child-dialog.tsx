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

interface AddChildDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (child: { name: string; age: number }) => void
}

export function AddChildDialog({ open, onOpenChange, onAdd }: AddChildDialogProps) {
  const [name, setName] = useState("")
  const [age, setAge] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !age) return

    onAdd({
      name: name.trim(),
      age: Number.parseInt(age),
    })

    // Reset form
    setName("")
    setAge("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Child</DialogTitle>
            <DialogDescription>Add a child to manage their wishlist for Secret Santa.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="child-name">Name *</Label>
              <Input
                id="child-name"
                placeholder="e.g., Emma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="child-age">Age *</Label>
              <Input
                id="child-age"
                type="number"
                min="1"
                max="18"
                placeholder="e.g., 8"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Child</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
