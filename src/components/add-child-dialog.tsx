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
import { useForm } from "react-hook-form"
import { NewChildrenSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { NewChildrenType } from "@/types"
import { Plus } from "lucide-react"

type AddChildDialogProps = {
  onAdd: (child: NewChildrenType) => void
}

export function AddChildDialog({ onAdd }: AddChildDialogProps) {
  const { handleSubmit, register, reset } = useForm({
    resolver: zodResolver(NewChildrenSchema),
  })
  const [open, setOpen] = useState(false)

  const handleClose = (value: boolean) => {
    setOpen(value)
    reset()
  }

  const handler = (data: NewChildrenType) => {
    onAdd(data)
    handleClose(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Plus className="w-4 h-4 mr-2" />
          Add Child
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(handler)}>
          <DialogHeader>
            <DialogTitle>Add Child</DialogTitle>
            <DialogDescription>Add a child to manage their wishlist for Secret Santa.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="child-name">Child First Name *</Label>
              <Input
                {...register("firstName")}
                placeholder="e.g., Emma"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="child-name">Child Last Name *</Label>
              <Input
                {...register("lastName")}
                placeholder="e.g., Emma"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="child-age">Age *</Label>
              <Input
                {...register("age")}
                type="number"
                min={0}
                max={12}
                placeholder="e.g., 8"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Child</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
