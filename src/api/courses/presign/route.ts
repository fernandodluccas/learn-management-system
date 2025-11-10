import { NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { z } from "zod"

// Strict Cloudflare R2 config (same schema as route.ts)
const CloudflareEnvSchema = z
    .object({
        CLOUDFLARE_R2_ACCESS_KEY_ID: z.string(),
        CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string(),
        CLOUDFLARE_R2_ENDPOINT: z.string().url(),
        CLOUDFLARE_R2_BUCKET_NAME: z.string(),
    })
    .strict()

function getCloudflareConfigStrict() {
    const {
        CLOUDFLARE_R2_ACCESS_KEY_ID,
        CLOUDFLARE_R2_SECRET_ACCESS_KEY,
        CLOUDFLARE_R2_ENDPOINT,
        CLOUDFLARE_R2_BUCKET_NAME,
    } = process.env

    return CloudflareEnvSchema.parse({
        CLOUDFLARE_R2_ACCESS_KEY_ID,
        CLOUDFLARE_R2_SECRET_ACCESS_KEY,
        CLOUDFLARE_R2_ENDPOINT,
        CLOUDFLARE_R2_BUCKET_NAME,
    })
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const disciplines = body.disciplines || []

        const cfg = getCloudflareConfigStrict()
        const client = new S3Client({
            region: "auto",
            endpoint: cfg.CLOUDFLARE_R2_ENDPOINT,
            credentials: { accessKeyId: cfg.CLOUDFLARE_R2_ACCESS_KEY_ID, secretAccessKey: cfg.CLOUDFLARE_R2_SECRET_ACCESS_KEY },
        })

        // We'll return a map of fileKey -> { key, presignedUrl, publicUrl }
        const presignedMap: Record<string, { key: string; presignedUrl: string; publicUrl: string }> = {}

        for (let dIndex = 0; dIndex < disciplines.length; dIndex++) {
            const d = disciplines[dIndex]
            const lessons = d.lessons || []
            for (let lIndex = 0; lIndex < lessons.length; lIndex++) {
                const l = lessons[lIndex]
                const filePresent = l.videoFilePresent // boolean set by client indicating if a file will be uploaded
                if (!filePresent) continue

                const originalName = l.videoFileName || `file-${dIndex}-${lIndex}`
                const contentType = l.videoContentType || "application/octet-stream"
                const key = `${Date.now()}-${dIndex}-${lIndex}-${originalName}`

                // Create PutObjectCommand for presign
                const cmd = new PutObjectCommand({ Bucket: cfg.CLOUDFLARE_R2_BUCKET_NAME, Key: key, ContentType: contentType })
                const presignedUrl = await getSignedUrl(client, cmd, { expiresIn: 60 * 15 }) // 15 minutes
                const publicUrl = `${cfg.CLOUDFLARE_R2_ENDPOINT}/${cfg.CLOUDFLARE_R2_BUCKET_NAME}/${encodeURIComponent(key)}`

                presignedMap[`file-${dIndex}-${lIndex}`] = { key, presignedUrl, publicUrl }
            }
        }

        return NextResponse.json({ ok: true, presigned: presignedMap })
    } catch (err) {
        console.error(err)
        const message = err instanceof Error ? err.message : "Erro ao gerar presigned URLs"
        return NextResponse.json({ ok: false, error: message }, { status: 500 })
    }
}
