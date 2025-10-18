"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2, Users, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddChildDialog } from "@/components/add-child-dialog"
import { EditChildDialog } from "@/components/edit-child-dialog"
import { AddChildWishlistItemDialog } from "@/components/add-child-wishlist-item-dialog"
import { EditChildWishlistItemDialog } from "@/components/edit-child-wishlist-item-dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface WishlistItem {
  id: string
  name: string
  description?: string
  url?: string
  priority: "low" | "medium" | "high"
}

interface Child {
  id: string
  name: string
  age: number
  wishlist: WishlistItem[]
}

export function ChildrenSection() {
  const [children, setChildren] = useState<Child[]>([
    {
      id: "1",
      name: "Emma",
      age: 8,
      wishlist: [
        {
          id: "1",
          name: "LEGO Castle Set",
          description: "The big one with the dragon",
          priority: "high",
        },
      ],
    },
  ])
  const [expandedChildren, setExpandedChildren] = useState<Set<string>>(new Set(["1"]))
  const [isAddChildOpen, setIsAddChildOpen] = useState(false)
  const [editingChild, setEditingChild] = useState<Child | null>(null)
  const [addingWishlistForChild, setAddingWishlistForChild] = useState<string | null>(null)
  const [editingWishlistItem, setEditingWishlistItem] = useState<{
    childId: string
    item: WishlistItem
  } | null>(null)

  const toggleChild = (childId: string) => {
    const newExpanded = new Set(expandedChildren)
    if (newExpanded.has(childId)) {
      newExpanded.delete(childId)
    } else {
      newExpanded.add(childId)
    }
    setExpandedChildren(newExpanded)
  }

  const handleAddChild = (child: Omit<Child, "id" | "wishlist">) => {
    const newChild = { ...child, id: Date.now().toString(), wishlist: [] }
    setChildren([...children, newChild])
    setExpandedChildren(new Set([...expandedChildren, newChild.id]))
    setIsAddChildOpen(false)
  }

  const handleEditChild = (updatedChild: Child) => {
    setChildren(children.map((child) => (child.id === updatedChild.id ? updatedChild : child)))
    setEditingChild(null)
  }

  const handleDeleteChild = (id: string) => {
    setChildren(children.filter((child) => child.id !== id))
    const newExpanded = new Set(expandedChildren)
    newExpanded.delete(id)
    setExpandedChildren(newExpanded)
  }

  const handleAddWishlistItem = (childId: string, item: Omit<WishlistItem, "id">) => {
    setChildren(
      children.map((child) =>
        child.id === childId
          ? {
              ...child,
              wishlist: [...child.wishlist, { ...item, id: Date.now().toString() }],
            }
          : child,
      ),
    )
    setAddingWishlistForChild(null)
  }

  const handleEditWishlistItem = (childId: string, updatedItem: WishlistItem) => {
    setChildren(
      children.map((child) =>
        child.id === childId
          ? {
              ...child,
              wishlist: child.wishlist.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
            }
          : child,
      ),
    )
    setEditingWishlistItem(null)
  }

  const handleDeleteWishlistItem = (childId: string, itemId: string) => {
    setChildren(
      children.map((child) =>
        child.id === childId
          ? {
              ...child,
              wishlist: child.wishlist.filter((item) => item.id !== itemId),
            }
          : child,
      ),
    )
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
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-secondary" />
                Children
              </CardTitle>
              <CardDescription>Manage wishlists for your children</CardDescription>
            </div>
            <Button onClick={() => setIsAddChildOpen(true)} size="sm" variant="secondary">
              <Plus className="w-4 h-4 mr-2" />
              Add Child
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {children.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
              </div>
              <p className="text-muted-foreground mb-4">No children added yet</p>
              <Button onClick={() => setIsAddChildOpen(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Child
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {children.map((child) => (
                <Collapsible
                  key={child.id}
                  open={expandedChildren.has(child.id)}
                  onOpenChange={() => toggleChild(child.id)}
                >
                  <div className="rounded-lg border border-border bg-card">
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <CollapsibleTrigger className="flex items-center gap-2 flex-1 text-left hover:opacity-70 transition-opacity">
                          {expandedChildren.has(child.id) ? (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-card-foreground">{child.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                Age {child.age}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {child.wishlist.length} items
                              </Badge>
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingChild(child)}
                            className="h-8 w-8"
                          >
                            <Edit2 className="w-4 h-4" />
                            <span className="sr-only">Edit child</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteChild(child.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="sr-only">Delete child</span>
                          </Button>
                        </div>
                      </div>
                    </div>

                    <CollapsibleContent>
                      <div className="px-4 pb-4 pt-0 border-t border-border mt-4">
                        <div className="flex items-center justify-between mb-3 mt-4">
                          <h5 className="text-sm font-medium text-muted-foreground">Wishlist</h5>
                          <Button size="sm" variant="outline" onClick={() => setAddingWishlistForChild(child.id)}>
                            <Plus className="w-3 h-3 mr-1" />
                            Add Item
                          </Button>
                        </div>
                        {child.wishlist.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">No wishlist items yet</p>
                        ) : (
                          <div className="space-y-2">
                            {child.wishlist.map((item) => (
                              <div key={item.id} className="p-3 rounded-md bg-accent/50 border border-border">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h6 className="text-sm font-medium text-card-foreground">{item.name}</h6>
                                      <Badge variant="outline" className={`text-xs ${getPriorityColor(item.priority)}`}>
                                        {item.priority}
                                      </Badge>
                                    </div>
                                    {item.description && (
                                      <p className="text-xs text-muted-foreground mb-1">{item.description}</p>
                                    )}
                                    {item.url && (
                                      <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary hover:underline"
                                      >
                                        View product
                                      </a>
                                    )}
                                  </div>
                                  <div className="flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => setEditingWishlistItem({ childId: child.id, item })}
                                      className="h-7 w-7"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                      <span className="sr-only">Edit item</span>
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDeleteWishlistItem(child.id, item.id)}
                                      className="h-7 w-7 text-destructive hover:text-destructive"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      <span className="sr-only">Delete item</span>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddChildDialog open={isAddChildOpen} onOpenChange={setIsAddChildOpen} onAdd={handleAddChild} />
      {editingChild && (
        <EditChildDialog
          open={!!editingChild}
          onOpenChange={(open) => !open && setEditingChild(null)}
          child={editingChild}
          onEdit={handleEditChild}
        />
      )}
      {addingWishlistForChild && (
        <AddChildWishlistItemDialog
          open={!!addingWishlistForChild}
          onOpenChange={(open) => !open && setAddingWishlistForChild(null)}
          childName={children.find((c) => c.id === addingWishlistForChild)?.name || ""}
          onAdd={(item) => handleAddWishlistItem(addingWishlistForChild, item)}
        />
      )}
      {editingWishlistItem && (
        <EditChildWishlistItemDialog
          open={!!editingWishlistItem}
          onOpenChange={(open) => !open && setEditingWishlistItem(null)}
          childName={children.find((c) => c.id === editingWishlistItem.childId)?.name || ""}
          item={editingWishlistItem.item}
          onEdit={(item) => handleEditWishlistItem(editingWishlistItem.childId, item)}
        />
      )}
    </>
  )
}
