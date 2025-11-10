"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LessonForm } from "@/components/lesson-form"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Trash2, Plus } from "lucide-react"
import { useFieldArray, type Control, type UseFormRegister, type UseFormSetValue, type UseFormWatch } from "react-hook-form"

interface DisciplineSectionProps {
    index: number
    control: Control<any>
    register: UseFormRegister<any>
    setValue: UseFormSetValue<any>
    watch: UseFormWatch<any>
    removeDiscipline: () => void
}

export function DisciplineSection({ index, control, register, setValue, watch, removeDiscipline }: DisciplineSectionProps) {
    const { fields: lessons, append, remove } = useFieldArray({ control, name: `disciplines.${index}.lessons` })

    const addLesson = () => append({ title: "", description: "", videoFile: undefined })

    return (
        <Card className="border-border">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex gap-2">
                            <Input placeholder="Nome da disciplina" {...register(`disciplines.${index}.title`)} className="bg-muted/50" />
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={removeDiscipline} className="text-destructive hover:bg-destructive/10">
                        <Trash2 size={18} />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Lessons List */}
                {lessons.length === 0 ? (
                    <div className="py-6 px-4 text-center border-border border border-dashed rounded-md">
                        <p className="text-muted-foreground mb-3 text-sm">Nenhuma aula adicionada</p>
                        <Button onClick={addLesson} size="sm" variant="outline">
                            Adicionar Primeira Aula
                        </Button>
                    </div>
                ) : (
                    <Accordion type="single" collapsible className="w-full">
                        {lessons.map((lesson, lessonIndex) => (
                            <AccordionItem key={lesson.id} value={lesson.id} className="border-border">
                                <AccordionTrigger className="hover:no-underline py-3">
                                    <div className="flex items-center gap-3 text-left">
                                        <span className="text-sm font-medium text-muted-foreground">Aula {lessonIndex + 1}</span>
                                        <span className="font-medium text-foreground">{(watch(`disciplines.${index}.lessons.${lessonIndex}.title`) as string) || "Sem título"}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-4">
                                    <LessonForm
                                        disciplineIndex={index}
                                        lessonIndex={lessonIndex}
                                        register={register}
                                        setValue={setValue}
                                        watch={watch}
                                        onDelete={() => remove(lessonIndex)}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}

                {/* Add Lesson Button */}
                <Button onClick={addLesson} variant="outline" size="sm" className="w-full gap-2 bg-transparent">
                    <Plus size={16} />
                    Adicionar Aula
                </Button>
            </CardContent>
        </Card>
    )
}
