"use client"

import { Shuffle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { addDrawnNames, availableRecipientNames, deleteDrawnNames, fetchUsersAction } from "@/actions";
import { useEffect, startTransition, useState } from "react";
import { UserType } from "@/db/schema";
import { getCookie } from "@/utils";

export function DrawNamesSection() {
    const [exclusions, setExclusions] = useState<Record<string, UserType["id"][]>>({})

    const [drawError, setDrawError] = useState<string | null>(null)
    const [drawComplete, setDrawComplete] = useState(false)

    const handleDrawNames = async () => {
        setDrawError(null)
        await deleteDrawnNames()

        const recipients = await availableRecipientNames()

        // Create a copy of users array for manipulation
        const usersCopy = [...recipients]
        const availableRecipients = [...recipients]
        const assignments: { [key: string]: string } = {}

        // Shuffle function
        const shuffle = (array: typeof recipients) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1))
                ;[array[i], array[j]] = [array[j], array[i]]
            }
            return array
        }

        console.log("availableRecipients", availableRecipients)

        // Try to assign each user a recipient
        for (const giver of usersCopy) {

            let validRecipients: typeof recipients = []

            if(exclusions[giver.id]) {
                validRecipients = availableRecipients.filter(
                    (recipient) => recipient.id !== giver.id && !exclusions[giver.id].includes(recipient.id),
                )
            } else {
                validRecipients = availableRecipients.filter(
                    (recipient) => recipient.id !== giver.id,
                )
            }

            // Filter out invalid recipients (self and excluded users)
            if (validRecipients.length === 0) {
                setDrawError(
                    "Unable to complete the draw with current exclusions. Please review the exclude lists and try again.",
                )
                return
            }

            // Randomly select a valid recipient
            const shuffled = shuffle([...validRecipients])
            const selectedRecipient = shuffled[0]

            // Assign and remove from available pool
            console.log({
                giverId: giver.id,
                receiverId: selectedRecipient.id,
                isReceiverChild: Object.hasOwn(selectedRecipient, "email") ? 0 : 1
            })

            await addDrawnNames({
                giverId: giver.id,
                receiverId: selectedRecipient.id,
            })

            assignments[giver.id] = selectedRecipient.id
            const recipientIndex = availableRecipients.findIndex((r) => r.id === selectedRecipient.id)
            availableRecipients.splice(recipientIndex, 1)
        }

        // Update users with assignments
        const updatedUsers = recipients.map((user) => ({
            ...user,
            drawnPerson: assignments[user.id],
        }))

        console.log(updatedUsers)
        setDrawComplete(true)
    }

    useEffect(() => {
        startTransition(async () => {
        const list = getCookie("excludedUsersList");
        
        if(list) {
            setExclusions(JSON.parse(list) as Record<string, UserType["id"][]>)
        }
        })
    }, [])

    return (
        <>
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shuffle className="w-5 h-5 text-primary" />
                        Draw Names
                    </CardTitle>
                    <CardDescription>
                        Randomly assign Secret Santa pairs. Make sure all exclusions are set before drawing.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {drawError && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{drawError}</AlertDescription>
                        </Alert>
                    )}

                    {drawComplete && !drawError && (
                        <Alert className="mb-4 border-secondary bg-secondary/10">
                            <AlertDescription className="text-secondary-foreground">
                            Names have been drawn successfully! All participants have been assigned their Secret Santa match.
                            </AlertDescription>
                        </Alert>
                    )}

                    <Button  size="lg" className="gap-2" onClick={handleDrawNames}>
                        <Shuffle className="w-4 h-4" />
                        {drawComplete ? "Redraw Names" : "Draw Names"}
                    </Button>

                    {drawComplete && (
                        <p className="text-sm text-muted-foreground mt-3">
                        Click "Redraw Names" to generate new assignments. This will override current assignments.
                    </p>
                    )}
                </CardContent>
            </Card>
        </>
    )
}