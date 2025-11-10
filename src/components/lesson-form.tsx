"use client"

import type React from "react"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Upload, FileCheck } from "lucide-react"
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
    const fileInputRef = useRef<HTMLInputElement>(null)

    const fieldPrefix = `disciplines.${disciplineIndex}.lessons.${lessonIndex}`

    const currentFile = watch(`${fieldPrefix}.videoFile`) as File | undefined
    const fileName = currentFile?.name ?? null

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (!file.type.startsWith("video/")) {
                alert("Por favor, selecione um arquivo de vídeo válido")
                if (fileInputRef.current) fileInputRef.current.value = ""
                return
            }
            setValue(`${fieldPrefix}.videoFile`, file, { shouldValidate: true })
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

            <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Upload de Vídeo</label>
                <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileChange} className="hidden" />

                {fileName ? (
                    <div className="flex items-center gap-3 p-3 bg-background border border-border rounded-md">
                        <FileCheck size={20} className="text-green-600" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{fileName}</p>
                        </div>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                setValue(`${fieldPrefix}.videoFile`, undefined, { shouldValidate: true })
                                if (fileInputRef.current) fileInputRef.current.value = ""
                            }}
                        >
                            Remover
                        </Button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full p-3 border-2 border-dashed border-border rounded-md hover:border-primary hover:bg-muted/50 transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                        <Upload size={20} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Clique para upload ou arraste um vídeo</span>
                    </button>
                )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button variant="destructive" size="sm" onClick={onDelete} className="gap-2">
                    <Trash2 size={16} />
                    Deletar Aula
                </Button>
            </div>
        </div>
    )
}
