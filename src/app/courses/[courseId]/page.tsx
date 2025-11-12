"use client"

import { useState, useEffect, use } from "react"
import { Header } from "@/components/header"
import { CourseSidebar } from "@/components/course-sidebar"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/protected-route"

type Lesson = {
    id: string
    title: string
    description: string | null
    videoUrl: string | null
    videoBlobId: string | null
}

type Discipline = {
    id: string
    title: string
    lessons: Lesson[]
}

type Course = {
    id: string
    title: string
    description: string | null
    disciplines: Discipline[]
}

export default function CoursePlayerPage({
    params,
}: {
    params: Promise<{ courseId: string }>
}) {
    const { courseId } = use(params)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null)
    const [course, setCourse] = useState<Course | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchCourse()
    }, [courseId])

    const fetchCourse = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch(`/api/courses/${courseId}`)

            if (!response.ok) {
                throw new Error("Erro ao buscar curso")
            }

            const data = await response.json()
            setCourse(data.course)

            // Set first lesson as selected by default
            if (data.course.disciplines.length > 0 && data.course.disciplines[0].lessons.length > 0) {
                setSelectedLessonId(data.course.disciplines[0].lessons[0].id)
            }
        } catch (err) {
            console.error("Error fetching course:", err)
            setError(err instanceof Error ? err.message : "Erro ao carregar curso")
        } finally {
            setLoading(false)
        }
    }

    // Find selected lesson
    const selectedLesson = course?.disciplines
        .flatMap((d) => d.lessons)
        .find((l) => l.id === selectedLessonId)

    if (loading) {
        return (
            <ProtectedRoute>
                <main className="min-h-screen bg-background">
                    <Header />
                    <div className="flex items-center justify-center h-[calc(100vh-4rem)] pt-16">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="w-12 h-12 animate-spin text-primary" />
                            <p className="text-muted-foreground">Carregando curso...</p>
                        </div>
                    </div>
                </main>
            </ProtectedRoute>
        )
    }

    if (error || !course) {
        return (
            <ProtectedRoute>
                <main className="min-h-screen bg-background">
                    <Header />
                    <div className="flex items-center justify-center h-[calc(100vh-4rem)] pt-16">
                        <div className="text-center">
                            <p className="text-destructive mb-4">{error || "Curso não encontrado"}</p>
                            <Button onClick={fetchCourse} variant="outline">
                                Tentar novamente
                            </Button>
                        </div>
                    </div>
                </main>
            </ProtectedRoute>
        )
    }

    return (
        <ProtectedRoute>
            <main className="min-h-screen bg-background">
                <Header />
                <div className="flex pt-16 lg:pt-20">
                    {/* Sidebar */}
                    <CourseSidebar
                        courseName={course.title}
                        modules={course.disciplines.map((discipline) => ({
                            id: discipline.id,
                            title: discipline.title,
                            lessons: discipline.lessons.map((lesson) => ({
                                id: lesson.id,
                                title: lesson.title,
                                duration: "", // TODO: Calcular duração do vídeo
                                completed: false, // TODO: Implementar sistema de progresso
                                description: lesson.description || "",
                                videoUrl: lesson.videoUrl || "",
                            })),
                        }))}
                        onLessonSelect={setSelectedLessonId}
                        selectedLessonId={selectedLessonId}
                        isOpen={sidebarOpen}
                        onToggle={setSidebarOpen}
                    />

                    {/* Main Content */}
                    <div className="flex-1 w-full min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-5rem)]">
                        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                            {/* Video Player */}
                            <div className="mb-6 sm:mb-8">
                                <div className="w-full bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center mb-4 sm:mb-6">
                                    {selectedLesson?.videoUrl ? (
                                        <video key={selectedLesson?.id} className="w-full h-full" controls crossOrigin="anonymous">
                                            <source src={selectedLesson.videoUrl} type="video/mp4" />
                                            Seu navegador não suporta reprodução de vídeo.
                                        </video>
                                    ) : (
                                        <div className="text-white text-center p-8">
                                            <p className="text-lg mb-2">Vídeo não disponível</p>
                                            <p className="text-sm text-gray-400">Este conteúdo ainda não possui um vídeo.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Lesson Info */}
                                {selectedLesson && (
                                    <div className="mb-6 sm:mb-8">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-2">
                                            <div className="flex-1">
                                                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{selectedLesson.title}</h2>
                                            </div>
                                        </div>

                                        {/* About This Lesson */}
                                        {selectedLesson.description && (
                                            <Card className="p-4 sm:p-6 mb-6 sm:mb-8">
                                                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3">Sobre esta aula</h3>
                                                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                                    {selectedLesson.description}
                                                </p>
                                            </Card>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </ProtectedRoute>
    )
}
