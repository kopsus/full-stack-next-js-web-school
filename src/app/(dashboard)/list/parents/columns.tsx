"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Student, Parent } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { responServerAction } from "@/lib/actions/responServerActionType";
import { toast } from "react-toastify";
import dayjs from "@/lib/dayjs";
import { deleteParent } from "@/lib/actions/parent";

type ParentWithStudent = Parent & {
    students: Student[] | null;
}

export const columns: ColumnDef<ParentWithStudent>[] = [
    {
        id: "info",
        accessorFn: (row) => `${row.first_name} ${row.last_name}`,
        header: () => (
            <div>Info</div>
        ),
        cell: ({ row }) => (
            <div className="flex flex-row gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage className="object-cover" src={row.original.img ? `../uploads/${row.original.img}` : "/avatar.png"} />
                    <AvatarFallback>
                        {(row.original.first_name?.slice(0, 1) ?? "") +
                            (row.original.last_name?.slice(0, 1) ?? "")}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                    <p className="text-xs md:text-sm font-medium truncate">
                        {row.original.first_name} {row.original.last_name}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">{row.original.email}</p>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "username",
        header: () => (
            <div className="truncate">Username</div>
        ),
        cell: ({ row }) => (
            <div className="truncate">{row.getValue("username")}</div>
        ),
    },
    {
        accessorKey: "phone",
        header: () => (
            <div className="truncate">No. Telepon</div>
        ),
        enableHiding: true,
        cell: ({ row }) => (
            <div className="truncate">{row.getValue("phone") || "-"}</div>
        ),
    },
    {
        id: "students",
        header: () => (
            <div className="truncate">Daftar Anak</div>
        ),
        cell: ({ row }) => (
            <div className="truncate">
                {row.original.students && row.original.students.length > 0 ? (
                    <div>
                        {row.original.students.map((student, index) => (
                            <span key={student.id}>
                                {student.first_name} {student.last_name}
                                {index < (row.original.students?.length ?? 0) - 1 ? ", " : ""}
                            </span>
                        ))}
                    </div>
                ) : (
                    "-"
                )}
            </div>
        ),
    },
    {
        accessorKey: "blood_type",
        header: () => (
            <div className="truncate">Golongan Darah</div>
        ),
        enableHiding: true,
        cell: ({ row }) => (
            <div className="truncate">{row.getValue("blood_type") || "-"}</div>
        ),
    },
    {
        accessorKey: "birthday",
        header: () => (
            <div className="truncate">Tanggal Lahir</div>
        ),
        enableHiding: true,
        cell: ({ row }) => (
            <div className="truncate">{dayjs(row.original.birthday).format("DD MMMM YYYY")}</div>
        ),
    },
    {
        accessorKey: "sex",
        header: () => (
            <div className="truncate">Jenis Kelamin</div>
        ),
        cell: ({ row }) => (
            <div className="truncate">
                {row.original.sex === "MALE" ? "Laki-laki" : "Perempuan"}
            </div>
        ),
        enableHiding: true,
    },
    {
        enablePinning: true,
        accessorKey: "Aksi",
        header: "Aksi",
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                    <DropdownMenuItem>
                        <Link href={`/list/parents/${row.original.id}`} className="flex flex-row items-center gap-2 w-full">
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href={`/list/parents/${row.original.id}/edit`} className="flex flex-row items-center gap-2 w-full">
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <ButtonDeleteParent id={row.original.id} />
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];


const ButtonDeleteParent = ({ id }: { id: number }) => {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result: responServerAction = await deleteParent(id);
        if (result.success) {
            toast.success(result.success.message);
        } else {
            toast.error(result.error?.message ?? "Gagal menghapus data orang tua");
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <div className="flex flex-row items-center gap-2 bg-red-600 text-white rounded-md px-2 py-1 w-full cursor-pointer">
                        <Trash className="mr-2 h-4 w-4" />
                        Hapus
                    </div>
                </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <form onSubmit={handleSubmit}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription className="mb-1">
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus akun orang tua secara permanen
                            dan menghapus data orang tua dari server kami.
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