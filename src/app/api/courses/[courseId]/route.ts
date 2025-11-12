import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/generated/prisma/client"

const prisma = new PrismaClient()

// GET - Get a specific course by ID
export async function GET(
    request: NextRequest,
    { params }: { params: { courseId: string } }
) {
    try {
        const { courseId } = params

        if (!courseId) {
            return NextResponse.json(
                { error: "ID do curso não fornecido" },
                { status: 400 }
            )
        }

        const course = await prisma.course.findUnique({
            where: {
                id: courseId,
            },
            include: {
                disciplines: {
                    include: {
                        lessons: {
                            orderBy: {
                                createdAt: "asc",
                            },
                        },
                    },
                },
            },
        })

        if (!course) {
            return NextResponse.json(
                { error: "Curso não encontrado" },
                { status: 404 }
            )
        }

        return NextResponse.json({ course }, { status: 200 })
    } catch (error) {
        console.error("Error fetching course:", error)

        if (error instanceof Error) {
            return NextResponse.json(
                { error: "Erro ao buscar curso", details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { error: "Erro inesperado ao buscar curso" },
            { status: 500 }
        )
    }
}
