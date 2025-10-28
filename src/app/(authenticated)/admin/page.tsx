"use client"

import { useState } from "react"
import { Gift, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserType } from "@/db/schema"
import { DrawNamesSection } from "@/components/draw-names-section"
import { ParticipantsList } from "@/components/participants-list"

export default function AdminPage() {
    const [users, setUsers] = useState<UserType[]>([])

    const [drawComplete, setDrawComplete] = useState(false)
    const [drawError, setDrawError] = useState<string | null>(null)
    const [selectedUser, setSelectedUser] = useState<Pick<UserType, "name" | "email" | "id"> | null>(null)

    const getExcludedNames = (excludedIds: string[]) => {
        return excludedIds.map((id) => users.find((u) => u.id === id)?.name || "Unknown").join(", ")
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                        <Gift className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-balance">Admin Panel</h1>
                        <p className="text-sm text-muted-foreground">Manage Secret Santa event</p>
                    </div>
                    </div>
                    <Link href="/">
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Button>
                    </Link>
                </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Draw Names Section */}
                <DrawNamesSection />

                {/* Participants List */}
                <ParticipantsList />
            </main>
        </div>
    )
}
