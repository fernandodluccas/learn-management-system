import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/generated/prisma/client"
import { auth } from "@/lib/auth"
import { z } from "zod"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// Validation schemas
const LessonSchema = z.object({
    title: z.string().min(1, "Título da aula é obrigatório"),
    description: z.string().optional(),
    videoUrl: z.string().optional(),
    videoBlobId: z.string().optional(),
})

const DisciplineSchema = z.object({
    title: z.string().min(1, "Título da disciplina é obrigatório"),
    lessons: z.array(LessonSchema).optional().default([]),
})

const CreateCourseSchema = z.object({
    title: z.string().min(1, "Título do curso é obrigatório"),
    description: z.string().optional(),
    disciplines: z.array(DisciplineSchema).optional().default([]),
})

// GET - List all courses
export async function GET() {
    try {
        const courses = await prisma.course.findMany({
            include: {
                disciplines: {
                    include: {
                        lessons: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        })

        return NextResponse.json({ courses }, { status: 200 })
    } catch (error) {
        console.error("Error fetching courses:", error)
        return NextResponse.json(
            { error: "Erro ao buscar cursos" },
            { status: 500 }
        )
    }
}

// POST - Create a new course
export async function POST(request: NextRequest) {
    try {
        console.log("Received request to create course")
        // Check authentication
        const session = await auth.api.getSession({
            headers: request.headers,
        })

        if (!session) {
            return NextResponse.json(
                { error: "Não autorizado. Faça login para criar cursos." },
                { status: 401 }
            )
        }

        // Parse and validate request body
        const body = await request.json()
        const validation = CreateCourseSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "Dados inválidos",
                    details: validation.error.issues
                },
                { status: 400 }
            )
        }

        const { title, description, disciplines } = validation.data

        // Create course with disciplines and lessons using nested create
        const course = await prisma.course.create({
            data: {
                title,
                description: description || null,
                disciplines: {
                    create: disciplines.map((discipline) => ({
                        title: discipline.title,
                        lessons: {
                            create: (discipline.lessons || []).map((lesson) => ({
                                title: lesson.title,
                                description: lesson.description || null,
                                videoUrl: lesson.videoUrl || null,
                                videoBlobId: lesson.videoBlobId || null,
                            })),
                        },
                    })),
                },
            },
            include: {
                disciplines: {
                    include: {
                        lessons: true,
                    },
                },
            },
        })

        return NextResponse.json(
            {
                message: "Curso criado com sucesso",
                course
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("Error creating course:", error)

        // Handle specific Prisma errors
        if (error instanceof Error) {
            return NextResponse.json(
                { error: "Erro ao criar curso", details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { error: "Erro inesperado ao criar curso" },
            { status: 500 }
        )
    }
}
