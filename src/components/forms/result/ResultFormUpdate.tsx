"use client";

import {
    Form,
    FormControl,
    FormLabel,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { resultSchema, ResultSchema } from "@/lib/formValidationSchemas/result";
import { Class, Grade, Student, Subject, Lesson, Exam, Assignment, Result } from "@prisma/client";
import { Select, SelectValue, SelectTrigger, SelectItem, SelectContent } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { updateResult } from "@/lib/actions/result";
import { ResultWithDetails } from "@/app/(dashboard)/list/results/columns";

interface ResultFormUpdateProps {
    classes: Class[];
    grades: Grade[];
    students: Student[];
    subjects: Subject[];
    lessons: Lesson[];
    assignments: Assignment[];
    exams: Exam[];
    initialData: ResultWithDetails;
}

export default function ButtonUpdateResult({ classes, grades, students, subjects, lessons, assignments, exams, initialData }: ResultFormUpdateProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [selectedAssessmentType, setSelectedAssessmentType] = useState<"assignment" | "exam" | null>(null);
    const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);
    const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);
    const [filteredExams, setFilteredExams] = useState<Exam[]>([]);

    const form = useForm<ResultSchema>({
        resolver: zodResolver(resultSchema),
        defaultValues: {
            score: initialData.score,
            studentId: initialData.studentId.toString(),
            id: initialData.id,
            examId: initialData.examId ?? undefined,
            assignmentId: initialData.assignmentId ?? undefined,
        },
    });

    useEffect(() => {
        const grade = grades.find(g => g.level === initialData.student.grade.level);
        setSelectedGrade(grade || null);
        setSelectedClass(classes.find(c => c.id === initialData.student.classId) || null);
        setSelectedSubject(subjects.find(s => s.id === (initialData.assignment ? initialData.assignment.lesson.subjectId : initialData.exam?.lesson.subjectId)) || null);
        setSelectedAssessmentType(initialData.assignmentId ? "assignment" : "exam");
        setSelectedLesson(initialData.assignment ? initialData.assignment.lesson : initialData.exam?.lesson || null);
    }, [grades, classes, subjects, initialData]);

    useEffect(() => {
        if (selectedGrade) {
            setFilteredClasses(classes.filter(c => c.gradeId === selectedGrade.id));
        } else {
            setFilteredClasses([]);
        }
    }, [selectedGrade, classes]);

    useEffect(() => {
        if (selectedClass) {
            setFilteredStudents(students.filter(s => s.classId === selectedClass.id));
            setFilteredLessons(lessons.filter(l => l.classId === selectedClass.id));
        } else {
            setFilteredStudents([]);
            setFilteredLessons([]);
        }
    }, [selectedClass, students, lessons]);

    useEffect(() => {
        if (selectedSubject) {
            setFilteredLessons(lessons.filter(l => l.subjectId === selectedSubject.id && l.classId === selectedClass?.id));
        } else {
            setFilteredLessons([]);
        }
    }, [selectedSubject, lessons, selectedClass]);

    useEffect(() => {
        if (selectedAssessmentType === "assignment") {
            setFilteredAssignments(assignments.filter(a => a.lessonId === selectedLesson?.id));
            setFilteredExams([]);
            form.setValue("examId", undefined); // Reset examId when switching to assignment
        } else if (selectedAssessmentType === "exam") {
            setFilteredExams(exams.filter(e => e.lessonId === selectedLesson?.id));
            setFilteredAssignments([]);
            form.setValue("assignmentId", undefined); // Reset assignmentId when switching to exam
        }
    }, [selectedAssessmentType, selectedLesson, assignments, exams]);

    const isSubmitting = form.formState.isSubmitting;
    const onSubmit = async (values: ResultSchema) => {
        const result = await updateResult(Number(initialData.id), values);
        if (result.success) {
            toast.success(result.success.message);
            setOpen(false);
            router.push("/list/results");
        } else if (result.error) {
            toast.error(result.error.message);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <div className="w-full">
                    <Button variant="ghost" size="sm" className="w-full flex flex-row items-center justify-start gap-2">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-4xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>Edit Nilai</AlertDialogTitle>
                    <AlertDialogDescription className="hidden">
                        Edit nilai untuk siswa dengan mengisi form di bawah ini.
                    </AlertDialogDescription>
                    <div className="mt-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-left">
                                    <div>
                                        <FormLabel>Tingkatan</FormLabel>
                                        <FormControl>
                                            <Select value={selectedGrade?.id.toString() || ""} onValueChange={(value) => {
                                                const grade = grades.find(g => g.id.toString() === value);
                                                setSelectedGrade(grade || null);
                                                setSelectedClass(null);
                                                setSelectedSubject(null);
                                                setSelectedLesson(null);
                                                setSelectedAssessmentType(null);
                                            }}>
                                                <SelectTrigger>
                                                    <SelectValue>{selectedGrade?.level}</SelectValue>
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[200px] overflow-y-auto">
                                                    {grades
                                                        .sort((a, b) => a.level - b.level)
                                                        .map((item: Grade) => (
                                                            <SelectItem key={item.id} value={item.id.toString()}>{item.level}</SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div>
                                        <FormLabel>Kelas</FormLabel>
                                        <FormControl>
                                            <Select value={selectedClass?.id.toString() || ""} disabled={!selectedGrade} onValueChange={(value) => {
                                                const selectedClass = filteredClasses.find(c => c.id.toString() === value);
                                                setSelectedClass(selectedClass || null);
                                            }}>
                                                <SelectTrigger>
                                                    <SelectValue>{selectedClass?.name}</SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {filteredClasses.map((item: Class) => (
                                                        <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div>
                                        <FormLabel>Siswa</FormLabel>
                                        <FormControl>
                                            <Select value={form.watch("studentId")} disabled={!selectedClass} onValueChange={(value) => {
                                                form.setValue("studentId", value);
                                            }}>
                                                <SelectTrigger>
                                                    <SelectValue>{filteredStudents.find(s => s.id.toString() === form.watch("studentId"))?.first_name} {filteredStudents.find(s => s.id.toString() === form.watch("studentId"))?.last_name}</SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {filteredStudents.map((item: Student) => (
                                                        <SelectItem key={item.id} value={item.id.toString()}>{item.first_name} {item.last_name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div>
                                        <FormLabel>Mata Pelajaran</FormLabel>
                                        <FormControl>
                                            <Select value={selectedSubject?.id.toString() || ""} disabled={!selectedClass} onValueChange={(value) => {
                                                const subject = subjects.find(s => s.id.toString() === value);
                                                setSelectedSubject(subject || null);
                                                setSelectedLesson(null);
                                                setSelectedAssessmentType(null);
                                            }}>
                                                <SelectTrigger>
                                                    <SelectValue>{selectedSubject?.name}</SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {subjects.map((item: Subject) => (
                                                        <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div>
                                        <FormLabel>Pelajaran</FormLabel>
                                        <FormControl>
                                            <Select value={selectedLesson?.id.toString() || ""} disabled={!selectedSubject} onValueChange={(value) => {
                                                const lesson = filteredLessons.find(l => l.id.toString() === value);
                                                setSelectedLesson(lesson || null);
                                            }}>
                                                <SelectTrigger>
                                                    <SelectValue>{selectedLesson?.name}</SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {filteredLessons.map((item: Lesson) => (
                                                        <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div>
                                        <FormLabel>Jenis Penilaian</FormLabel>
                                        <FormControl>
                                            <Select value={selectedAssessmentType || ""} disabled={!selectedLesson} onValueChange={(value) => {
                                                setSelectedAssessmentType(value as "assignment" | "exam");
                                                // Reset both values when changing type
                                                if (value === "assignment") {
                                                    form.setValue("examId", undefined);
                                                } else {
                                                    form.setValue("assignmentId", undefined);
                                                }
                                            }}>
                                                <SelectTrigger>
                                                    <SelectValue>{selectedAssessmentType === "assignment" ? "Tugas" : "Ujian"}</SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="assignment">Tugas</SelectItem>
                                                    <SelectItem value="exam">Ujian</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div>
                                        <FormLabel>{selectedAssessmentType === "assignment" ? "Daftar Tugas" : "Daftar Ujian"}</FormLabel>
                                        <FormControl>
                                            <Select value={selectedAssessmentType === "assignment" ? form.watch("assignmentId")?.toString() : form.watch("examId")?.toString()} disabled={!selectedAssessmentType} onValueChange={(value) => {
                                                if (selectedAssessmentType === "assignment") {
                                                    form.setValue("assignmentId", parseInt(value));
                                                    form.setValue("examId", undefined);
                                                } else {
                                                    form.setValue("examId", parseInt(value));
                                                    form.setValue("assignmentId", undefined);
                                                }
                                            }}>
                                                <SelectTrigger>
                                                    <SelectValue>{selectedAssessmentType === "assignment" ? filteredAssignments.find(a => a.id.toString() === form.watch("assignmentId")?.toString())?.title : filteredExams.find(e => e.id.toString() === form.watch("examId")?.toString())?.title}</SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(selectedAssessmentType === "assignment" ? filteredAssignments : filteredExams).map((item) => (
                                                        <SelectItem key={item.id} value={item.id.toString()}>{item.title}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="score"
                                        render={({ field }) => (
                                            <FormItem className="-mt-1">
                                                <FormLabel>Nilai / Skor</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className="-mt-1"
                                                        type="number"
                                                        placeholder="Masukkan Nilai"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-left" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex justify-end gap-4 mt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            form.reset();
                                            setOpen(false);
                                        }}
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                                    >
                                        {isSubmitting ? "Menyimpan..." : "Simpan"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </AlertDialogHeader>
            </AlertDialogContent>
        </AlertDialog>
    );
}
