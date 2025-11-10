import { NextResponse } from "next/server"
import { PrismaClient } from "@/generated/prisma/client"
// S3 client is used in presign route; this file only needs Zod and Prisma
import { z } from "zod"

const prisma = new PrismaClient()

// --- Configuração do Cloudflare R2 (Zod) ---
// O schema Zod está ótimo: é estrito e claro.
const CloudflareEnvSchema = z
    .object({
        CLOUDFLARE_R2_ACCESS_KEY_ID: z.string(),
        CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string(),
        CLOUDFLARE_R2_ENDPOINT: z.string().url(),
        CLOUDFLARE_R2_BUCKET_NAME: z.string(),
    })
    .strict()

function getCloudflareConfigStrict() {
    // Desestrutura apenas as chaves que o schema espera
    const {
        CLOUDFLARE_R2_ACCESS_KEY_ID,
        CLOUDFLARE_R2_SECRET_ACCESS_KEY,
        CLOUDFLARE_R2_ENDPOINT,
        CLOUDFLARE_R2_BUCKET_NAME,
    } = process.env;

    // Passa o objeto limpo (usando shorthand properties) para o Zod.
    // O .strict() funciona pois o objeto SÓ tem as chaves definidas no schema.
    const parsed = CloudflareEnvSchema.parse({
        CLOUDFLARE_R2_ACCESS_KEY_ID,
        CLOUDFLARE_R2_SECRET_ACCESS_KEY,
        CLOUDFLARE_R2_ENDPOINT,
        CLOUDFLARE_R2_BUCKET_NAME,
    });

    return parsed;
}
// Note: server-side upload removed in favor of presigned upload flow.

// --- Tipos para o Payload de Entrada ---
type InputLesson = {
    title: string
    description?: string
}

type InputDiscipline = {
    title: string
    lessons: InputLesson[]
}

// --- Handler da API (POST) ---
export async function POST(req: Request) {
    try {
        // Expect JSON body: { title, description, disciplines: [{ title, lessons: [{ title, description, videoKey?, videoUrl? }] }] }
        const body = await req.json()
        const title: string = body.title || ""
        const description: string | undefined = body.description
        const inputDisciplines: InputDiscipline[] = (body.disciplines || []) as any

        const r2cfg = getCloudflareConfigStrict()

        // Build prisma payload
        const prismaDisciplines = inputDisciplines.map((d) => {
            const lessons = (d.lessons || []).map((l: any) => {
                const videoKey = (l as any).videoKey as string | undefined
                const videoUrl = (l as any).videoUrl as string | undefined
                return {
                    title: l.title,
                    description: l.description || undefined,
                    videoBlobId: videoKey || undefined,
                    videoUrl: videoUrl || (videoKey ? `${r2cfg.CLOUDFLARE_R2_ENDPOINT}/${r2cfg.CLOUDFLARE_R2_BUCKET_NAME}/${encodeURIComponent(videoKey)}` : undefined),
                }
            })
            return { title: d.title, lessons: { create: lessons } }
        })

        const prismaCourseData = { title, description, disciplines: { create: prismaDisciplines } }

        const newCourse = await (prisma as any).course.create({ data: prismaCourseData })
        return NextResponse.json({ ok: true, course: newCourse })
    } catch (err) {
        console.error(err)
        // Garante que o erro seja uma mensagem de string
        const errorMessage = err instanceof Error ? err.message : "Um erro inesperado ocorreu"
        return NextResponse.json({ ok: false, error: errorMessage }, { status: 500 })
    }
}