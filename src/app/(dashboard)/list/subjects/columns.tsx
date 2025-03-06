"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Subject, Teacher } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Pencil, Trash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { responServerAction } from "@/lib/actions/responServerActionType";
import { deleteSubject } from "@/lib/actions/subject";
import { toast } from "react-toastify";
import ButtonEditSubject from "@/components/forms/subject/SubjectFormEdit";

type SubjectWithTeachers = Subject & {
    teachers: Teacher[];
    allTeachers: Teacher[];
}

export const columns: ColumnDef<SubjectWithTeachers>[] = [
    {
        accessorKey: "name",
        header: () => (
            <div className="truncate">Nama Mata Pelajaran</div>
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
        id: "teachers",
        header: () => (
            <div className="truncate">Guru Pengajar</div>
        ),
        cell: ({ row }) => (
            <div className="truncate">
                {row.original.teachers?.map((teacher: Teacher, index: number) => (
                    <span key={teacher.id} className="text-xs md:text-sm">
                        {teacher.first_name} {teacher.last_name}
                        {index < (row.original.teachers?.length ?? 0) - 1 ? ", " : ""}
                    </span>
                ))}
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
                    <ButtonViewSubject data={row.original} />
                    <ButtonEditSubject teachers={row.original.allTeachers} subjectId={row.original.id} defaultValues={{
                        name: row.original.name,
                        teachers: row.original.teachers?.map((teacher) => teacher.id.toString()) ?? []
                    }} />
                    <ButtonDeleteSubject id={row.original.id} />
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];

const ButtonViewSubject = ({ data }: { data: SubjectWithTeachers }) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger className="w-full">
                <Button variant="ghost" size="sm" className="w-full flex flex-row items-center justify-start gap-2">
                    <Eye className="mr-2 h-4 w-4" />
                    Lihat
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Detail Mata Pelajaran</AlertDialogTitle>
                    <AlertDialogDescription className="mt-4">
                        <div className="space-y-4">
                            <div>
                                <p className="font-semibold">Nama Mata Pelajaran</p>
                                <p>{data.name}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Guru Pengajar</p>
                                <p>
                                    {data.teachers?.map((teacher, index) => (
                                        <span key={teacher.id}>
                                            {teacher.first_name} {teacher.last_name}
                                            {index < (data.teachers?.length ?? 0) - 1 ? ", " : ""}
                                        </span>
                                    ))}
                                </p>
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

const ButtonDeleteSubject = ({ id }: { id: number }) => {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result: responServerAction = await deleteSubject(id);
        if (result.success) {
            toast.success(result.success.message);
        } else {
            toast.error(result.error?.message ?? "Gagal menghapus mata pelajaran");
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger className="w-full">
                <Button variant="destructive" size="sm" className="w-full flex flex-row items-center justify-start gap-2">
                    <Trash className="mr-2 h-4 w-4" />
                    Hapus
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <form onSubmit={handleSubmit}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription className="mb-1">
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus mata pelajaran secara permanen
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