"use client"

import { Sparkles, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface WishlistItem {
  id: string
  name: string
  description?: string
  url?: string
  priority: "low" | "medium" | "high"
}

export function DrawnPersonWishlist() {
  // Mock data - in real app this would come from the drawn person
  const drawnPerson = {
    name: "Sarah Johnson",
    initials: "SJ",
    wishlist: [
      {
        id: "1",
        name: "Yoga Mat",
        description: "Extra thick, non-slip, purple or teal color",
        url: "https://example.com/yoga-mat",
        priority: "high" as const,
      },
      {
        id: "2",
        name: "Essential Oil Diffuser",
        description: "Modern design, works with Alexa",
        priority: "medium" as const,
      },
      {
        id: "3",
        name: "Cookbook",
        description: "Mediterranean or Asian cuisine",
        priority: "low" as const,
      },
    ],
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-primary/10 text-primary border-primary/20"
      case "medium":
        return "bg-secondary/10 text-secondary border-secondary/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <Avatar className="h-12 w-12 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">{drawnPerson.initials}</AvatarFallback>
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
          {drawnPerson.wishlist.map((item) => (
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
  )
}
