import multer from "multer"
import path from "path"
import { existsSync, mkdirSync } from "fs"

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), "public", "uploads", "videos")
if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true })
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        // Generate unique filename: timestamp-randomstring-originalname
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        const ext = path.extname(file.originalname)
        const nameWithoutExt = path.basename(file.originalname, ext)
        cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`)
    },
})

// File filter - only videos
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith("video/")) {
        cb(null, true)
    } else {
        cb(new Error("Apenas arquivos de vídeo são permitidos"))
    }
}

// Create multer instance
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB max
    },
})
