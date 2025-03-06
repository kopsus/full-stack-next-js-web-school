"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Class, Teacher, Grade, Role } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Trash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { responServerAction } from "@/lib/actions/responServerActionType";
import { deleteClass } from "@/lib/actions/class";
import { toast } from "react-toastify";
import ButtonEditClass from "@/components/forms/class/ClassFormUpdate";

type ClassWithDetails = Class & {
    supervisor: Teacher | null;
    grade: Grade;
    allTeachers: Teacher[];
    allGrades: Grade[];
    roleLogin: Role;
}

export const columns: ColumnDef<ClassWithDetails>[] = [
    {
        accessorKey: "name",
        header: () => (
            <div className="truncate">Nama Kelas</div>
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
        accessorKey: "capacity",
        header: () => (
            <div className="truncate">Kapasitas</div>
        ),
        cell: ({ row }) => (
            <div className="flex flex-col min-w-0">
                <p className="text-xs md:text-sm">
                    {row.original.capacity} siswa
                </p>
            </div>
        ),
    },
    {
        id: "grade",
        header: () => (
            <div className="truncate">Tingkat</div>
        ),
        cell: ({ row }) => (
            <div className="truncate">
                <span className="text-xs md:text-sm">
                    {row.original.grade.level}
                </span>
            </div>
        ),
    },
    {
        id: "supervisor",
        header: () => (
            <div className="truncate">Wali Kelas</div>
        ),
        cell: ({ row }) => (
            <div className="truncate">
                <span className="text-xs md:text-sm">
                    {row.original.supervisor ? `${row.original.supervisor.first_name} ${row.original.supervisor.last_name}` : '-'}
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
                    <ButtonViewClass data={row.original} />
                    {row.original.roleLogin === "ADMIN" && (
                        <>
                            <ButtonEditClass classId={row.original.id} defaultValues={{
                            name: row.original.name,
                            capacity: row.original.capacity,
                            gradeId: row.original.gradeId,
                            supervisorId: row.original.supervisorId ? Number(row.original.supervisorId) : undefined
                        }} teachers={row.original.allTeachers} grades={row.original.allGrades} />
                            <ButtonDeleteClass id={row.original.id} />
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];

const ButtonViewClass = ({ data }: { data: ClassWithDetails }) => {
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
                    <AlertDialogTitle>Detail Kelas</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="mt-4 space-y-4 text-left">
                            <div>
                                <span className="font-semibold block">Nama Kelas</span>
                                <span>{data.name}</span>
                            </div>
                            <div>
                                <span className="font-semibold block">Kapasitas</span>
                                <span>{data.capacity} siswa</span>
                            </div>
                            <div>
                                <span className="font-semibold block">Tingkat</span>
                                <span>{data.grade.level}</span>
                            </div>
                            <div>
                                <span className="font-semibold block">Wali Kelas</span>
                                <span>{data.supervisor ? `${data.supervisor.first_name} ${data.supervisor.last_name}` : '-'}</span>
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

const ButtonDeleteClass = ({ id }: { id: number }) => {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result: responServerAction = await deleteClass(id);
        if (result.success) {
            toast.success(result.success.message);
        } else {
            toast.error(result.error?.message ?? "Gagal menghapus kelas");
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
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus kelas secara permanen
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