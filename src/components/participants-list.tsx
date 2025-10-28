import { ManageExclusionsDialog } from "./manage-exclusions-dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { UserType } from "@/db/schema";
import { availableRecipientNames, fetchUsersAction } from "@/actions";
import { useState, useEffect, startTransition } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { UserX } from "lucide-react";
import { getCookie } from "@/utils";

export function ParticipantsList() {
    const [users, setUsers] = useState<{
        id: string;
        name: string;
    }[]>([])
    const [excludedUsers, setExcludedUsers] = useState<Record<string, UserType["id"][]>>({})
    const [recipients, setRecipients] = useState<{ id: string; name: string; }[]>([])

    const getExcludedNames = (id: string) => {
        console.log(id)
        const list = excludedUsers ? excludedUsers[id] : []

        if(list.length >= 1) {
            return users.map(u => list.includes(u.id) ? u.name.split(" ")[0] : "").filter(Boolean).join(", ")
        }

        return;
    }

    useEffect(() => {
        startTransition(async () => {
            const result = await availableRecipientNames()
            setUsers(result)

            const list = getCookie("excludedUsersList");

            if(list) {
                setExcludedUsers(JSON.parse(list) as Record<string, UserType["id"][]>)
            }

            const recipients = await availableRecipientNames()
            setRecipients(recipients)
        })
    }, [])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Participants & Exclusions</CardTitle>
                <CardDescription>
                Manage who each participant cannot draw. Common exclusions include spouses, family members, or roommates.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                {recipients.map((recipient) => (
                    <div
                        key={recipient.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                    >
                    <div className="flex items-center gap-4 flex-1">
                        <Avatar className="h-10 w-10 border-2 border-primary/20">
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                                {`${recipient.name.split(" ")[0][0].toUpperCase()} `}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-card-foreground">{recipient.name}</h4>
                                {/* {drawComplete && recipient.drawnPerson && (
                                <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                                    → {getDrawnPersonName(recipient.drawnPerson)}
                                </Badge>
                                )} */}
                            </div>
                            {/* <p className="text-sm text-muted-foreground">{recipient.email}</p> */}
                            {excludedUsers[recipient.id] && (
                                <div className="flex items-center gap-2 mt-2">
                                <UserX className="w-3 h-3 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">
                                    Cannot draw: {getExcludedNames(recipient.id)}
                                </p>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <ManageExclusionsDialog recipient={recipient} />
                    </div>
                ))}
                </div>
            </CardContent>
        </Card>
    )
}