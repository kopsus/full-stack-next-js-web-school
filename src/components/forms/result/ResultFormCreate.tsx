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
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { resultSchema, ResultSchema } from "@/lib/formValidationSchemas/result";
import { Class, Grade, Student, Subject, Lesson, Exam, Assignment } from "@prisma/client";
import { Select, SelectValue, SelectTrigger, SelectItem, SelectContent } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify"; // Import toast for notifications
import { createResult } from "@/lib/actions/result"; // Assuming a similar create function exists

interface ResultFormCreateProps {
    classes: Class[];
    grades: Grade[];
    students: Student[];
    subjects: Subject[];
    lessons: Lesson[];
    assignments: Assignment[];
    exams: Exam[];
}

export default function ButtonCreateResult({ classes, grades, students, subjects, lessons, assignments, exams }: ResultFormCreateProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [selectedAssessmentType, setSelectedAssessmentType] = useState<"assignment" | "exam" | null>(null);
    const [filteredClasses, setFilteredClasses] = useState<Class[]>(classes);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>(students);
    const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);
    const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);
    const [filteredExams, setFilteredExams] = useState<Exam[]>([]);

    const form = useForm<ResultSchema>({
        resolver: zodResolver(resultSchema),
        defaultValues: {
            score: 0,
            studentId: "1",
        }
    });

    useEffect(() => {
        if (selectedGrade) {
            setFilteredClasses(classes.filter(c => c.gradeId === selectedGrade.id));
        } else {
            setFilteredClasses(classes);
        }
    }, [selectedGrade, classes]);

    useEffect(() => {
        if (selectedClass) {
            setFilteredStudents(students.filter(s => s.classId === selectedClass.id));
            setFilteredLessons(lessons.filter(l => l.classId === selectedClass.id));
        } else {
            setFilteredStudents(students);
            setFilteredLessons(lessons);
        }
    }, [selectedClass, students, lessons]);

    useEffect(() => {
        if (selectedSubject) {
            setFilteredLessons(lessons.filter(l => l.subjectId === selectedSubject.id && l.classId === selectedClass?.id));
        } else {
            setFilteredLessons(lessons);
        }
    }, [selectedSubject, lessons, selectedClass]);

    useEffect(() => {
        if (selectedAssessmentType === "assignment") {
            setFilteredAssignments(assignments.filter(a => a.lessonId === selectedLesson?.id));
            setFilteredExams([]);
        } else if (selectedAssessmentType === "exam") {
            setFilteredExams(exams.filter(e => e.lessonId === selectedLesson?.id));
            setFilteredAssignments([]);
        }
    }, [selectedAssessmentType, selectedLesson, assignments, exams]);

    const isSubmitting = form.formState.isSubmitting;
    const onSubmit = async (values: ResultSchema) => {
        const result = await createResult(values);
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
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Nilai
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-4xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>Tambah Nilai</AlertDialogTitle>
                    <AlertDialogDescription className="hidden">
                        Tambahkan nilai untuk siswa dengan mengisi form di bawah ini.
                    </AlertDialogDescription>
                    <div className="mt-4">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-left">
                                    <div>
                                        <FormLabel>Tingkatan</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={(value) => {
                                                const grade = grades.find(g => g.id.toString() === value);
                                                setSelectedGrade(grade || null);
                                                setSelectedClass(null);
                                                setSelectedSubject(null);
                                                setSelectedLesson(null);
                                                setSelectedAssessmentType(null);
                                            }}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Tingkatan" />
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
                                            <Select disabled={!selectedGrade} onValueChange={(value) => {
                                                const selectedClass = filteredClasses.find(c => c.id.toString() === value);
                                                setSelectedClass(selectedClass || null);
                                                setSelectedSubject(null);
                                                setSelectedLesson(null);
                                                setSelectedAssessmentType(null);
                                            }}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Kelas" />
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
                                            <Select disabled={!selectedClass} onValueChange={(value) => {
                                                const student = filteredStudents.find(s => s.id.toString() === value);
                                                form.setValue("studentId", student?.id.toString() || "");
                                            }}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Siswa" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {filteredStudents.map((item: Student) => (
                                                        <SelectItem key={item.id} value={item.id.toString()}>{item.first_name} {item.last_name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                                <FormMessage />
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div>
                                        <FormLabel>Mata Pelajaran</FormLabel>
                                        <FormControl>
                                            <Select disabled={!selectedClass} onValueChange={(value) => {
                                                const subject = subjects.find(s => s.id.toString() === value);
                                                setSelectedSubject(subject || null);
                                                setSelectedLesson(null);
                                                setSelectedAssessmentType(null);
                                            }}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Mata Pelajaran" />
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
                                            <Select disabled={!selectedSubject} onValueChange={(value) => {
                                                const lesson = filteredLessons.find(l => l.id.toString() === value);
                                                setSelectedLesson(lesson || null);
                                                setSelectedAssessmentType(null);
                                            }}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Pelajaran" />
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
                                            <Select disabled={!selectedLesson} onValueChange={(value) => setSelectedAssessmentType(value as "assignment" | "exam")}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Jenis Penilaian" />
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
                                            <Select disabled={!selectedAssessmentType} onValueChange={(value) => {
                                                const selectedAssessment = (selectedAssessmentType === "assignment" ? filteredAssignments : filteredExams).find(item => item.id.toString() === value);
                                                if (selectedAssessmentType === "assignment") {
                                                    form.setValue("assignmentId", parseInt(selectedAssessment?.id.toString() || "0"));
                                                } else {
                                                    form.setValue("examId", parseInt(selectedAssessment?.id.toString() || "0"));
                                                }
                                            }}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={`Pilih ${selectedAssessmentType === "assignment" ? "Tugas" : "Ujian"}`} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(selectedAssessmentType === "assignment" ? filteredAssignments : filteredExams).map((item) => (
                                                        <SelectItem key={item.id} value={item.id.toString()}>{item.title}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                                <FormMessage />
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
        </AlertDialog >
    );
}
