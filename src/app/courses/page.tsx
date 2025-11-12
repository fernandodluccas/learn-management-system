"use client"

import { Header } from "@/components/header"
import { CourseCard } from "@/components/course-card"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/protected-route"
import Link from "next/link"
import { Plus, Loader2, BookOpen, GraduationCap, Video, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type Lesson = {
    id: string
    title: string
    description: string | null
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
    createdAt: string
    updatedAt: string
}

export default function CoursesPage() {
    const router = useRouter()
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchCourses()
    }, [])

    const fetchCourses = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch("/api/courses")

            if (!response.ok) {
                throw new Error("Erro ao buscar cursos")
            }

            const data = await response.json()
            setCourses(data.courses || [])
        } catch (err) {
            console.error("Error fetching courses:", err)
            setError(err instanceof Error ? err.message : "Erro ao carregar cursos")
        } finally {
            setLoading(false)
        }
    }

    // Calcula estatísticas do curso
    const getCourseStats = (course: Course) => {
        const disciplinesCount = course.disciplines.length
        const lessonsCount = course.disciplines.reduce(
            (total, discipline) => total + discipline.lessons.length,
            0
        )
        return { disciplinesCount, lessonsCount }
    }

    return (
        <ProtectedRoute>
            <main className="min-h-screen bg-background">
                {/* Header global */}
                <Header />

                {/* Conteúdo principal */}
                <div className="pt-20 px-4 sm:px-6 pb-12">
                    {/* Título e botão */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4 mt-8">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Meus Cursos</h2>
                            <p className="text-base text-muted-foreground">
                                Continue seu aprendizado de onde parou
                            </p>
                        </div>

                        <Link href="/create-course" className="w-full sm:w-auto">
                            <Button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer">
                                <Plus className="w-4 h-4" />
                                Novo Curso
                            </Button>
                        </Link>
                    </div>

                    {/* Grade de cursos */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="flex flex-col items-center gap-4">
                                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                                <p className="text-muted-foreground">Carregando cursos...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <p className="text-destructive mb-4">{error}</p>
                                <Button onClick={fetchCourses} variant="outline">
                                    Tentar novamente
                                </Button>
                            </div>
                        </div>
                    ) : courses.length === 0 ? (
                        <div className="flex items-center justify-center py-20 sm:py-32">
                            <div className="text-center max-w-md px-4">
                                {/* Ícone simples */}
                                <div className="mb-6 flex justify-center">
                                    <div className="p-6 rounded-2xl bg-muted/50">
                                        <BookOpen className="w-16 h-16 text-muted-foreground/60" strokeWidth={1.5} />
                                    </div>
                                </div>

                                {/* Título e descrição */}
                                <h3 className="text-xl font-semibold text-foreground mb-3">
                                    Nenhum curso ainda
                                </h3>
                                <p className="text-sm text-muted-foreground mb-8">
                                    Comece criando seu primeiro curso
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {courses.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    id={course.id}
                                    title={course.title}
                                    description={course.description || "Sem descrição"}
                                    isStarted={false} // TODO: Implementar lógica de progresso
                                    onContinue={() => router.push(`/courses/${course.id}`)}
                                    onStart={() => router.push(`/courses/${course.id}`)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </ProtectedRoute>
    )
}
