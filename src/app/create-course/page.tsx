import { CreateCourseForm } from "@/components/create-course-form"
import { Header } from "@/components/header"

export default function CreateCoursePage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-background p-6 pt-28">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-foreground mb-2">Criar Novo Curso</h1>
                    </div>
                    <CreateCourseForm />
                </div>
            </main>
        </>
    )
}
