"use client"

import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function SignOut() {
    const { push } = useRouter()

    const handleSignOut = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    push("/auth/signin")
                }
            }
        })
    }

    return (
        <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" />
            Sign Out
        </Button>
    ) 
}