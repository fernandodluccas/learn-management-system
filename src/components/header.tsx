"use client"

import { ChevronDown, LogOut } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"

interface HeaderProps {
    userName?: string
    userEmail?: string
    userInitials?: string
}

export function Header({
    userName = "Nome do Usuário",
    userEmail = "email.do.usuario@exemplo.com",
    userInitials = "U",
}: HeaderProps) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background shadow-sm">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4">
                {/* Logo and Title */}
                <Link href="/" className="flex flex-col gap-0 hover:opacity-80 transition-opacity">
                    <h1 className="text-lg font-bold text-foreground">Learn Management System</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">Plataforma de Cursos</p>
                </Link>

                {/* Profile Menu (simplified: only logout) */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 sm:gap-3 rounded-lg border border-border p-1.5 sm:p-2 transition-colors hover:bg-muted">
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
                        <DropdownMenuItem className="cursor-pointer text-destructive">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sair</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
