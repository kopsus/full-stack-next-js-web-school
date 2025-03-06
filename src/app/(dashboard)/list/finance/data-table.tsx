"use client"

import * as React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [searchTerm, setSearchTerm] = React.useState("")
    const [typeFilter, setTypeFilter] = React.useState("All")

    const filteredData = React.useMemo(() => {
        return data.filter((row: any) => {
            const searchValue = searchTerm.toLowerCase()
            const matchesSearch = row.title.toLowerCase().includes(searchValue)

            const matchesType = typeFilter === "All" || row.type === typeFilter

            return matchesSearch && matchesType
        })
    }, [data, searchTerm, typeFilter])

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            columnPinning: {
                right: ["Aksi"],
            },
        },
    })

    return (
        <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start w-full md:w-8/12 my-2">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="search">Pencarian</Label>
                    <Input
                        id="search"
                        placeholder="Cari berdasarkan judul..."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        className="text-xs md:text-sm"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="type">Tipe</Label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger id="type" className="text-xs md:text-sm">
                            <SelectValue placeholder="Pilih Tipe" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem className="text-xs md:text-sm" value="All">Semua</SelectItem>
                            <SelectItem className="text-xs md:text-sm" value="INCOME">Pemasukan</SelectItem>
                            <SelectItem className="text-xs md:text-sm" value="EXPENSE">Pengeluaran</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead className={header.column.getIsPinned() ? "sticky right-0 z-10 bg-white bg-blend-saturation" : ""} key={header.id}>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell className={cell.column.getIsPinned() ? "sticky right-0 z-10 bg-white bg-blend-saturation" : ""} key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Tidak ada data.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground hidden md:block">
                    Menampilkan {table.getRowModel().rows.length} dari {filteredData.length} data | Halaman {table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Sebelumnya
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Selanjutnya
                    </Button>
                </div>
            </div>
        </div>
    )
}
