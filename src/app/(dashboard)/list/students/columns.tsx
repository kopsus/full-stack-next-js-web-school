"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Student, Class, Role } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { responServerAction } from "@/lib/actions/responServerActionType";
import { deleteStudent } from "@/lib/actions/student";
import { toast } from "react-toastify";
import dayjs from "@/lib/dayjs";

type StudentWithClass = Student & {
    class: Class | null;
    roleLogin: Role;
}

export const columns: ColumnDef<StudentWithClass>[] = [
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
            <div className="truncate">Telepon</div>
        ),
        enableHiding: true,
        cell: ({ row }) => (
            <div className="truncate">{row.getValue("phone")}</div>
        ),
    },
    {
        id: "class",
        header: () => (
            <div className="truncate">Kelas</div>
        ),
        cell: ({ row }) => (
            <div className="truncate">{row.original.class?.name ?? "-"}</div>
        ),
    },
    {
        accessorKey: "blood_type",
        header: () => (
            <div className="truncate">Golongan Darah</div>
        ),
        enableHiding: true,
        cell: ({ row }) => (
            <div className="truncate">{row.getValue("blood_type")}</div>
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
        accessorKey: "address",
        header: () => (
            <div className="truncate">Alamat</div>
        ),
        enableHiding: true,
        cell: ({ row }) => (
            <div className="truncate">{row.getValue("address")}</div>
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
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                    <DropdownMenuItem>
                        <Link href={`/list/students/${row.original.id}`} className="flex flex-row items-center gap-2 w-full">
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat
                        </Link>
                    </DropdownMenuItem>
                    {
                        row.original.roleLogin === "ADMIN" && (
                            <>
                                <DropdownMenuItem>
                                    <Link href={`/list/students/${row.original.id}/edit`} className="flex flex-row items-center gap-2 w-full">
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit
                                    </Link>
                                </DropdownMenuItem>
                                <ButtonDeleteStudent id={row.original.id} />
                            </>
                        )
                    }
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];


const ButtonDeleteStudent = ({ id }: { id: number }) => {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result: responServerAction = await deleteStudent(id);
        if (result.success) {
            toast.success(result.success.message);
        } else {
            toast.error(result.error?.message ?? "Gagal menghapus data siswa");
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
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus akun siswa secara permanen
                            dan menghapus data siswa dari server kami.
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