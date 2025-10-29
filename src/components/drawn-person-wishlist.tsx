"use client"

import { Sparkles, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getPriorityColor } from "@/utils"
import { startTransition, useEffect, useState } from "react"
import { fetchChildrensPerUserAction, fetchUserReceiverName } from "@/actions"
import { ChildrenType, UserType, WishlistItemType } from "@/db/schema"

export function DrawnPersonWishlist({ userId }: { userId: UserType["id"] }) {
  const [drawnPerson, setDrawnPerson] = useState<{ id: string; name: string } | undefined>();
  const [childrens, setChildrens] = useState<Record<string, { childName: string; receiverName: string; wishlist: Pick<WishlistItemType,  "id" | "name" | "url" | "description" | "priority">[]}>[]>([]);
  const [receiverWishlist, setReceiverWishlist] = useState<Pick<WishlistItemType,  "id" | "name" | "url" | "description" | "priority">[] | undefined>();

  useEffect(() => {
    startTransition(async () => {
      const receiver = await fetchUserReceiverName(userId)

      if(receiver) {
        setDrawnPerson(receiver[0])
        setReceiverWishlist(receiver[1])

        const userChildrens = await fetchChildrensPerUserAction({ userId })

        if(userChildrens[0]) {
          for (const child of userChildrens) {
            const childReceiver = await fetchUserReceiverName(child.id)

            if(childReceiver) {
              setChildrens((c) => [
                ...c,
                {
                  [child.id]: {
                    childName: child.name,
                    receiverName: childReceiver[0].name,
                    wishlist: childReceiver[1]
                  }
                }
              ])
            }
          }
        }
      }
    })
  }, [])

  if(!drawnPerson) return null;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">{`${drawnPerson.name.split(" ")[0][0].toUpperCase()}`}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Your Secret Santa Match
              </CardTitle>
              <CardDescription className="mt-1">
                You're buying for <span className="font-semibold text-foreground">{drawnPerson.name}</span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {receiverWishlist && receiverWishlist.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h4 className="font-semibold text-card-foreground flex-1">{item.name}</h4>
                  <Badge variant="outline" className={getPriorityColor(item.priority)}>
                    {item.priority}
                  </Badge>
                </div>
                {item.description && <p className="text-sm text-muted-foreground mb-3">{item.description}</p>}
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    View product
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-accent/30 border border-border">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">💡 Tip:</span> Items marked as "high" priority are what they
              want most. Consider their preferences and budget when choosing!
            </p>
          </div>
        </CardContent>
      </Card>

      {childrens.length >= 1 && childrens.map((child) => {
        const id = Object.keys(child)[0]

        const childFirstName = child[id].childName.split(" ")[0]
        const receiverName = child[id].receiverName
        const receiverInitials = `${receiverName.split(" ")[0][0].toUpperCase()}`
        const receiverWishlist = child[id].wishlist

        return (
          <Card key={id}>
            <CardHeader>
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm sm:text-base font-semibold">{receiverInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    {`${childFirstName}'s Secret Santa Match`}
                  </CardTitle>
                  <CardDescription className="mt-1 text-sm">
                    {`${childFirstName} is buying for`}{" "}
                    <span className="font-semibold text-foreground">{receiverName}</span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {receiverWishlist.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 sm:p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h4 className="font-semibold text-sm sm:text-base text-card-foreground flex-1">{item.name}</h4>
                      <Badge variant="outline" className={`text-xs sm:text-sm ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </Badge>
                    </div>
                    {item.description && <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">{item.description}</p>}
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs sm:text-sm text-primary hover:underline"
                      >
                        View product
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg bg-accent/30 border border-border">
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">💡 Tip:</span> Items marked as "high" priority are what they
                  want most. Consider their preferences and budget when choosing!
                </p>
              </div>
            </CardContent>
          </Card>
        )})}
    </div>
  )
}
