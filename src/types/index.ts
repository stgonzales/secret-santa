import { z } from "zod";
import { NewChildrenSchema, AddWishlistItemSchema, SignInFormSchema, SignUpFormSchema } from "@/schemas";
import { $ZodErrorTree } from "zod/v4/core";

export type ActionResponse<T> = {
    message?: string
    data?: T
    errors?: $ZodErrorTree<T>
}

export type SignInFormType = z.infer<typeof SignInFormSchema>
export type SignUpFormType = z.infer<typeof SignUpFormSchema>
export type NewChildrenType = z.infer<typeof NewChildrenSchema>
export type AddWishlistItemType = z.infer<typeof AddWishlistItemSchema>