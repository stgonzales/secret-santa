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
import { NewChildrenSchema } from "@/schemas"
import { NewChildrenType } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ChildrenType } from "@/db/schema"
import { Edit2 } from "lucide-react"

type EditChildDialogProps = {
  child: ChildrenType
  onEdit: (child: ChildrenType) => void
}

export function EditChildDialog({ child, onEdit }: EditChildDialogProps) {
  const { handleSubmit, register, reset } = useForm({
    resolver: zodResolver(NewChildrenSchema),
    defaultValues: {
      firstName: child.name.split(" ")[0],
      lastName: child.name.split(" ")[1],
      age: child.age.toString(),
    }
  })
  const [open, setOpen] = useState(false)

  const handleClose = (value: boolean) => {
    setOpen(value)
    reset()
  }

  const handler = (data: NewChildrenType) => {
    onEdit({
      ...child,
      ...data,
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <Edit2 className="w-4 h-4" />
          <span className="sr-only">Edit child</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(handler)}>
          <DialogHeader>
            <DialogTitle>Edit Child</DialogTitle>
            <DialogDescription>Update the child's information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-child-name">Name *</Label>
              <Input
                {...register("firstName")}
                placeholder="e.g., Emma"
              />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="edit-child-name">Name *</Label>
              <Input
                {...register("lastName")}
                placeholder="e.g., Emma"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-child-age">Age *</Label>
              <Input
                {...register("age")}
                type="number"
                min="1"
                max="18"
                placeholder="e.g., 8"
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
