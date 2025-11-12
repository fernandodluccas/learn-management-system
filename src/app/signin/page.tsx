"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "@/lib/auth-client"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const schema = z.object({
    email: z.string().email("Endereço de e-mail inválido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
})

type FormValues = z.infer<typeof schema>

export default function LoginPage() {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (data: FormValues) => {
        try {
            const result = await authClient.signIn.email({
                email: data.email,
                password: data.password,
            })

            if (result.error) {
                toast.error("Erro ao entrar", {
                    description: result.error.message || "Verifique suas credenciais e tente novamente.",
                })
                return
            }

            toast.success("Login realizado com sucesso!", {
                description: "Bem-vindo de volta 👋",
            })

            // Redirecionar após o login
            router.push("/courses")
        } catch (error: any) {
            toast.error("Erro ao entrar", {
                description: error?.message || "Verifique suas credenciais e tente novamente.",
            })
        }
    }

    return (
        <div className={cn("flex min-h-screen items-center justify-center bg-gray-100 p-6")}>
            <div className={cn("w-full max-w-lg")}>
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Bem-vindo de volta</CardTitle>
                        <CardDescription>Entre com sua conta do Google ou e-mail</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid gap-4">
                                {/* Google Button */}
                                <div className="flex flex-col gap-2">
                                    <Button variant="outline" type="button" className="justify-center gap-3 cursor-pointer">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            className="h-4 w-4"
                                        >
                                            <path
                                                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                        Entrar com Google
                                    </Button>
                                </div>

                                {/* Divider */}
                                <div className="flex items-center">
                                    <div className="flex-1 h-px bg-border" />
                                    <span className="mx-3 text-sm text-muted-foreground">Ou continue com</span>
                                    <div className="flex-1 h-px bg-border" />
                                </div>

                                {/* E-mail */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                                        E-mail
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        {...register("email")}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                                    )}
                                </div>

                                {/* Senha */}
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password" className="block text-sm font-medium">
                                            Senha
                                        </label>
                                        <Link
                                            href="/forgot-password"
                                            className="text-xs text-muted-foreground underline hover:text-primary"
                                        >
                                            Esqueceu a senha?
                                        </Link>
                                    </div>
                                    <Input id="password" type="password" {...register("password")} />
                                    {errors.password && (
                                        <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                                    )}
                                </div>

                                {/* Botão Entrar */}
                                <div>
                                    <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Entrando...
                                            </>
                                        ) : (
                                            "Entrar"
                                        )}
                                    </Button>
                                </div>

                                {/* Link para cadastro */}
                                <p className="text-center text-sm text-muted-foreground">
                                    Não tem uma conta?{" "}
                                    <Link href="/signup" className="underline cursor-pointer hover:text-foreground">
                                        Cadastre-se
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
