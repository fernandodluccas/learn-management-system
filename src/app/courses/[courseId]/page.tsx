"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { CourseSidebar } from "@/components/course-sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronRight, CheckCircle2, Clock } from "lucide-react"

const mockCourseData = {
    id: "1",
    name: "Design de Interface Avançado",
    modules: [
        {
            id: "module1",
            title: "Fundamentos de UI",
            lessons: [
                {
                    id: "lesson1",
                    title: "Introdução aos princípios de design",
                    duration: "15 min",
                    completed: true,
                    description: "Conheça os princípios fundamentais que guiam o design de interfaces modernas.",
                    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4",
                },
                {
                    id: "lesson2",
                    title: "Tipografia e Hierarquia Visual",
                    duration: "22 min",
                    completed: false,
                    description: "Aprenda como usar tipografia para criar hierarquia visual efetiva.",
                    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-library/sample/ElephantsDream.mp4",
                },
            ],
        },
        {
            id: "module2",
            title: "Composição e Layout",
            lessons: [
                {
                    id: "lesson3",
                    title: "Grids e Sistemas de Layout",
                    duration: "18 min",
                    completed: false,
                    description: "Entenda como criar sistemas de layout consistentes e flexíveis.",
                    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerBlazes.mp4",
                },
                {
                    id: "lesson4",
                    title: "Espaçamento e Proporções",
                    duration: "16 min",
                    completed: false,
                    description: "Domine as técnicas de espaçamento para criar designs harmoniosos.",
                    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerEscapes.mp4",
                },
            ],
        },
    ],
}

export default function CoursePlayerPage({
    params,
}: {
    params: { courseId: string }
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [selectedLessonId, setSelectedLessonId] = useState(mockCourseData.modules[0].lessons[0].id)

    // Find selected lesson
    const selectedLesson = mockCourseData.modules.flatMap((m) => m.lessons).find((l) => l.id === selectedLessonId)

    return (
        <main className="min-h-screen bg-background">
            <Header />
            <div className="flex pt-16 lg:pt-20">
                {/* Sidebar */}
                <CourseSidebar
                    courseName={mockCourseData.name}
                    modules={mockCourseData.modules}
                    onLessonSelect={setSelectedLessonId}
                    isOpen={sidebarOpen}
                    onToggle={setSidebarOpen}
                />

                {/* Main Content */}
                <div className="flex-1 w-full min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-5rem)]">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                        {/* Video Player */}
                        <div className="mb-6 sm:mb-8">
                            <div className="w-full bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center mb-4 sm:mb-6">
                                <video key={selectedLesson?.id} className="w-full h-full" controls crossOrigin="anonymous">
                                    <source src={selectedLesson?.videoUrl} type="video/mp4" />
                                    Seu navegador não suporta reprodução de vídeo.
                                </video>
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
                                    <Card className="p-4 sm:p-6 mb-6 sm:mb-8">
                                        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3">Sobre esta aula</h3>
                                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                            {selectedLesson.description}
                                        </p>
                                    </Card>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
