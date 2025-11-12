import { NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { auth } from "@/lib/auth"
import path from "path"

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await auth.api.getSession({
            headers: request.headers,
        })

        if (!session) {
            return NextResponse.json(
                { error: "Não autorizado. Faça login para fazer upload de vídeos." },
                { status: 401 }
            )
        }

        // Get the form data
        const formData = await request.formData()
        const file = formData.get("file") as File

        if (!file) {
            return NextResponse.json(
                { error: "Nenhum arquivo foi enviado" },
                { status: 400 }
            )
        }

        // Validate file type (only video files)
        if (!file.type.startsWith("video/")) {
            return NextResponse.json(
                { error: "O arquivo deve ser um vídeo" },
                { status: 400 }
            )
        }

        // Validate file size (max 100MB)
        const maxSize = 100 * 1024 * 1024 // 100MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "O vídeo não pode ter mais de 100MB" },
                { status: 400 }
            )
        }

        // Generate unique filename
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        const ext = path.extname(file.name)
        const nameWithoutExt = path.basename(file.name, ext)
        const filename = `${nameWithoutExt}-${uniqueSuffix}${ext}`

        // Save to public/uploads/videos
        const uploadDir = path.join(process.cwd(), "public", "uploads", "videos")
        const filePath = path.join(uploadDir, filename)

        await writeFile(filePath, buffer)

        // Return public URL
        const url = `/uploads/videos/${filename}`

        return NextResponse.json(
            {
                message: "Vídeo enviado com sucesso",
                url,
                blobId: filename, // Using filename as ID for consistency
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error uploading video:", error)

        if (error instanceof Error) {
            return NextResponse.json(
                { error: "Erro ao fazer upload do vídeo", details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { error: "Erro inesperado ao fazer upload" },
            { status: 500 }
        )
    }
}
