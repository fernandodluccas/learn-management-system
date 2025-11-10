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
import { signUp } from "@/lib/actions/auth-actions"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { redirect } from "next/navigation"

const schema = z
    .object({
        name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
        email: z.string().email("Endereço de e-mail inválido"),
        password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
    })

type FormValues = z.infer<typeof schema>

export default function RegisterPage() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const onSubmit = async (data: FormValues) => {
        try {
            const result = await signUp(data.name, data.email, data.password)

            toast.success("Conta criada com sucesso!", {
                description: "Agora você pode fazer login com suas credenciais.",
            })

            redirect("/")
        } catch (error: any) {
            toast.error("Erro ao criar conta", {
                description: error?.message || "Tente novamente em instantes.",
            })
        }
    }

    return (
        <div className={cn("flex min-h-screen items-center justify-center bg-gray-100 p-6")}>
            <div className={cn("w-full max-w-lg")}>
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Crie sua conta</CardTitle>
                        <CardDescription>Registre-se com o Google ou com seu e-mail</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid gap-4">
                                {/* Botão Google */}
                                <div className="flex flex-col gap-2">
                                    <Button variant="outline" type="button" className="justify-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                                            <path
                                                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                        Cadastrar com Google
                                    </Button>
                                </div>

                                {/* Separador */}
                                <div className="flex items-center">
                                    <div className="flex-1 h-px bg-border" />
                                    <span className="mx-3 text-sm text-muted-foreground">Ou continue com</span>
                                    <div className="flex-1 h-px bg-border" />
                                </div>

                                {/* Campos */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                                        Nome completo
                                    </label>
                                    <Input id="name" placeholder="Seu nome" {...register("name")} />
                                    {errors.name && (
                                        <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                                        E-mail
                                    </label>
                                    <Input id="email" type="email" placeholder="m@example.com" {...register("email")} />
                                    {errors.email && (
                                        <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium mb-1">
                                        Senha
                                    </label>
                                    <Input id="password" type="password" {...register("password")} />
                                    {errors.password && (
                                        <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                                        Confirmar senha
                                    </label>
                                    <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
                                    {errors.confirmPassword && (
                                        <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
                                    )}
                                </div>

                                {/* Botão */}
                                <div>
                                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Criando conta...
                                            </>
                                        ) : (
                                            "Criar conta"
                                        )}
                                    </Button>
                                </div>

                                {/* Link para login */}
                                <p className="text-center text-sm text-muted-foreground">
                                    Já tem uma conta?{" "}
                                    <Link href="/signin" className="underline">
                                        Entrar
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
