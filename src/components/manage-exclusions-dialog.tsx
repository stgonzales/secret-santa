"use client"

import { startTransition, useEffect, useState } from "react"
import { UserX } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UserType } from "@/db/schema"
import { getCookie, setCookie } from "@/utils"
import { availableRecipientNames } from "@/actions"

interface ManageExclusionsDialogProps {
  recipient: { id: string; name: string; }
}

export function ManageExclusionsDialog({ recipient }: ManageExclusionsDialogProps) {
    const [open, setOpen] = useState(false)
    const [selectedExclusions, setSelectedExclusions] = useState<Record<string, UserType["id"][]>>({})
    const [recipients, setRecipients] = useState<{ id: string; name: string; }[]>([])

    const handleToggleExclusion = (userId: string) => {
        setSelectedExclusions((prev) => {
            if(prev[recipient.id]){
                if(prev[recipient.id].includes(userId)){
                    return {
                        ...prev,
                        [recipient.id]: prev[recipient.id].filter(i => i !== userId)
                    } 
                } else {
                    return {
                        ...prev,
                        [recipient.id]: [...prev[recipient.id], userId]
                    }
                }
            }

            return {
                ...prev,
                [recipient.id]: [userId]
            }
        })
    }

    const handleSave = () => {
        setCookie("excludedUsersList", JSON.stringify(selectedExclusions))
        setOpen(false)
    }

    useEffect(() => {
        startTransition(async () => {
            const list = getCookie("excludedUsersList");

            if(list) {
                setSelectedExclusions(JSON.parse(list) as Record<string, UserType["id"][]>)
            }

            const recipients = await availableRecipientNames()
            setRecipients(recipients)
        })
    }, [])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-2">
                    <UserX className="w-4 h-4" />
                    Manage Exclusions
                </Button>
            </DialogTrigger>
        <DialogContent className="max-w-md">
            <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
                <UserX className="w-5 h-5 text-primary" />
                Manage Exclusions for {recipient.name}
            </DialogTitle>
            <DialogDescription>
                Select users that {recipient.name} cannot draw. They will not be assigned to each other.
            </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 max-h-[400px] overflow-y-auto py-2">
                {recipients.map((r) => (
                    <div
                        key={r.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                    >
                    <Checkbox
                        id={`exclude-${r.id}`}
                        checked={selectedExclusions[recipient.id] && selectedExclusions[recipient.id].includes(r.id)}
                        onCheckedChange={() => handleToggleExclusion(r.id)}
                    />
                    <Label htmlFor={`exclude-${r.id}`} className="flex items-center gap-3 flex-1 cursor-pointer">
                        <Avatar className="h-8 w-8 border border-border">
                            <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                                {`${r.name.split(" ")[0][0].toUpperCase()} ${r.name.split(" ")[1] ? r.name.split(" ")[1][0].toUpperCase() : ""}`}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium text-sm">{r.name}</p>
                            {/* <p className="text-xs text-muted-foreground">{u.email}</p> */}
                        </div>
                    </Label>
                    </div>
                ))}
            </div>

            <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
            </Button>
            <Button onClick={handleSave}>Save Exclusions</Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    )
}
