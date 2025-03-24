"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import {
  Assignment,
  Lesson,
  Subject,
  Teacher,
  Class,
  Student,
  Attendance,
  Role,
} from "@prisma/client";
import { MoreHorizontal, Eye, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";
import dayjs from "@/lib/dayjs";
import { deleteAttendance } from "@/lib/actions/attendance";
import ButtonUpdateAttendance from "@/components/forms/attandance/AttandanceFormUpdate";

export type AttendanceWithDetails = {
  attendance: Attendance & {
    lesson: Lesson & {
      class: Class;
      subject: Subject;
    };
    student: Student | null;
    teacher: Teacher | null;
  };
  allStudents: Student[];
  allTeachers: Teacher[];
  allLessons: Lesson[];
  roleLogin: Role;
};

export const columns: ColumnDef<AttendanceWithDetails>[] = [
  {
    accessorKey: "date",
    header: () => <div>Tanggal</div>,
    cell: ({ row }) => (
      <div className="flex flex-col min-w-0">
        <p className="text-xs md:text-sm font-medium truncate">
          {dayjs(row.original.attendance.date).format("dddd, DD MMMM YYYY")}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "present",
    header: () => <div>Kehadiran</div>,
    cell: ({ row }) => (
      <div className="flex flex-col min-w-0">
        <p
          className={`text-xs md:text-sm ${
            row.original.attendance.present === "HADIR"
              ? "text-green-500"
              : row.original.attendance.present === "ALFA"
              ? "text-red-500"
              : row.original.attendance.present === "SICK"
              ? "text-yellow-500"
              : "text-blue-500"
          }`}
        >
          {row.original.attendance.present === "HADIR"
            ? "Hadir"
            : row.original.attendance.present === "ALFA"
            ? "Alpha"
            : row.original.attendance.present === "SICK"
            ? "Sakit"
            : "Izin"}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: () => <div>Nama</div>,
    cell: ({ row }) => (
      <div className="flex flex-col min-w-0">
        <p className="text-xs md:text-sm truncate">
          {row.original.attendance.student
            ? `${row.original.attendance.student.first_name} ${row.original.attendance.student.last_name}`
            : `${row.original.attendance.teacher?.first_name} ${row.original.attendance.teacher?.last_name}`}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: () => <div>Jenis Kehadiran</div>,
    cell: ({ row }) => (
      <div className="flex flex-col min-w-0">
        <p className="text-xs md:text-sm">
          {row.original.attendance.teacherId ? "Guru" : "Siswa"}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "class",
    header: () => <div>Kelas</div>,
    cell: ({ row }) => (
      <div className="flex flex-col min-w-0">
        <p className="text-xs md:text-sm">
          {row.original.attendance.lesson.class.name}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "lesson",
    header: () => <div>Pelajaran</div>,
    cell: ({ row }) => (
      <div className="flex flex-col min-w-0">
        <p className="text-xs md:text-sm">
          {row.original.attendance.lesson.name}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "information",
    header: () => <div>Keterangan</div>,
    cell: ({ row }) => (
      <div className="flex flex-col min-w-0">
        <p className="text-xs md:text-sm">
          {row.original.attendance.information}
        </p>
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
          <ButtonViewAttendance data={row.original} />
          {(row.original.roleLogin === "ADMIN" ||
            row.original.roleLogin === "TEACHER") && (
            <>
              <ButtonUpdateAttendance
                allStudents={row.original.allStudents}
                allTeachers={row.original.allTeachers}
                allLessons={row.original.allLessons}
                attendance={row.original.attendance}
                roleLogin={row.original.roleLogin}
              />
              <ButtonDeleteAttendance id={row.original.attendance.id} />
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const ButtonViewAttendance = ({ data }: { data: AttendanceWithDetails }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="w-full">
          <Button
            variant="ghost"
            size="sm"
            className="w-full flex flex-row items-center justify-start gap-2"
          >
            <Eye className="mr-2 h-4 w-4" />
            Lihat
          </Button>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Detail Kehadiran</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <span className="font-semibold block">Hari dan Tanggal</span>
                <span>
                  {dayjs(data.attendance.date).format("dddd, DD MMMM YYYY")}
                </span>
              </div>
              <div>
                <span className="font-semibold block">Status Kehadiran</span>
                <span>
                  {data.attendance.present === "HADIR"
                    ? "Hadir"
                    : data.attendance.present === "ALFA"
                    ? "Alpha"
                    : data.attendance.present === "PERMISSION"
                    ? "Izin"
                    : "Sakit"}
                </span>
              </div>
              <div>
                <span className="font-semibold block">Mata Pelajaran</span>
                <span>{data.attendance.lesson.subject.name}</span>
              </div>
              <div>
                <span className="font-semibold block">Pelajaran</span>
                <span>{data.attendance.lesson.name}</span>
              </div>
              <div>
                <span className="font-semibold block">Kelas</span>
                <span>{data.attendance.lesson.class.name}</span>
              </div>
              <div>
                <span className="font-semibold block">
                  Nama {data.attendance.teacherId ? "Guru" : "Siswa"}
                </span>
                <span>
                  {data.attendance.student
                    ? `${data.attendance.student.first_name} ${data.attendance.student.last_name}`
                    : `${data.attendance.teacher?.first_name} ${data.attendance.teacher?.last_name}`}
                </span>
              </div>
              <div className="md:col-span-2">
                <span className="font-semibold block">Keterangan</span>
                <span>{data.attendance.information}</span>
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

const ButtonDeleteAttendance = ({ id }: { id: number }) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", id.toString());
    const result = await deleteAttendance(formData);
    if (result.success.status) {
      toast.success(result.success.message ?? "Berhasil menghapus kehadiran");
    } else {
      toast.error(result.error.message ?? "Gagal menghapus kehadiran");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="w-full">
          <Button
            variant="destructive"
            size="sm"
            className="w-full flex flex-row items-center justify-start gap-2"
          >
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
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus kehadiran
              secara permanen dan menghapus data dari server kami.
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
