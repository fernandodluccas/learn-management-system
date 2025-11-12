"use client"

import { ChevronDown, LogOut } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { useSession, signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export function Header() {
    const { data: session, isPending } = useSession()
    const router = useRouter()

    // Função para obter as iniciais do nome
    const getInitials = (name: string | undefined) => {
        if (!name) return "U"
        return name
            .split(" ")
            .map(word => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const handleSignOut = async () => {
        await signOut()
        router.push("/signin")
    }

    // Se ainda estiver carregando
    if (isPending) {
        return (
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background shadow-sm">
                <div className="flex items-center justify-between px-4 sm:px-6 py-4">
                    <Link href="/" className="flex flex-col gap-0 hover:opacity-80 transition-opacity cursor-pointer">
                        <h1 className="text-lg font-bold text-foreground">Learn Management System</h1>
                        <p className="text-xs sm:text-sm text-muted-foreground">Plataforma de Cursos</p>
                    </Link>
                    <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                </div>
            </header>
        )
    }

    const userName = session?.user?.name || "Usuário"
    const userEmail = session?.user?.email || ""
    const userInitials = getInitials(session?.user?.name)
    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background shadow-sm">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4">
                {/* Logo and Title */}
                <Link href="/" className="flex flex-col gap-0 hover:opacity-80 transition-opacity cursor-pointer">
                    <h1 className="text-lg font-bold text-foreground">Learn Management System</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">Plataforma de Cursos</p>
                </Link>

                {/* Profile Menu (simplified: only logout) */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 sm:gap-3 rounded-lg border border-border p-1.5 sm:p-2 transition-colors hover:bg-muted cursor-pointer">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                                    {userInitials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden sm:flex sm:flex-col sm:items-start sm:gap-0 text-left">
                                <p className="text-sm font-medium text-foreground">{userName}</p>
                                <p className="text-xs text-muted-foreground">{userEmail}</p>
                            </div>
                            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                            className="cursor-pointer text-destructive"
                            onClick={handleSignOut}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sair</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
