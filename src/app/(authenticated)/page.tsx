import { Gift } from "lucide-react"
import { MyWishlist } from "@/components/my-wishlist"
import { ChildrenSection } from "@/components/children-section"
import { DrawnPersonWishlist } from "@/components/drawn-person-wishlist"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { env } from "@/env"

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
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
              <Gift className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-balance">Secret Santa 2025</h1>
              <p className="text-sm text-muted-foreground">Manage your gift exchange</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-8">
            {env.FEAT_WISHLIST && <MyWishlist userId={session.user.id}/>}
            {env.FEAT_CHILDRENS && <ChildrenSection userId={session.user.id}/>}
          </div>

          {/* Right Column */}
          {env.FEAT_DRAWN && <div>
            <DrawnPersonWishlist />
          </div>}
        </div>
      </main>
    </div>
  )
}
