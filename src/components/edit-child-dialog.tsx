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

interface Child {
  id: string
  name: string
  age: number
  wishlist: any[]
}

interface EditChildDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  child: Child
  onEdit: (child: Child) => void
}

export function EditChildDialog({ open, onOpenChange, child, onEdit }: EditChildDialogProps) {
  const [name, setName] = useState(child.name)
  const [age, setAge] = useState(child.age.toString())

  useEffect(() => {
    setName(child.name)
    setAge(child.age.toString())
  }, [child])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !age) return

    onEdit({
      ...child,
      name: name.trim(),
      age: Number.parseInt(age),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Child</DialogTitle>
            <DialogDescription>Update the child's information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-child-name">Name *</Label>
              <Input
                id="edit-child-name"
                placeholder="e.g., Emma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-child-age">Age *</Label>
              <Input
                id="edit-child-age"
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
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
