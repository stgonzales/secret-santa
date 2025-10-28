"use client"

import { signUp } from "@/lib/auth-client"
import { SignUpFormSchema } from "@/schemas"
import { SignUpFormType } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Label } from "@radix-ui/react-label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import Link from "next/link"
import { Check, Gift, Mail, User, X, Lock} from "lucide-react"

export function SignUpForm() {
    const router = useRouter()
    const { register, handleSubmit, watch, formState: { isSubmitting, errors }} = useForm({
      resolver: zodResolver(SignUpFormSchema)
    })
    const password = watch("password")

    const handler = async ({ firstName, lastName, passwordConfirmation, ...rest}: SignUpFormType) => {
      try {
        await signUp.email({
          ...rest,
          name: `${firstName} ${lastName}`
        }) 

        router.push('/')
      } catch (err) {
        console.log('Failed to create account. Please try again.', err)
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
          <h1 className="text-3xl font-bold text-balance mb-2">Join Secret Santa</h1>
          <p className="text-muted-foreground">Create your account to start gifting</p>
        </div>

        {/* Sign Up Card */}
        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Fill in your details to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handler)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...register("firstName")}
                    placeholder="John"
                    className="pl-10"
                  />
                </div>
                {errors.firstName && <span className="text-sm text-destructive">{errors.firstName.message}</span>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...register("lastName")}
                    placeholder="Doe"
                    className="pl-10"
                  />
                </div>
                {errors.lastName && <span className="text-sm text-destructive">{errors.lastName.message}</span>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...register("email")}
                    placeholder="john.doe@domain.com"
                     className="pl-10"
                  />
                </div>
                {errors.email && <span className="text-sm text-destructive">{errors.email.message}</span>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...register("password")}
                    type="password"
                    placeholder="Create a strong password"
                     className="pl-10"
                  />
                </div>
                {errors.password && <span className="text-sm text-destructive">{errors.password.message}</span>}
                <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
              </div>

              <ul className="space-y-2">
               <li className="text-xs flex gap-1 items-center">{/[a-z]+/.test(password) ? <Check size={18} className="text-chart-2"/> : <X size={18} className="text-destructive"/>} Pelo menos uma letra minúscula</li>
               <li className="text-xs flex gap-1 items-center">{/[A-Z]+/.test(password) ? <Check size={18} className="text-chart-2"/> : <X size={18} className="text-destructive"/>} Pelo menos uma letra maiúscula</li>
               <li className="text-xs flex gap-1 items-center">{/[0-9]+/.test(password) ? <Check size={18} className="text-chart-2"/> : <X size={18} className="text-destructive"/>} Pelo menos um número</li>
               <li className="text-xs flex gap-1 items-center">{/\W+/g.test(password) ? <Check size={18} className="text-chart-2"/> : <X size={18} className="text-destructive"/>} Pelo menos um caractere especial</li>
               <li className="text-xs flex gap-1 items-center">{/\S{8,}/.test(password) ? <Check size={18} className="text-chart-2"/> : <X size={18} className="text-destructive"/>} Mínimo de 8 caracteres</li>
             </ul>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    {...register("passwordConfirmation")}
                    type="password"
                     className="pl-10"
                  />
                </div>
                {errors.passwordConfirmation && <span className="text-sm text-destructive">{errors.passwordConfirmation.message}</span>}
              </div>

              <Button type="submit" className="w-full">
                Create Account
              </Button>
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
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )

    // return (
    //   <Card className="w-full max-w-md">
    //     <CardHeader className="space-y-1">
    //       <CardTitle className="text-2xl font-bold text-center">Criar uma conta</CardTitle>
    //       <CardDescription className="text-center">
    //         Insira suas informações para criar sua conta
    //       </CardDescription>
    //     </CardHeader>
    //     <form onSubmit={handleSubmit(handler)}>
    //       <CardContent className="space-y-4">
    //         <div className="grid grid-cols-2 gap-4">
    //           <div className="space-y-2">
    //             <Label htmlFor="firstName">Nome</Label>
    //             <Input
    //               {...register("firstName")}
    //               placeholder="John"
    //             />
    //             {errors.firstName && <span className="text-sm text-destructive">{errors.firstName.message}</span>}
    //           </div>
    //           <div className="space-y-2">
    //             <Label htmlFor="lastName">Sobrenome</Label>
    //             <Input
    //               {...register("lastName")}
    //               placeholder="Doe"
    //             />
    //             {errors.lastName && <span className="text-sm text-destructive">{errors.lastName.message}</span>}
    //           </div>
    //         </div>
    //         <div className="space-y-2">
    //           <Label htmlFor="email">Email</Label>
    //           <Input
    //             {...register("email")}
    //             placeholder="john@example.com"
    //           />
    //           {errors.email && <span className="text-sm text-destructive">{errors.email.message}</span>}
    //         </div>
    //         <div className="space-y-2">
    //           <Label htmlFor="password">Senha</Label>
    //           <Input
    //             {...register("password")}
    //             type="password"
    //             placeholder="Crie uma senha"
    //           />
    //           {errors.password && <span className="text-sm text-destructive">{errors.password.message}</span>}
    //         </div>
    //         <ul className="space-y-2">
    //           <li className="text-xs flex gap-1 items-center">{/[a-z]+/.test(password) ? <Check size={18} className="text-chart-2"/> : <X size={18} className="text-destructive"/>} Pelo menos uma letra minúscula</li>
    //           <li className="text-xs flex gap-1 items-center">{/[A-Z]+/.test(password) ? <Check size={18} className="text-chart-2"/> : <X size={18} className="text-destructive"/>} Pelo menos uma letra maiúscula</li>
    //           <li className="text-xs flex gap-1 items-center">{/[0-9]+/.test(password) ? <Check size={18} className="text-chart-2"/> : <X size={18} className="text-destructive"/>} Pelo menos um número</li>
    //           <li className="text-xs flex gap-1 items-center">{/\W+/g.test(password) ? <Check size={18} className="text-chart-2"/> : <X size={18} className="text-destructive"/>} Pelo menos um caractere especial</li>
    //           <li className="text-xs flex gap-1 items-center">{/\S{8,}/.test(password) ? <Check size={18} className="text-chart-2"/> : <X size={18} className="text-destructive"/>} Mínimo de 8 caracteres</li>
    //         </ul>
    //          <div className="space-y-2">
    //           <Label htmlFor="password">Confirme Senha</Label>
    //           <Input
    //             {...register("passwordConfirmation")}
    //             type="password"
    //           />
    //           {errors.passwordConfirmation && <span className="text-sm text-destructive">{errors.passwordConfirmation.message}</span>}
    //         </div>
    //       </CardContent>
    //       <CardFooter className="flex flex-col space-y-4">
    //         <Button type="submit" className="w-full" disabled={isSubmitting}>
    //           {isSubmitting ? 'Criando conta...' : 'Criar uma conta'}
    //         </Button>
    //         <p className="text-sm text-center text-muted-foreground">
    //           Ja tem uma conta?{' '}
    //           <Link href="/auth/signin" className="text-primary hover:underline">
    //             Entrar
    //           </Link>
    //         </p>
    //       </CardFooter>
    //     </form>
    //   </Card>
    // )
}