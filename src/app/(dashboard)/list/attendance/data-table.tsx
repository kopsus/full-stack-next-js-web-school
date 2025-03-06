"use client"

import * as React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [searchTerm, setSearchTerm] = React.useState("")
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [selectedLesson, setSelectedLesson] = React.useState("All")
    const [selectedClass, setSelectedClass] = React.useState("All")
    const [selectedType, setSelectedType] = React.useState("All")
    const [startDate, setStartDate] = React.useState("")
    const [endDate, setEndDate] = React.useState("")

    const filteredData = React.useMemo(() => {
        return data.filter((row: any) => {
            const searchValue = searchTerm.toLowerCase()
            const matchesSearch = (
                (row.attendance.student?.first_name + " " + row.attendance.student?.last_name)?.toLowerCase().includes(searchValue) ||
                (row.attendance.teacher?.first_name + " " + row.attendance.teacher?.last_name)?.toLowerCase().includes(searchValue)
            )

            const matchesLesson = selectedLesson === "All" || row.attendance.lesson.name === selectedLesson
            const matchesClass = selectedClass === "All" || row.attendance.lesson.class.name === selectedClass
            const matchesType = selectedType === "All" ||
                (selectedType === "Guru" && row.attendance.teacherId) ||
                (selectedType === "Siswa" && row.attendance.studentId)

            const attendanceDate = new Date(row.attendance.date)
            const matchesDateRange = (!startDate || attendanceDate >= new Date(startDate)) &&
                (!endDate || attendanceDate <= new Date(endDate))

            return matchesSearch && matchesLesson && matchesClass && matchesType && matchesDateRange
        })
    }, [data, searchTerm, selectedLesson, selectedClass, selectedType, startDate, endDate])

    // Get unique lessons and classes from data
    const lessons = React.useMemo(() => {
        const uniqueLessons = new Set(data.map((row: any) => row.attendance.lesson.name))
        return Array.from(uniqueLessons)
    }, [data])

    const classes = React.useMemo(() => {
        const uniqueClasses = new Set(data.map((row: any) => row.attendance.lesson.class.name))
        return Array.from(uniqueClasses)
    }, [data])

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
        initialState: {
            columnPinning: {
                right: ["Aksi"],
            },
        },
    })

    return (
        <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start w-full md:w-10/12 my-2">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="search">Pencarian</Label>
                    <Input
                        id="search"
                        placeholder="Cari berdasarkan nama..."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        className="text-xs md:text-sm"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="lesson">Pelajaran</Label>
                    <Select value={selectedLesson} onValueChange={setSelectedLesson}>
                        <SelectTrigger id="lesson" className="text-xs md:text-sm">
                            <SelectValue placeholder="Pilih Pelajaran" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem className="text-xs md:text-sm" value="All">Semua</SelectItem>
                            {lessons.map((lesson) => (
                                <SelectItem key={lesson} className="text-xs md:text-sm" value={lesson}>
                                    {lesson}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="startDate">Tanggal Mulai</Label>
                    <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="text-xs md:text-sm"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="endDate">Tanggal Selesai</Label>
                    <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="text-xs md:text-sm"
                    />
                </div>
                {data.map((item: any) => item?.role === "ADMIN" || item?.role === "TEACHER" && (
                    <>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="class">Kelas</Label>
                            <Select value={selectedClass} onValueChange={setSelectedClass}>
                                <SelectTrigger id="class" className="text-xs md:text-sm">
                                    <SelectValue placeholder="Pilih Kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem className="text-xs md:text-sm" value="All">Semua</SelectItem>
                                    {classes.map((className) => (
                                        <SelectItem key={className} className="text-xs md:text-sm" value={className}>
                                            {className}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="type">Jenis Kehadiran</Label>
                            <Select value={selectedType} onValueChange={setSelectedType}>
                                <SelectTrigger id="type" className="text-xs md:text-sm">
                                    <SelectValue placeholder="Pilih Jenis" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem className="text-xs md:text-sm" value="All">Semua</SelectItem>
                                    <SelectItem className="text-xs md:text-sm" value="Guru">Guru</SelectItem>
                                    <SelectItem className="text-xs md:text-sm" value="Siswa">Siswa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </>
                ))}
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
