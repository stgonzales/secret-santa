"use client"

import { Label } from "@radix-ui/react-label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@/lib/auth-client";
import { SignInFormSchema } from "@/schemas";
import { SignInFormType } from "@/types";
import { Gift, Mail, Lock, Heart } from "lucide-react";

export function SignInForm() {
    const pathname = usePathname()

    const { register, handleSubmit, formState: { isSubmitting, errors }, setError } = useForm({
        resolver: zodResolver(SignInFormSchema)
    })

    const handler = async (formInput: SignInFormType) => {
        const { error } = await signIn.email({
            ...formInput,
            callbackURL: `${pathname}/`
        })

        if(error) {
            console.error(error)
            setError("root",{ type: "value", message: error.code === "INVALID_EMAIL_OR_PASSWORD" ? "Email and Password combination invalid!" : "Error trying to authenticate" })
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                    <Gift className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-balance mb-2">Welcome Back</h1>
                <p className="text-muted-foreground">Sign in to your Secret Santa account</p>
                </div>

                {/* Sign In Card */}
                <Card>
                <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(handler)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            {...register("email")}
                            placeholder="john.doe@domain.com"
                            className="pl-10"
                        />
                        {errors.email && <span className="text-sm text-destructive">{errors.email.message}</span>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        </div>
                        <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            {...register("password")}
                            placeholder="Enter your password"
                            type="password"
                            className="pl-10"
                        />
                        {errors.password && <span className="text-sm text-destructive">{errors.password.message}</span>}
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Authenticating...' : 'Sign in'}
                    </Button>
                    {errors.root && <span className="text-sm text-destructive">{errors.root.message}</span>}
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or</span>
                    </div>
                    </div>
                    <p className="text-sm text-center text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="/auth/signup" className="text-primary font-medium hover:underline">
                        Sign up
                    </Link>
                    </p>
                </CardFooter>
                </Card>

                {/* Footer */}
                <p className="text-center text-sm text-muted-foreground mt-8 flex justify-center items-center gap-1">
                    with <span><Heart className="stroke-primary w-4 h-4"/></span> by @stgonzales!
                </p>
            </div>
        </div>
    )
    
    // return (
    //      <Card className="w-full max-w-md">
    //         <CardHeader className="space-y-1">
    //             <CardTitle className="text-2xl font-bold text-center">Entrar</CardTitle>
    //             <CardDescription className="text-center">
    //                 Digite seu e-mail e senha para acessar sua conta
    //             </CardDescription>
    //         </CardHeader>
    //         <form onSubmit={handleSubmit(handler)}>
    //             <CardContent className="space-y-4">
    //                 <div className="space-y-2">
    //                     <Label htmlFor="email">Email</Label>
    //                     <Input
    //                         {...register("email")}
    //                         placeholder="Digite seu email"
    //                     />
    //                     {errors.email && <span className="text-sm text-destructive">{errors.email.message}</span>}
    //                 </div>
    //                 <div className="space-y-2">
    //                     <Label htmlFor="password">Senha</Label>
                        // <Input
                        //     {...register("password")}
                        //     placeholder="Digite sua senha"
                        //     type="password"
                        // />
    //                     {errors.password && <span className="text-sm text-destructive">{errors.password.message}</span>}
    //                 </div>
    //             </CardContent>
    //             <CardFooter className="flex flex-col space-y-4">
                    // <Button type="submit" className="w-full" disabled={isSubmitting}>
                    //     {isSubmitting ? 'Entrando...' : 'Entrar'}
                    // </Button>
    //                 <p className="text-sm text-center text-muted-foreground">
    //                     {"Não tem uma conta? "}
    //                     <Link href="/auth/signup" className="text-primary hover:underline">
    //                         Me cadastrar
    //                     </Link>
    //                 </p>
    //                 {errors.root && <span className="text-sm text-destructive">{errors.root.message}</span>}
    //             </CardFooter>
    //         </form>
    //     </Card>
    // )
}