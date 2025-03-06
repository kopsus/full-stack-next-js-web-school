"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Finance, Type } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Trash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { responServerAction } from "@/lib/actions/responServerActionType";
import { toast } from "react-toastify";
import dayjs from "@/lib/dayjs";
import { deleteFinance } from "@/lib/actions/finance";
import ButtonUpdateFinance from "@/components/forms/finance/FinanceFormUpdate";

export const columns: ColumnDef<Finance>[] = [
    {
        accessorKey: "title",
        header: () => (
            <div>Judul</div>
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
            <div>Deskripsi</div>
        ),
        cell: ({ row }) => (
            <div className="flex flex-col max-w-[300px]">
                <p className="text-xs md:text-sm truncate">
                    {row.original.description}
                </p>
            </div>
        ),
    },
    {
        accessorKey: "date",
        header: () => (
            <div>Tanggal</div>
        ),
        cell: ({ row }) => (
            <div className="min-w-[200px]">
                <span className="text-xs md:text-sm">
                    {dayjs(row.original.date).format('dddd, DD MMMM YYYY')}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "amount",
        header: () => (
            <div>Jumlah</div>
        ),
        cell: ({ row }) => (
            <div className="min-w-[150px]">
                <span className="text-xs md:text-sm">
                    {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                    }).format(row.original.amount)}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "type",
        header: () => (
            <div>Tipe</div>
        ),
        cell: ({ row }) => (
            <div className="min-w-[100px]">
                <span className={`text-xs md:text-sm px-2 py-1 rounded-full ${
                    row.original.type === "INCOME" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                    {row.original.type === "INCOME" ? "Pemasukan" : "Pengeluaran"}
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
                    <ButtonViewFinance data={row.original} />
                    <ButtonUpdateFinance data={row.original} />
                    <ButtonDeleteFinance id={row.original.id} />
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];

const ButtonViewFinance = ({ data }: { data: Finance }) => {
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
                    <AlertDialogTitle>Detail Keuangan</AlertDialogTitle>
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
                                <span className="font-semibold block">Jumlah</span>
                                <span>{new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 0,
                                }).format(data.amount)}</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="font-semibold block">Tipe</span>
                                <span className={`px-2 py-1 rounded-full w-max ${
                                    data.type === "INCOME" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}>
                                    {data.type === "INCOME" ? "Pemasukan" : "Pengeluaran"}
                                </span>
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

const ButtonDeleteFinance = ({ id }: { id: number }) => {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result: responServerAction = await deleteFinance(id);
        if (result.success) {
            toast.success(result.success.message);
        } else {
            toast.error(result.error?.message ?? "Gagal menghapus keuangan");
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
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data keuangan secara permanen
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
