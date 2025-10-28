import { Gift, Settings } from "lucide-react"
import { MyWishlist } from "@/components/my-wishlist"
import { ChildrenSection } from "@/components/children-section"
import { DrawnPersonWishlist } from "@/components/drawn-person-wishlist"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { env } from "@/env"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SignOut } from "@/components/sign-out"

export default async function SecretSantaPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if(!session) {
      redirect("/auth/signin")
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10">
                <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold text-balance">Secret Santa 2024</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Manage your holiday gift exchange</p>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3">
              {session.user.email === env.USER_ADMIN && <Link href="/admin">
                <Button variant="outline" size="sm" className="gap-1 sm:gap-2 bg-transparent text-xs sm:text-sm">
                  <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                  Admin
                </Button>
              </Link>}
              <SignOut />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6 sm:space-y-8">
            {env.FEAT_WISHLIST && <MyWishlist userId={session.user.id}/>}
            {env.FEAT_CHILDRENS && <ChildrenSection userId={session.user.id}/>}
          </div>

          {/* Right Column */}
          {env.FEAT_DRAWN && <div>
            <DrawnPersonWishlist userId={session.user.id}/>
          </div>}
        </div>
      </main>
    </div>
  )
}
