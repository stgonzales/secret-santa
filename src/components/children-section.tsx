"use client"

import { startTransition, useEffect, useState } from "react"
import { Plus, Edit2, Trash2, Users, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddChildDialog } from "@/components/add-child-dialog"
import { EditChildDialog } from "@/components/edit-child-dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChildrenType, UserType, WishlistItemType } from "@/db/schema"
import { getPriorityColor } from "@/utils"
import { AddWishlistItemType, NewChildrenType } from "@/types"
import { addChildAction, addWishlistItemAction, deleteChildAction, deleteWishlistItemAction, editChildAction, editWishlistItemAction, fetchChildrensPerUserAction, fetchWishlistAction } from "@/actions"
import { AddWishlistItemDialog } from "./add-wishlist-item-dialog"
import { EditWishlistItemDialog } from "./edit-wishlist-item-dialog"

export function ChildrenSection({ userId }: { userId: UserType["id"] }) {
  const [childrens, setChildrens] = useState<ChildrenType[]>([])
  const [childrensWishlist, setChildrensWishlsit] = useState<Record<string, WishlistItemType[]>>({})
  const [expandedChildren, setExpandedChildren] = useState<Set<string>>(new Set())

  const toggleChild = (childId: string) => {
    const newExpanded = new Set(expandedChildren)
    if (newExpanded.has(childId)) {
      newExpanded.delete(childId)
    } else {
      newExpanded.add(childId)
    }
    setExpandedChildren(newExpanded)
  }

  const handleAddChild = async (child: NewChildrenType) => {
    const [ newChild ] = await addChildAction({
      data: {
        ...child,
        userId,
      },
    })

    setChildrens((v) => [
      ...v,
      newChild,
    ])

    setExpandedChildren(new Set([...expandedChildren, newChild.id]))
  }

  const handleEditChild = async ({ id, createdAt, updatedAt, ...rest}: ChildrenType) => {
    const [ updatedChild ] = await editChildAction({
      data: {
        ...rest,
        receiverId: userId
      },
      childId: id,
    })

    setChildrens(childrens.map((child) => (child.id === updatedChild.id ? updatedChild : child)))
  }

  const handleDeleteChild = async (childId: string) => {
    await deleteChildAction({ childId, userId })
    const newExpanded = new Set(expandedChildren)
    newExpanded.delete(childId)
    setExpandedChildren(newExpanded)
    setChildrens(childrens.filter(c => c.id !== childId))
  }

  const handleAddChildWishlistItem = async (item: AddWishlistItemType, childId?: string) => {
    if(childId) {
      const [newItem] = await addWishlistItemAction({
        data: {
          ...item,
          receiverId: childId,
        },
      })

      setChildrensWishlsit({
        ...childrensWishlist,
        ...childId && { [childId]: [...(childrensWishlist[newItem.id] ?? []), newItem] },
      })
    }
  }

  const handleEditChildWishlistItem = async (editedItem: WishlistItemType, receiverId: string) => {
    const [ item ] = await editWishlistItemAction({
      data: {
        ...editedItem,
        receiverId,
      },
    })
    
    const childWishlistItemIndex = childrensWishlist[receiverId].findIndex(i => i.id === receiverId)
    const newList = [ ...childrensWishlist[receiverId]]
    newList[childWishlistItemIndex] = item

    setChildrensWishlsit({
      ...childrensWishlist,
      [receiverId]: newList,
    })
  }

  const handleDeleteChildWishlistItem = async (childId: string, itemId: string) => {
    await deleteWishlistItemAction({ itemId, receiverId: childId })

    const updatedList = childrensWishlist

    delete updatedList[childId]

    setChildrensWishlsit(updatedList)
  }

  useEffect(() => {
    startTransition(async () => {
      const childrens = await fetchChildrensPerUserAction({ userId })
      setChildrens(childrens)

      if(childrens[0]) {
        let userChildrensWishlist: Record<string, WishlistItemType[]> = {}

        for (let i = 0; i < childrens.length; i++) {
          const childWishlist = await fetchWishlistAction({ receiverId: childrens[i].id })
          userChildrensWishlist[childrens[i].id] = childWishlist
        }
        
        setChildrensWishlsit(userChildrensWishlist)
      }
    })
  }, [])

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
            <AddChildDialog onAdd={handleAddChild} />
          </div>
        </CardHeader>
        <CardContent>
          {childrens.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
              </div>
              <p className="text-muted-foreground mb-4">No children added yet</p>
              {/* <AddChildDialog onAdd={handleAddChild} /> */}
            </div>
          ) : (
            <div className="space-y-3">
              {childrens.map((child) => (
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
                                {childrensWishlist[child.id] ? childrensWishlist[child.id].length : 0} items
                              </Badge>
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        <div className="flex gap-1">
                          <EditChildDialog
                            child={child}
                            onEdit={handleEditChild}
                          />
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
                          <AddWishlistItemDialog
                            onAdd={handleAddChildWishlistItem}
                            child={child}
                          />
                        </div>
                        {childrensWishlist[child.id] && childrensWishlist[child.id].length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">No wishlist items yet</p>
                        ) : (
                          <div className="space-y-2">
                            {childrensWishlist[child.id] && childrensWishlist[child.id].map((item) => (
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
                                    <EditWishlistItemDialog
                                      item={item}
                                      receiverId={child.id}
                                      onEdit={handleEditChildWishlistItem}
                                    />
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDeleteChildWishlistItem(child.id, item.id)}
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

    </>
  )
}
