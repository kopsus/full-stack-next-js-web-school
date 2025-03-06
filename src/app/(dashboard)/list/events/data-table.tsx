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
    const [classFilter, setClassFilter] = React.useState("All")
    const [dateFilter, setDateFilter] = React.useState("All")

    const filteredData = React.useMemo(() => {
        return data.filter((row: any) => {
            const searchValue = searchTerm.toLowerCase()
            const matchesSearch = row.title.toLowerCase().includes(searchValue)

            const matchesClass = classFilter === "All" || 
                (row.class && row.class.name === classFilter)

            const eventDate = new Date(row.startTime)
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            
            const yesterday = new Date(today)
            yesterday.setDate(yesterday.getDate() - 1)
            
            const tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)
            
            const lastWeekStart = new Date(today)
            lastWeekStart.setDate(lastWeekStart.getDate() - 7)
            
            const nextWeekEnd = new Date(today)
            nextWeekEnd.setDate(nextWeekEnd.getDate() + 7)

            let matchesDate = true
            if (dateFilter === "today") {
                matchesDate = eventDate.getTime() === today.getTime()
            } else if (dateFilter === "yesterday") {
                matchesDate = eventDate.getTime() === yesterday.getTime()
            } else if (dateFilter === "tomorrow") {
                matchesDate = eventDate.getTime() === tomorrow.getTime()
            } else if (dateFilter === "lastWeek") {
                matchesDate = eventDate >= lastWeekStart && eventDate < today
            } else if (dateFilter === "nextWeek") {
                matchesDate = eventDate > today && eventDate <= nextWeekEnd
            } else if (dateFilter === "latest") {
                // No additional filtering needed as data is already sorted by latest
                matchesDate = true
            }

            return matchesSearch && matchesClass && matchesDate
        })
    }, [data, searchTerm, classFilter, dateFilter])

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start w-full md:w-10/12 my-2">
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
                    <Label htmlFor="class">Kelas</Label>
                    <Select value={classFilter} onValueChange={setClassFilter}>
                        <SelectTrigger id="class" className="text-xs md:text-sm">
                            <SelectValue placeholder="Pilih Kelas" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem className="text-xs md:text-sm" value="All">Semua</SelectItem>
                            {data.map((row: any) => 
                                row.class && (
                                    <SelectItem 
                                        key={row.class.id} 
                                        className="text-xs md:text-sm" 
                                        value={row.class.name}
                                    >
                                        {row.class.name}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="date">Waktu</Label>
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                        <SelectTrigger id="date" className="text-xs md:text-sm">
                            <SelectValue placeholder="Pilih Waktu" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem className="text-xs md:text-sm" value="All">Semua</SelectItem>
                            <SelectItem className="text-xs md:text-sm" value="latest">Terbaru</SelectItem>
                            <SelectItem className="text-xs md:text-sm" value="today">Hari Ini</SelectItem>
                            <SelectItem className="text-xs md:text-sm" value="yesterday">Kemarin</SelectItem>
                            <SelectItem className="text-xs md:text-sm" value="tomorrow">Besok</SelectItem>
                            <SelectItem className="text-xs md:text-sm" value="lastWeek">Minggu Lalu</SelectItem>
                            <SelectItem className="text-xs md:text-sm" value="nextWeek">Minggu Depan</SelectItem>
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
