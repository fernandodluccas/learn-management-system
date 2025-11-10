"use client"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface Lesson {
    id: string
    title: string
    duration: string
    completed: boolean
}

interface Module {
    id: string
    title: string
    lessons: Lesson[]
}

interface CourseSidebarProps {
    courseName: string
    modules: Module[]
    onLessonSelect: (lessonId: string) => void
    isOpen: boolean
    onToggle: (open: boolean) => void
}

export function CourseSidebar({ courseName, modules, onLessonSelect, isOpen, onToggle }: CourseSidebarProps) {
    return (
        <>
            {/* Toggle Button - Mobile */}
            <Button
                variant="outline"
                size="sm"
                className="fixed bottom-6 right-6 lg:hidden z-40 bg-transparent"
                onClick={() => onToggle(!isOpen)}
            >
                {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-screen w-80 bg-card border-r border-border overflow-y-auto transition-all duration-300 lg:relative lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="p-6 pt-24 lg:pt-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{courseName}</h3>
                    {/* Modules Accordion */}
                    <Accordion type="single" collapsible className="space-y-2">
                        {modules.map((module) => (
                            <AccordionItem key={module.id} value={module.id} className="border border-border rounded-lg px-3">
                                <AccordionTrigger className="py-3 hover:no-underline">
                                    <span className="text-sm font-medium text-foreground text-left">{module.title}</span>
                                </AccordionTrigger>
                                <AccordionContent className="pb-0">
                                    <div className="space-y-2 py-2">
                                        {module.lessons.map((lesson) => (
                                            <button
                                                key={lesson.id}
                                                onClick={() => {
                                                    onLessonSelect(lesson.id)
                                                    onToggle(false)
                                                }}
                                                className="w-full text-left p-3 rounded-lg text-sm hover:bg-muted transition-colors flex items-start gap-2"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-foreground">{lesson.title}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </aside>

            {/* Overlay - Mobile */}
            {isOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => onToggle(false)} />}
        </>
    )
}
