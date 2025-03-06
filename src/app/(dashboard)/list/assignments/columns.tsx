"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Assignment, Lesson, Subject, Teacher, Class, Role, Student } from "@prisma/client";
import { MoreHorizontal, Eye, Trash, Upload, CheckCircle, Download, Loader2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteAssignment, uploadAssignmentAnswer } from "@/lib/actions/assignment";
import { toast } from "react-toastify";
import dayjs from "@/lib/dayjs";
import ButtonEditAssignment from "@/components/forms/assigment/AssignmentFormUpdate";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

type LessonWithDetails = Lesson & {
    class: Class & {
        students: Student[];
    };
    teacher: Teacher;
    subject: Subject;
}

type AssignmentWithDetails = Assignment & {
    lesson: LessonWithDetails;
    allSubjects: Subject[];
    allClasses: Class[];
    allLessons: Lesson[];
    roleLogin: Role;
    results: {
        id: number;
        studentId: number;
        student: Student;
        answer: {
            id: number;
            answer: string;
            fileType: string;
        } | null;
    }[];
}

export const columns: ColumnDef<AssignmentWithDetails>[] = [
    {
        accessorKey: "title",
        header: () => (
            <div className="truncate">Judul Tugas</div>
        ),
        cell: ({ row }) => (
            <div className="flex flex-col min-w-0">
                <p className="text-xs md:text-sm font-medium truncate">
                    {row.original.title}
                </p>
            </div>
        ),
    },
    {
        accessorKey: "startDate",
        header: () => (
            <div className="truncate">Tanggal Mulai</div>
        ),
        cell: ({ row }) => (
            <div className="flex flex-col min-w-0">
                <p className="text-xs md:text-sm truncate">
                    {dayjs(row.original.startDate).format('DD MMMM YYYY')}
                </p>
            </div>
        ),
    },
    {
        accessorKey: "dueDate",
        header: () => (
            <div className="truncate">Tanggal Jatuh Tempo</div>
        ),
        cell: ({ row }) => (
            <div className="flex flex-col min-w-0">
                <p className="text-xs md:text-sm">
                    {dayjs(row.original.dueDate).format('DD MMMM YYYY')}
                </p>
            </div>
        ),
    },
    {
        id: "subject",
        header: () => (
            <div className="truncate">Mata Pelajaran</div>
        ),
        cell: ({ row }) => (
            <div className="truncate">
                <span className="text-xs md:text-sm">
                    {row.original.lesson.subject.name}
                </span>
            </div>
        ),
    },
    {
        id: "class",
        header: () => (
            <div className="truncate">Kelas</div>
        ),
        cell: ({ row }) => (
            <div className="truncate">
                <span className="text-xs md:text-sm">
                    {row.original.lesson.class.name}
                </span>
            </div>
        ),
    },
    {
        enablePinning: true,
        accessorKey: "Aksi",
        header: "Aksi",
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <div className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                    <ButtonViewAssignment data={row.original} />
                    {(row.original.roleLogin === "ADMIN" || row.original.roleLogin === "TEACHER") && (
                        <>
                            <ButtonEditAssignment allSubjects={row.original.allSubjects} allLessons={row.original.allLessons} allClasses={row.original.allClasses} assignmentId={row.original.id} defaultValues={row.original} />
                            <ButtonDeleteAssignment id={row.original.id} />
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];

const ButtonViewAssignment = ({ data }: { data: AssignmentWithDetails }) => {
    const [isUploading, setIsUploading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        try {
            const formData = new FormData();
            const fileInput = e.target as HTMLFormElement;
            const file = fileInput.file.files[0];
            formData.append('file', file);
            
            const result = await uploadAssignmentAnswer(data.id,  formData);
            if (result.success.status) {
                toast.success(result.success.message ?? "Berhasil mengunggah jawaban");
            } else {
                toast.error(result.error.message ?? "Gagal mengunggah jawaban");
            }
        } catch (err) {
            toast.error("Terjadi kesalahan saat mengunggah jawaban");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDownload = (answer: string | null, fileType: string | null) => {
        if (!answer) return;
        
        const byteCharacters = atob(answer);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray]);
        
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        const fileExtension = fileType || 'pdf';
        link.download = `jawaban-${data.title}.${fileExtension}`;
        link.click();
    };

    const studentResult = data.roleLogin === "STUDENT" ? 
        data.results?.find(r => r.studentId === data.lesson.class.students[0].id)?.answer : null;

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <div className="w-full">
                    <Button variant="ghost" size="sm" className="w-full flex flex-row items-center justify-start gap-2">
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat
                    </Button>
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Detail Tugas</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="mt-4 space-y-4 text-left">
                            <div>
                                <span className="font-semibold block">Judul Tugas</span>
                                <span>{data.title}</span>
                            </div>
                            <div>
                                <span className="font-semibold block">Tanggal Mulai</span>
                                <span>{dayjs(data.startDate).format('DD MMMM YYYY')}</span>
                            </div>
                            <div>
                                <span className="font-semibold block">Tanggal Jatuh Tempo</span>
                                <span>{dayjs(data.dueDate).format('DD MMMM YYYY')}</span>
                            </div>
                            <div>
                                <span className="font-semibold block">Mata Pelajaran</span>
                                <span>{data.lesson.subject.name}</span>
                            </div>
                            <div>
                                <span className="font-semibold block">Kelas</span>
                                <span>{data.lesson.class.name}</span>
                            </div>

                            {
                                <>
                                    {data.roleLogin === "STUDENT" && (
                                        <>
                                            {studentResult?.answer ? (
                                                <div className="space-y-4">
                                                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                                                        <div className="flex items-center gap-2 text-green-700">
                                                            <CheckCircle className="h-5 w-5" />
                                                            <span className="font-medium">Jawaban telah dikumpulkan</span>
                                                        </div>
                                                        <p className="text-sm text-green-600 mt-2">
                                                            Anda sudah mengumpulkan jawaban untuk tugas ini
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col md:flex-row gap-2">
                                                        <Button onClick={() => handleDownload(studentResult.answer, studentResult.fileType)} className="flex-1">
                                                            <Download className="w-4 h-4 mr-2" />
                                                            Download Jawaban
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="outline" className="flex-1">
                                                                    <Upload className="w-4 h-4 mr-2" />
                                                                    Ganti Jawaban
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <form onSubmit={handleSubmit}>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Upload Jawaban Baru</AlertDialogTitle>
                                                                        <div className="space-y-2">
                                                                            <Label htmlFor="file">Upload Jawaban (PDF/DOC)</Label>
                                                                            <Input 
                                                                                id="file" 
                                                                                type="file" 
                                                                                accept=".pdf,.doc,.docx"
                                                                                className="cursor-pointer"
                                                                                required
                                                                            />
                                                                            <p className="text-sm text-gray-500">
                                                                                Format yang diterima: PDF, DOC, DOCX
                                                                            </p>
                                                                        </div>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel type="button">Batal</AlertDialogCancel>
                                                                        <AlertDialogAction type="submit" disabled={isUploading}>
                                                                            {isUploading ? (
                                                                                <>
                                                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                                    Mengunggah...
                                                                                </>
                                                                            ) : (
                                                                                'Upload'
                                                                            )}
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </form>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </div>
                                            ) : (
                                                <form onSubmit={handleSubmit} className="mt-6">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="file">Upload Jawaban (PDF/DOC)</Label>
                                                        <Input 
                                                            id="file" 
                                                            type="file" 
                                                            accept=".pdf,.doc,.docx"
                                                            className="cursor-pointer"
                                                            required
                                                        />
                                                        <p className="text-sm text-gray-500">
                                                            Format yang diterima: PDF, DOC, DOCX
                                                        </p>
                                                    </div>
                                                    <Button type="submit" className="mt-4 w-full" disabled={isUploading}>
                                                        {isUploading ? (
                                                            <>
                                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                Mengunggah...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Upload className="w-4 h-4 mr-2" />
                                                                Upload Jawaban
                                                            </>
                                                        )}
                                                    </Button>
                                                </form>
                                            )}
                                        </>
                                    )}
                                    {(data.roleLogin === "ADMIN" || data.roleLogin === "TEACHER") && (
                                        <div className="space-y-4">
                                            <div className="mt-6">
                                                <h4 className="font-medium mb-4">Daftar Jawaban Siswa</h4>
                                                <div className="space-y-4">
                                                    {data.lesson.class.students.map((student) => {
                                                        const result = data.results?.find(r => r.studentId === student.id);
                                                        const answer = result?.answer;
                                                        return (
                                                            <div key={student.id} className="p-4 bg-gray-50 rounded-lg border">
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <p className="font-medium">{student.first_name} {student.last_name}</p>
                                                                        {answer ? (
                                                                            <span className="text-sm text-green-600">Sudah mengumpulkan</span>
                                                                        ) : (
                                                                            <span className="text-sm text-red-600">Belum mengumpulkan</span>
                                                                        )}
                                                                    </div>
                                                                    {answer && (
                                                                        <Button onClick={() => handleDownload(answer.answer, answer.fileType)} size="sm">
                                                                            <Download className="w-4 h-4 mr-2" />
                                                                            Download
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            }
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Tutup</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

const ButtonDeleteAssignment = ({ id }: { id: number }) => {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await deleteAssignment(id);
        if (result.success.status) {
            toast.success(result.success.message ?? "Berhasil menghapus tugas");
        } else {
            toast.error(result.error.message ?? "Gagal menghapus tugas");
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <div className="w-full">
                    <Button variant="destructive" size="sm" className="w-full flex flex-row items-center justify-start gap-2">
                        <Trash className="mr-2 h-4 w-4" />
                        Hapus
                    </Button>
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <form onSubmit={handleSubmit}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription className="mb-1">
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus tugas secara permanen
                            dan menghapus data dari server kami.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-2">
                        <AlertDialogCancel type="button">Batal</AlertDialogCancel>
                        <AlertDialogAction type="submit">Lanjutkan</AlertDialogAction>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
};