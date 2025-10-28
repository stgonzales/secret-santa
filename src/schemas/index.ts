import { z } from "zod";

const invalidEmailMessage = "Invalid email"

export const SignInFormSchema = z.object({
    email: z.email({
        message: invalidEmailMessage
    }),
    password: z.string()
    .min(1, { 
        message: "Enter your password"
    })
})

export const SignUpFormSchema = z.object({
    firstName: z.string().min(1, {
        message: "Please enter you first name"
    }),
    lastName: z.string().min(1, {
        message: "Please enter you last name"
    }),
    email: z.email({
        message: invalidEmailMessage
    }),
    password: z.string()
    .min(8, { 
        message: "Password too short, use a password between 8 and 48 caracters"
    })
    .max(48, { 
        message: "Password too long, use a password between 8 and 48 caracters"
    }),
    passwordConfirmation: z.string().min(1, {
        message: "Confirm your password"
    })
}).refine((data) => data.password === data.passwordConfirmation, {
    message: "Password does not match",
    path: ["passwordConfirmation"],
})

export const AddWishlistItemSchema = z.object({
    name: z.string().min(1, "Please type item name"),
    description: z.string().nullish(),
    priority: z.enum(["low", "medium", "high"]).default("low"),
    url: z.preprocess(val => val === "" ? undefined : val, z.url().nullish()),
})

export const NewChildrenSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    age: z.string().transform(v => Number(v)).refine(v => v >= 0 || v <= 12, "Children age should be between 0 and 12"),
})