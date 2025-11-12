"use client"

import { useEffect } from "react"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function Home() {
    const { data: session, isPending } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (!isPending) {
            if (session?.user) {
                // Se está logado, vai para /courses
                router.replace("/courses")
            } else {
                // Se não está logado, vai para /signin
                router.replace("/signin")
            }
        }
    }, [session, isPending, router])

    // Mostra loading enquanto verifica autenticação
    return (
        <main className="min-h-screen flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-muted-foreground">Carregando...</p>
            </div>
        </main>
    )
}
