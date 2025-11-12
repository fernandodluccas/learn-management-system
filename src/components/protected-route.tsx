"use client"

import { useEffect } from "react"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
    children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { data: session, isPending } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (!isPending && !session?.user) {
            // Se não está logado, redireciona para login
            router.replace("/signin")
        }
    }, [session, isPending, router])

    // Se ainda está carregando ou não está autenticado, mostra loading
    if (isPending) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">Verificando autenticação...</p>
                </div>
            </main>
        )
    }

    // Se não está autenticado, não renderiza nada (vai redirecionar)
    if (!session?.user) {
        return null
    }

    // Se está autenticado, renderiza o conteúdo
    return <>{children}</>
}
