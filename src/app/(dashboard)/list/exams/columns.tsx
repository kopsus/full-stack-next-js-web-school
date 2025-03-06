"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Exam, Lesson, Subject, Teacher, Class, Role } from "@prisma/client";
import { MoreHorizontal, Eye, Trash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import ButtonEditExam from "@/components/forms/exam/ExamFormUpdate";
import { deleteExam } from "@/lib/actions/exam";
import { toast } from "react-toastify";
import dayjs from "@/lib/dayjs";

type LessonWithDetails = Lesson & {
    class: Class;
    teacher: Teacher;
    subject: Subject;
}

type ExamWithDetails = Exam & {
    lesson: LessonWithDetails;
    allLessons: LessonWithDetails[];
    allSubjects: Subject[];
    allClasses: Class[];
    subjectId: number;
    roleLogin: Role;
}

export const columns: ColumnDef<ExamWithDetails>[] = [
    {
        accessorKey: "title",
        header: () => (
            <div className="truncate">Judul Ujian</div>
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
        accessorKey: "day",
        header: () => (
            <div className="truncate">Hari</div>
        ),
        cell: ({ row }) => (
            <div className="flex flex-col min-w-0">
                <p className="text-xs md:text-sm truncate">
                    {dayjs(row.original.startTime).format('dddd, DD MMMM YYYY')}
                </p>
            </div>
        ),
    },
    {
        accessorKey: "startTime",
        header: () => (
            <div className="truncate">Waktu Mulai</div>
        ),
        cell: ({ row }) => (
            <div className="flex flex-col min-w-0">
                <p className="text-xs md:text-sm">
                    {dayjs(row.original.startTime).format('HH:mm')} WIB
                </p>
            </div>
        ),
    },
    {
        accessorKey: "endTime",
        header: () => (
            <div className="truncate">Waktu Selesai</div>
        ),
        cell: ({ row }) => (
            <div className="flex flex-col min-w-0">
                <p className="text-xs md:text-sm">
                    {dayjs(row.original.endTime).format('HH:mm')} WIB
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
                    <ButtonViewExam data={row.original} />
                    {(row.original.roleLogin === "ADMIN" || row.original.roleLogin === "TEACHER") && (
                        <>
                            <ButtonEditExam examId={row.original.id} allSubjects={row.original.allSubjects} allLessons={row.original.allLessons} defaultValues={row.original} />
                            <ButtonDeleteExam id={row.original.id} />
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];

const ButtonViewExam = ({ data }: { data: ExamWithDetails }) => {
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
                    <AlertDialogTitle>Detail Ujian</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="mt-4 space-y-4 text-left">
                            <div>
                                <span className="font-semibold block">Judul Ujian</span>
                                <span>{data.title}</span>
                            </div>
                            <div>
                                <span className="font-semibold block">Hari</span>
                                <span>{dayjs(data.startTime).format('dddd, DD MMMM YYYY')}</span>
                            </div>
                            <div>
                                <span className="font-semibold block">Waktu Mulai</span>
                                <span>{dayjs(data.startTime).format('HH:mm')} WIB</span>
                            </div>
                            <div>
                                <span className="font-semibold block">Waktu Selesai</span>
                                <span>{dayjs(data.endTime).format('HH:mm')} WIB</span>
                            </div>
                            <div>
                                <span className="font-semibold block">Mata Pelajaran</span>
                                <span>{data.lesson.subject.name}</span>
                            </div>
                            <div>
                                <span className="font-semibold block">Kelas</span>
                                <span>{data.lesson.class.name}</span>
                            </div>
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

const ButtonDeleteExam = ({ id }: { id: number }) => {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await deleteExam(id);
        if (result.success.status) {
            toast.success(result.success.message ?? "Berhasil menghapus ujian");
        } else {
            toast.error(result.error.message ?? "Gagal menghapus ujian");
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
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus ujian secara permanen
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