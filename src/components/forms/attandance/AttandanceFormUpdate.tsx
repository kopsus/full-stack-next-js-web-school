"use client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Check, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { attendanceSchema } from "@/lib/formValidationSchemas/attandance";
import type { AttendanceSchema } from "@/lib/formValidationSchemas/attandance";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import dayjs from "dayjs";
import { Label } from "@/components/ui/label";
import { Student, Teacher, Lesson, Role } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { updateAttendance } from "@/lib/actions/attendance";
import { AttendanceWithDetails } from "@/app/(dashboard)/list/attendance/columns";

interface ButtonUpdateAttendanceProps extends AttendanceWithDetails {
    roleLogin: Role;
}

export default function ButtonUpdateAttendance({ allStudents, allTeachers, allLessons, attendance, roleLogin }: ButtonUpdateAttendanceProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const form = useForm<AttendanceSchema>({
        resolver: zodResolver(attendanceSchema),
        defaultValues: {
            id: attendance.id,
            date: attendance.date ? dayjs(attendance.date).toDate() : new Date(),
            lessonId: attendance.lessonId,
            studentId: attendance.studentId ?? undefined,
            teacherId: attendance.teacherId ?? undefined,
            present: attendance.present,
        },
    });

    const [selectedType, setSelectedType] = useState<"teacher" | "student">(roleLogin === "ADMIN" ? "teacher" : "student");
    const [selectedTeacher, setSelectedTeacher] = useState("");
    const [selectedStudent, setSelectedStudent] = useState("");
    const [selectedLesson, setSelectedLesson] = useState("");
    const [filteredStudents, setFilteredStudents] = useState<Student[]>(allStudents);
    const [filteredLessons, setFilteredLessons] = useState<Lesson[]>(allLessons);

    const isSubmitting = form.formState.isSubmitting;

    useEffect(() => {
        setFilteredStudents(allStudents);
    }, [allStudents]);

    useEffect(() => {
        if (selectedType === "student") {
            const selectedStudentData = filteredStudents.find(s => s.first_name + " " + s.last_name === selectedStudent);
            if (selectedStudentData) {
                setFilteredLessons(allLessons.filter(lesson => lesson.classId === selectedStudentData.classId));
            }
        } else if (selectedType === "teacher") {
            const teacherId = allTeachers.find(t => t.first_name + " " + t.last_name === selectedTeacher)?.id;
            setFilteredLessons(allLessons.filter(lesson => lesson.teacherId === teacherId));
        } else {
            setFilteredLessons(allLessons);
        }
    }, [filteredStudents, selectedType, allLessons, selectedTeacher, selectedStudent, allTeachers]);

    useEffect(() => {
        setSelectedTeacher(attendance.teacherId ? `${allTeachers.find(t => t.id === attendance.teacherId)?.first_name} ${allTeachers.find(t => t.id === attendance.teacherId)?.last_name}` : "");
        setSelectedStudent(attendance.studentId ? `${allStudents.find(s => s.id === attendance.studentId)?.first_name} ${allStudents.find(s => s.id === attendance.studentId)?.last_name}` : "");
        setSelectedLesson(attendance.lessonId ? allLessons.find(l => l.id === attendance.lessonId)?.name || "" : "");
    }, [attendance, allStudents, allTeachers, allLessons]);

    async function onSubmit(values: AttendanceSchema) {
        const formattedValues = {
            id: attendance.id,
            date: new Date(values.date),
            lessonId: values.lessonId,
            studentId: selectedType === "student" ? values.studentId : null,
            teacherId: selectedType === "teacher" ? values.teacherId : null,
            present: values.present,
        };
        const result = await updateAttendance(attendance.id, formattedValues);
        if (result.success) {
            toast.success(result.success.message);
            setOpen(false);
            router.push("/list/attendance");
        } else if (result.error) {
            toast.error(result.error.message);
        }
    }

    const handleTeacherSelect = (currentValue: string) => {
        const selectedTeacherData = allTeachers.find(t => t.id.toString() === currentValue);
        setSelectedTeacher(selectedTeacherData ? `${selectedTeacherData.first_name} ${selectedTeacherData.last_name}` : "");
        form.setValue("teacherId", parseInt(currentValue));
        setFilteredLessons(allLessons.filter(lesson => lesson.teacherId === selectedTeacherData?.id));
        setSelectedLesson("");
    };

    const handleStudentSelect = (currentValue: string) => {
        const selectedStudentData = filteredStudents.find(s => s.id.toString() === currentValue);
        setSelectedStudent(selectedStudentData ? `${selectedStudentData.first_name} ${selectedStudentData.last_name}` : "");
        form.setValue("studentId", parseInt(currentValue));
        setFilteredLessons(allLessons.filter(lesson => lesson.classId === selectedStudentData?.classId));
        setSelectedLesson("");
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full flex flex-row items-center justify-start gap-2">
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-4xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>Edit Kehadiran</AlertDialogTitle>
                    <AlertDialogDescription className="hidden">
                        Isi formulir berikut untuk mengedit kehadiran. Pastikan semua data yang dimasukkan sudah benar.
                    </AlertDialogDescription>
                    <div className="mt-4">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="flex flex-col gap-2"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left mb-2">
                                    <FormField
                                        control={form.control}
                                        name="date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tanggal</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} value={dayjs(field.value).format("YYYY-MM-DD")} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="present"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Kehadiran</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={field.value ? "Hadir" : "Tidak Hadir"}
                                                        onValueChange={(value) => field.onChange(value === "Hadir")}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih Kehadiran" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Hadir">Hadir</SelectItem>
                                                            <SelectItem value="Tidak Hadir">Tidak Hadir</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {roleLogin === "ADMIN" && (
                                        <div className="flex flex-col gap-2 mt-[6px]">
                                            <Label>Kehadiran untuk</Label>
                                            <Select
                                                value={selectedType}
                                                onValueChange={(value) => setSelectedType(value as "teacher" | "student")}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Kehadiran untuk" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="teacher">Guru</SelectItem>
                                                    <SelectItem value="student">Siswa</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-2 mt-[6px]">
                                        <Label>{selectedType === "teacher" ? "Nama Guru" : "Nama Siswa"}</Label>
                                        {selectedType === "teacher" && roleLogin === "ADMIN" && (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" className="w-full">
                                                        {selectedTeacher ? `${selectedTeacher}` : "Pilih Guru..."}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[200px] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Cari Guru..." className="h-9" />
                                                        <CommandList>
                                                            <CommandEmpty>Tidak ada guru ditemukan.</CommandEmpty>
                                                            <CommandGroup>
                                                                {allTeachers.map((teacher) => (
                                                                    <CommandItem
                                                                        key={teacher.id}
                                                                        value={teacher.id.toString()}
                                                                        onSelect={handleTeacherSelect}
                                                                    >
                                                                        {selectedTeacher === `${teacher.first_name} ${teacher.last_name}` ? `${selectedTeacher}` : `${teacher.first_name} ${teacher.last_name}`}
                                                                        <Check
                                                                            className={cn(
                                                                                "ml-auto",
                                                                                selectedTeacher === `${teacher.first_name} ${teacher.last_name}` ? "opacity-100" : "opacity-0"
                                                                            )}
                                                                        />
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                        {(selectedType === "student" || roleLogin === "TEACHER") && (
                                            <>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant="outline" className="w-full">
                                                            {selectedStudent ? `${selectedStudent}` : "Pilih Siswa..."}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[200px] p-0">
                                                        <Command>
                                                            <CommandInput placeholder="Cari Siswa..." className="h-9" />
                                                            <CommandList>
                                                                <CommandEmpty>Tidak ada siswa ditemukan.</CommandEmpty>
                                                                <CommandGroup>
                                                                    {filteredStudents.map((student) => (
                                                                        <CommandItem
                                                                            key={student.id}
                                                                            value={student.id.toString()}
                                                                            onSelect={handleStudentSelect}
                                                                        >
                                                                            {selectedStudent === `${student.first_name} ${student.last_name}` ? `${selectedStudent}` : `${student.first_name} ${student.last_name}`}
                                                                            <Check
                                                                                className={cn(
                                                                                    "ml-auto",
                                                                                    selectedStudent === `${student.first_name} ${student.last_name}` ? "opacity-100" : "opacity-0"
                                                                                )}
                                                                            />
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>Pelajaran</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full">
                                                    {selectedLesson ? `${selectedLesson}` : "Pilih Pelajaran..."}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[200px] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Cari Pelajaran..." className="h-9" />
                                                    <CommandList>
                                                        <CommandEmpty>Tidak ada pelajaran ditemukan.</CommandEmpty>
                                                        <CommandGroup>
                                                            {filteredLessons.map((lesson) => (
                                                                <CommandItem
                                                                    key={lesson.id}
                                                                    value={lesson.id.toString()}
                                                                    onSelect={(currentValue) => {
                                                                        const selectedLessonData = filteredLessons.find(l => l.id.toString() === currentValue);
                                                                        setSelectedLesson(selectedLessonData ? `${selectedLessonData.name}` : "");
                                                                        form.setValue("lessonId", parseInt(currentValue));
                                                                    }}
                                                                >
                                                                    {selectedLesson === lesson.name ? `${selectedLesson}` : `${lesson.name}`}
                                                                    <Check
                                                                        className={cn(
                                                                            "ml-auto",
                                                                            selectedLesson === lesson.name ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4">
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
