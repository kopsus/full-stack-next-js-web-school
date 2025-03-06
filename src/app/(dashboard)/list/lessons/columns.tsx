"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Lesson, Subject, Teacher, Class, Role } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Trash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { responServerAction } from "@/lib/actions/responServerActionType";
import { deleteLesson } from "@/lib/actions/lesson";
import { toast } from "react-toastify";
import ButtonEditLesson from "@/components/forms/lesson/LessonFormUpdate";
import dayjs from "@/lib/dayjs";

type LessonWithDetails = Lesson & {
    subject: Subject;
    teacher: Teacher;
    class: Class;
    allTeachers: Teacher[];
    allClasses: Class[];
    roleLogin: Role;
}

type DayNames = {
    [key: string]: string;
}

const dayNames: DayNames = {
    "MONDAY": "Senin",
    "TUESDAY": "Selasa",
    "WEDNESDAY": "Rabu",
    "THURSDAY": "Kamis",
    "FRIDAY": "Jumat",
    "SATURDAY": "Sabtu",
    "SUNDAY": "Minggu"
}

export const columns: ColumnDef<LessonWithDetails>[] = [
    {
        accessorKey: "name",
        header: () => (
            <div className="truncate">Nama Pelajaran</div>
        ),
        cell: ({ row }) => (
            <div className="flex flex-col min-w-0">
                <p className="text-xs md:text-sm font-medium truncate">
                    {row.original.name}
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
                <p className="text-xs md:text-sm">
                    {dayNames[row.original.day]}
                </p>
            </div>
        ),
    },
    {
        id: "time",
        header: () => (
            <div className="truncate">Waktu</div>
        ),
        cell: ({ row }) => (
            <div className="truncate">
                <span className="text-xs md:text-sm">
                    {dayjs(row.original.startTime).format('HH:mm')} - {dayjs(row.original.endTime).format('HH:mm')} WIB
                </span>
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
                    {row.original.subject.name}
                </span>
            </div>
        ),
    },
    {
        id: "teacher",
        header: () => (
            <div className="truncate">Guru</div>
        ),
        cell: ({ row }) => {
            const teacher = row.original.allTeachers.find(t => t.id === row.original.teacherId);
            return <div className="truncate text-xs md:text-sm">{teacher ? `${teacher.first_name} ${teacher.last_name}` : "Tidak ada"}</div>;
        },
    },
    {
        id: "class",
        header: () => (
            <div className="truncate">Kelas</div>
        ),
        cell: ({ row }) => (
            <div className="truncate">
                <span className="text-xs md:text-sm">
                    {row.original.class.name}
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
                    <ButtonViewLesson data={row.original} />
                    {
                        row.original.roleLogin === "ADMIN" && (
                            <>
                                <ButtonEditLesson lessonId={row.original.id} defaultValues={{
                                    name: row.original.name,
                                    day: row.original.day,
                                    startTime: row.original.startTime,
                                    endTime: row.original.endTime,
                                    subjectId: row.original.subjectId,
                                    teacherId: row.original.teacherId,
                                    classId: row.original.classId
                                }} teachers={row.original.allTeachers} classes={row.original.allClasses} />
                                <ButtonDeleteLesson id={row.original.id} />
                            </>
                        )
                    }
                            </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];

const ButtonViewLesson = ({ data }: { data: LessonWithDetails }) => {
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
                    <AlertDialogTitle>Detail Pelajaran</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="mt-4 space-y-4 text-left">
                            <div>
                                <span className="font-semibold block">Nama Pelajaran</span>
                                <span>{data.name}</span>
                            </div>
                            <div>
                                <span className="font-semibold block">Hari</span>
                                <span>{dayNames[data.day]}</span>
                            </div>
                            <div>
                                <span className="font-semibold block">Waktu</span>
                                <span>{dayjs(data.startTime).format('HH:mm')} - {dayjs(data.endTime).format('HH:mm')} WIB</span>
                            </div>
                            <div>
                                <span className="font-semibold block">Mata Pelajaran</span>
                                <span>{data.subject.name}</span>
                            </div>
                            <div>
                                <span className="font-semibold block">Guru</span>
                                <span>{`${data.teacher.first_name} ${data.teacher.last_name}`}</span>
                            </div>
                            <div>
                                <span className="font-semibold block">Kelas</span>
                                <span>{data.class.name}</span>
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

const ButtonDeleteLesson = ({ id }: { id: number }) => {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result: responServerAction = await deleteLesson(id);
        if (result.success) {
            toast.success(result.success.message);
        } else {
            toast.error(result.error?.message ?? "Gagal menghapus pelajaran");
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
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus pelajaran secara permanen
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