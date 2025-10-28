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
        <Button variant="outline" size="sm" className="gap-1 sm:gap-2 bg-transparent text-xs sm:text-sm" onClick={handleSignOut}>
            <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
            Sign Out
        </Button>
    ) 
}