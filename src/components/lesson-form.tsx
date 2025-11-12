"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Upload, FileCheck, Loader2, X } from "lucide-react"
import type { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form"

interface LessonFormProps {
    disciplineIndex: number
    lessonIndex: number
    register: UseFormRegister<any>
    setValue: UseFormSetValue<any>
    watch: UseFormWatch<any>
    onDelete: () => void
}

export function LessonForm({ disciplineIndex, lessonIndex, register, setValue, watch, onDelete }: LessonFormProps) {
    const fieldPrefix = `disciplines.${disciplineIndex}.lessons.${lessonIndex}`
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    const videoUrl = watch(`${fieldPrefix}.videoUrl`)
    const videoFileName = watch(`${fieldPrefix}.videoFileName`)

    const uploadFile = async (file: File) => {
        setUploading(true)
        setUploadError(null)

        try {
            const formData = new FormData()
            formData.append("file", file)

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || "Erro ao fazer upload")
            }

            const data = await response.json()

            // Save video URL and metadata
            setValue(`${fieldPrefix}.videoUrl`, data.url)
            setValue(`${fieldPrefix}.videoBlobId`, data.blobId)
            setValue(`${fieldPrefix}.videoFileName`, file.name)
        } catch (error) {
            console.error("Upload error:", error)
            setUploadError(error instanceof Error ? error.message : "Erro ao fazer upload")
        } finally {
            setUploading(false)
        }
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        await uploadFile(file)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        const file = e.dataTransfer.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('video/')) {
            setUploadError('Por favor, selecione um arquivo de vídeo válido')
            return
        }

        await uploadFile(file)
    }

    const handleRemoveVideo = () => {
        setValue(`${fieldPrefix}.videoUrl`, null)
        setValue(`${fieldPrefix}.videoBlobId`, null)
        setValue(`${fieldPrefix}.videoFileName`, null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
            <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Título da Aula</label>
                <Input placeholder="Ex: Introdução aos Hooks" {...register(`${fieldPrefix}.title`)} className="bg-background" />
            </div>

            <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Descrição da Aula</label>
                <Textarea placeholder="Descreva o conteúdo da aula..." {...register(`${fieldPrefix}.description`)} rows={3} className="bg-background" />
            </div>

            {/* Video Upload */}
            <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Vídeo da Aula</label>

                {!videoUrl ? (
                    <div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="video/*"
                            onChange={handleFileSelect}
                            disabled={uploading}
                            className="hidden"
                            id={`video-input-${disciplineIndex}-${lessonIndex}`}
                        />
                        <label
                            htmlFor={`video-input-${disciplineIndex}-${lessonIndex}`}
                            className="cursor-pointer block"
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <div className={`
                                relative overflow-hidden
                                border-2 border-dashed rounded-lg
                                p-8 text-center
                                transition-all duration-200
                                ${uploading
                                    ? 'border-primary bg-primary/5 cursor-not-allowed'
                                    : isDragging
                                        ? 'border-primary bg-primary/10 scale-[1.02]'
                                        : 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5 cursor-pointer'
                                }
                            `}>
                                <div className="flex flex-col items-center gap-3">
                                    {uploading ? (
                                        <>
                                            <div className="p-3 rounded-full bg-primary/10">
                                                <Loader2 size={32} className="animate-spin text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">Fazendo upload...</p>
                                                <p className="text-sm text-muted-foreground mt-1">Aguarde enquanto processamos o vídeo</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="p-3 rounded-full bg-primary/10">
                                                <Upload size={32} className="text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">Clique para selecionar um vídeo</p>
                                                <p className="text-sm text-muted-foreground mt-1">ou arraste e solte aqui</p>
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-2">
                                                MP4, WebM, AVI • Máx. 100MB
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </label>
                        {uploadError && (
                            <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                                <p className="text-destructive text-sm">{uploadError}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                        <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                            <FileCheck size={20} className="text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{videoFileName || "Vídeo enviado"}</p>
                            <p className="text-xs text-muted-foreground">Upload concluído com sucesso</p>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveVideo}
                            className="h-9 w-9 p-0 cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                            title="Remover vídeo"
                        >
                            <X size={18} />
                        </Button>
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button variant="destructive" size="sm" onClick={onDelete} type="button" className="gap-2">
                    <Trash2 size={16} />
                    Deletar Aula
                </Button>
            </div>
        </div>
    )
}
