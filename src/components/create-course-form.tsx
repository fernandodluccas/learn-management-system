"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray, type Control } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DisciplineSection } from "@/components/discipline-section"
import { Plus, Save } from "lucide-react"

const LessonSchema = z.object({
    title: z.string().min(1, "Título da aula é obrigatório"),
    description: z.string().optional(),
    videoFile: z.any().optional(),
})

const DisciplineSchema = z.object({
    title: z.string().min(1, "Título da disciplina é obrigatório"),
    lessons: z.array(LessonSchema).optional(),
})

const CourseSchema = z.object({
    title: z.string().min(1, "Título do curso é obrigatório"),
    description: z.string().optional(),
    disciplines: z.array(DisciplineSchema).optional(),
})

type CourseForm = z.infer<typeof CourseSchema>

export function CreateCourseForm() {
    const {
        control,
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CourseForm>({
        resolver: zodResolver(CourseSchema),
        defaultValues: { title: "", description: "", disciplines: [] },
    })

    const { fields: disciplines, append, remove } = useFieldArray({ control, name: "disciplines" })

    const onAddDiscipline = () => append({ title: "", lessons: [] })

    // Build a lightweight metadata payload for requesting presigned URLs
    const buildPresignPayload = (data: CourseForm) => {
        const disciplines = (data.disciplines || []).map((d, dIndex) => ({
            title: d.title,
            lessons: (d.lessons || []).map((l, lIndex) => {
                const file = l.videoFile as unknown as File | undefined
                return {
                    title: l.title,
                    description: l.description,
                    videoFilePresent: file instanceof File,
                    videoFileName: file instanceof File ? file.name : undefined,
                    videoContentType: file instanceof File ? file.type : undefined,
                }
            }),
        }))
        return { title: data.title, description: data.description, disciplines }
    }

    const onSubmit = async (data: CourseForm) => {
        try {
            // 1) Ask server for presigned URLs for files that will be uploaded
            const presignReq = buildPresignPayload(data)
            const presignResp = await fetch("/api/courses/presign", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(presignReq) })
            const presignJson = await presignResp.json()
            if (!presignResp.ok || !presignJson.ok) {
                console.error("Presign failed:", presignJson)
                alert(`Erro ao preparar upload: ${presignJson?.error ?? presignResp.status}`)
                return
            }

            const presignedMap: Record<string, { key: string; presignedUrl: string; publicUrl: string }> = presignJson.presigned || {}

            // 2) Upload files directly to R2 using the presigned PUT URLs
            const uploadPromises: Promise<void>[] = []
                ; (data.disciplines || []).forEach((d, dIndex) => {
                    ; (d.lessons || []).forEach((l, lIndex) => {
                        const file = l.videoFile as unknown as File | undefined
                        const fileKey = `file-${dIndex}-${lIndex}`
                        const presigned = presignedMap[fileKey]
                        if (file instanceof File && presigned) {
                            const p = fetch(presigned.presignedUrl, { method: "PUT", headers: { "Content-Type": file.type || "application/octet-stream" }, body: file }).then((r) => {
                                if (!r.ok) throw new Error(`Upload failed for ${fileKey}: ${r.status}`)
                            })
                            uploadPromises.push(p)
                        }
                    })
                })

            await Promise.all(uploadPromises)

            // 3) Build create payload with returned keys and public URLs
            const createPayload = {
                title: data.title,
                description: data.description,
                disciplines: (data.disciplines || []).map((d, dIndex) => ({
                    title: d.title,
                    lessons: (d.lessons || []).map((l, lIndex) => {
                        const fileKey = `file-${dIndex}-${lIndex}`
                        const presigned = presignedMap[fileKey]
                        return {
                            title: l.title,
                            description: l.description,
                            videoKey: presigned?.key,
                            videoUrl: presigned?.publicUrl,
                        }
                    }),
                })),
            }

            // 4) Create course record in DB
            const res = await fetch("/api/courses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(createPayload) })
            const json = await res.json()

            if (!res.ok) {
                console.error("Save failed:", json)
                alert(`Erro ao salvar curso: ${json?.error ?? res.status}`)
                return
            }

            // Success: navigate to created course
            window.location.href = `/courses/${json.course.id}`
        } catch (error) {
            console.error("Unexpected error saving course:", error)
            alert("Erro inesperado ao salvar curso")
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Course Information */}
            <Card className="border-border">
                <CardHeader>
                    <CardTitle>Informações do Curso</CardTitle>
                    <CardDescription>Defina o título e descrição do seu curso</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Título do Curso</label>
                        <Input placeholder="Ex: Introdução ao React" {...register("title")} className="bg-muted/50" />
                        {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message as string}</p>}
                    </div>
                    <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Descrição do Curso</label>
                        <Textarea placeholder="Descreva o conteúdo e objetivos do seu curso..." {...register("description")} rows={4} className="bg-muted/50" />
                    </div>
                </CardContent>
            </Card>

            {/* Disciplines */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-foreground">Disciplinas</h2>
                    <Button onClick={onAddDiscipline} type="button" variant="outline" size="sm" className="gap-2 bg-transparent">
                        <Plus size={16} />
                        Adicionar Disciplina
                    </Button>
                </div>

                {disciplines.length === 0 ? (
                    <Card className="border-border border-dashed">
                        <CardContent className="py-8 text-center">
                            <p className="text-muted-foreground mb-3">Nenhuma disciplina adicionada</p>
                            <Button onClick={onAddDiscipline} size="sm">
                                Criar Primeira Disciplina
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {disciplines.map((discipline, index) => (
                            <DisciplineSection
                                key={discipline.id}
                                control={control as unknown as Control<any>}
                                register={register}
                                setValue={setValue}
                                watch={watch}
                                index={index}
                                removeDiscipline={() => remove(index)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" size="lg" type="button" onClick={() => window.location.reload()}>
                    Descartar
                </Button>
                <Button type="submit" size="lg" className="gap-2">
                    <Save size={18} />
                    Salvar Curso
                </Button>
            </div>
        </form>
    )
}
