"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Announcement, Class, Role } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Trash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { responServerAction } from "@/lib/actions/responServerActionType";
import { deleteAnnouncement } from "@/lib/actions/announcement";
import { toast } from "react-toastify";
import dayjs from "@/lib/dayjs";
import ButtonEditAnnouncement from "@/components/forms/announcement/AnnouncementFormUpdate";

type AnnouncementWithDetails = {
    id: number;
    title: string;
    description: string;
    date: Date;
    classId: number | null;
    allClasses: {
        id: number;
        name: string;
        capacity: number;
        supervisorId: number | null;
        gradeId: number;
    }[];
    roleLogin: Role;
};

export const columns: ColumnDef<AnnouncementWithDetails>[] = [
    {
        accessorKey: "title",
        header: () => (
            <div className="truncate">Judul</div>
        ),
        cell: ({ row }) => (
            <div className="flex flex-col max-w-[200px]">
                <p className="text-xs md:text-sm font-medium truncate">
                    {row.original.title}
                </p>
            </div>
        ),
    },
    {
        accessorKey: "description",
        header: () => (
            <div className="truncate">Deskripsi</div>
        ),
        cell: ({ row }) => (
            <div className="flex flex-col max-w-[300px]">
                <p className="text-xs md:text-sm truncate">
                    {row.original.description.slice(0, 20)}
                </p>
            </div>
        ),
    },
    {
        accessorKey: "date",
        header: () => (
            <div className="truncate">Tanggal</div>
        ),
        cell: ({ row }) => (
            <div className="min-w-[200px]">
                <span className="text-xs md:text-sm truncate">
                    {dayjs(row.original.date).format('dddd, DD MMMM YYYY')}
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
            <div className="min-w-[100px]">
                <span className="text-xs md:text-sm truncate">
                    {row.original.classId ? row.original.allClasses.find(cls => cls.id === row.original.classId)?.name : 'Umum'}
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
                    <ButtonViewAnnouncement data={row.original} />
                    {(row.original.roleLogin === "ADMIN" || row.original.roleLogin === "TEACHER") && (
                        <>
                            <ButtonEditAnnouncement defaultValues={row.original} allClasses={row.original.allClasses} />
                            <ButtonDeleteAnnouncement id={row.original.id} />
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];

const ButtonViewAnnouncement = ({ data }: { data: AnnouncementWithDetails }) => {
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
                    <AlertDialogTitle>Detail Pengumuman</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="mt-4 space-y-4 text-left">
                            <div>
                                <span className="font-semibold block">Judul</span>
                                <span>{data.title}</span>
                            </div>
                            <div>
                                <span className="font-semibold block">Deskripsi</span>
                                <span>{data.description}</span>
                            </div>
                            <div>
                                <span className="font-semibold block">Tanggal</span>
                                <span>{dayjs(data.date).format('DD MMMM YYYY')}</span>
                            </div>
                            <div>
                                <span className="font-semibold block">Kelas</span>
                                <span>{data.classId ? data.allClasses.find(cls => cls.id === data.classId)?.name : 'Umum'}</span>
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

const ButtonDeleteAnnouncement = ({ id }: { id: number }) => {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result: responServerAction = await deleteAnnouncement(id);
        if (result.success) {
            toast.success(result.success.message);
        } else {
            toast.error(result.error?.message ?? "Gagal menghapus pengumuman");
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
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus pengumuman secara permanen
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