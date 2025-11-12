"use client"

import { CreateCourseForm } from "@/components/create-course-form"
import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/protected-route"

export default function CreateCoursePage() {
    return (
        <ProtectedRoute>
            <Header />
            <main className="min-h-screen bg-background p-6 pt-28">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-foreground mb-2">Criar Novo Curso</h1>
                    </div>
                    <CreateCourseForm />
                </div>
            </main>
        </ProtectedRoute>
    )
}
