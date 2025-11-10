"use client"

import { Header } from "@/components/header"
import { CourseCard } from "@/components/course-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

type Course = {
    id: string
    title: string
    progress: number
    modules: number
    lessons: number
    description: string
    isStarted: boolean
    thumbnail: string
}

const mockCourses: Course[] = [
    {
        id: "1",
        title: "Design de Interface Avançado",
        progress: 17,
        modules: 3,
        lessons: 8,
        description: "Aprenda os princípios avançados de design de interface com estudos de caso reais.",
        isStarted: true,
        thumbnail: "/design-interface-course.jpg",
    },
    {
        id: "2",
        title: "Desenvolvimento Web Full Stack",
        progress: 0,
        modules: 5,
        lessons: 12,
        description: "Domine o desenvolvimento web moderno com React, Node.js e bancos de dados.",
        isStarted: false,
        thumbnail: "/fullstack-development-course.png",
    },
    {
        id: "3",
        title: "Fundamentos de UX/UI",
        progress: 45,
        modules: 2,
        lessons: 6,
        description: "Inicie sua jornada em design de experiência do usuário.",
        isStarted: true,
        thumbnail: "/ux-ui-fundamentals.jpg",
    },
    {
        id: "4",
        title: "Marketing Digital Essencial",
        progress: 0,
        modules: 4,
        lessons: 10,
        description: "Estratégias efetivas de marketing digital para o século XXI.",
        isStarted: false,
        thumbnail: "/digital-marketing-strategy.png",
    },
    {
        id: "5",
        title: "Python para Ciência de Dados",
        progress: 62,
        modules: 6,
        lessons: 15,
        description: "Aprenda Python e suas bibliotecas para análise de dados.",
        isStarted: true,
        thumbnail: "/python-data-science.png",
    },
    {
        id: "6",
        title: "Gestão de Projetos Ágil",
        progress: 0,
        modules: 3,
        lessons: 7,
        description: "Metodologias ágeis e scrum para gestão eficiente de projetos.",
        isStarted: false,
        thumbnail: "/agile-project-management.png",
    },
]

export default function CoursesPage() {
    const router = useRouter()

    const handleCourseClick = (course: Course) => {
        router.push(`/courses/${course.id}`)
    }

    return (
        <main className="min-h-screen bg-background">
            {/* Header global */}
            <Header />

            {/* Conteúdo principal */}
            <div className="pt-20 px-4 sm:px-6 pb-12">
                {/* Título e botão */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Meus Cursos</h2>
                        <p className="text-base text-muted-foreground">
                            Continue seu aprendizado de onde parou
                        </p>
                    </div>

                    <Link href="/create-course" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                            <Plus className="w-4 h-4" />
                            Novo Curso
                        </Button>
                    </Link>
                </div>

                {/* Grade de cursos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {mockCourses.map((course) => (
                        <CourseCard
                            key={course.id}
                            {...course}
                            onContinue={() => router.push(`/courses/${course.id}`)}
                            onStart={() => router.push(`/courses/${course.id}`)}
                        />
                    ))}
                </div>
            </div>
        </main>
    )
}
