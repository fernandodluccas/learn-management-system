"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface CourseCardProps {
    id: string
    title: string
    description?: string
    isStarted: boolean
    onContinue?: () => void
    onStart?: () => void
}

export function CourseCard({
    id,
    title,
    description,
    isStarted,
    onContinue,
    onStart,
}: CourseCardProps) {
    const [isHovered, setIsHovered] = useState(false)

    const handleAccess = () => {
        if (isStarted) {
            onContinue?.()
        } else {
            onStart?.()
        }
    }

    return (
        <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-300 cursor-pointer">
            {/* Thumbnail com Play Button */}
            <div
                className="relative w-full h-40 bg-muted overflow-hidden flex items-center justify-center group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleAccess}
            >
                <div className="w-full h-full bg-linear-to-br from-primary/10 to-primary/5" />

                {/* Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all">
                    <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity fill-white" />
                </div>

                {/* (Menu e badge removidos intencionalmente para simplificar) */}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-4">
                <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-2">{title}</h3>

                {/* Metadata (removido) */}

                {/* Description */}
                {description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{description}</p>}

                {/* Action Button */}
                <Button onClick={handleAccess} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Acessar curso
                </Button>
            </div>
        </Card>
    )
}
