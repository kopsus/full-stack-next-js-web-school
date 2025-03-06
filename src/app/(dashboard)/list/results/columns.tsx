"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Assignment, Result, Exam, Student, Lesson, Subject, Class, Grade, Role } from "@prisma/client";
import { MoreHorizontal, Eye, Trash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";
import { deleteResult } from "@/lib/actions/result";
import ButtonUpdateResult from "@/components/forms/result/ResultFormUpdate";

type LessonWithDetails = Lesson & {
  subject: Subject;
  class: Class;
};

type AssignmentWithDetails = Assignment & {
  lesson: LessonWithDetails;
};

type ExamWithDetails = Exam & {
  lesson: LessonWithDetails;
};

export type ResultWithDetails = Result & {
  assignment?: AssignmentWithDetails | null;
  exam?: ExamWithDetails | null;
  student: Student & {
    class: Class;
    grade: Grade;
  };
  Allclasses: Class[];
  Allgrades: Grade[];
  Allstudents: Student[];
  Allsubjects: Subject[];
  Alllessons: Lesson[];
  Allassignments: Assignment[];
  Allexams: Exam[];
  roleLogin: Role;
};

export const columns: ColumnDef<ResultWithDetails>[] = [
  {
    id: "title",
    header: () => (
      <div className="truncate">Judul Tugas / Ujian</div>
    ),
    cell: ({ row }) => (
      <div>
        <span className="text-xs md:text-sm truncate">
          {row.original?.assignment ? row.original?.assignment?.title : row.original?.exam ? row.original?.exam?.title : "Tidak ada judul"}
        </span>
      </div>
    ),
  },
  {
    id: "score",
    header: () => (
      <div className="truncate">Skor</div>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col min-w-0">
        <p className="text-xs md:text-sm font-medium truncate">
          {row.original.score}
        </p>
      </div>
    ),
  },
  {
    id: "student",
    header: () => (
      <div className="truncate">Nama Siswa</div>
    ),
    cell: ({ row }) => (
      <div>
        <span className="text-xs md:text-sm truncate">
          {row.original?.student?.first_name} {row.original?.student?.last_name}
        </span>
      </div>
    ),
  },
  {
    id: "subject",
    header: () => (
      <div className="truncate">Mata Pelajaran</div>
    ),
    cell: ({ row }) => (
      <div>
        <span className="text-xs md:text-sm truncate">
          {row.original.assignment || row.original.exam ? row.original.assignment?.lesson.subject.name || row.original.exam?.lesson.subject.name : "Tidak ada mata pelajaran"}
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
      <div>
        <span className="text-xs md:text-sm truncate">
          {row.original.student.class.name}
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
          <ButtonViewResult data={row.original} />
          {(row.original.roleLogin === "ADMIN" || row.original.roleLogin === "TEACHER") && (
            <>
              <ButtonUpdateResult initialData={row.original} classes={row.original.Allclasses} grades={row.original.Allgrades} students={row.original.Allstudents} subjects={row.original.Allsubjects} lessons={row.original.Alllessons} assignments={row.original.Allassignments} exams={row.original.Allexams} />
              <ButtonDeleteResult id={row.original.id} />
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const ButtonViewResult = ({ data }: { data: ResultWithDetails }) => {
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
          <AlertDialogTitle>Detail Hasil</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="mt-4 space-y-4 text-left">
              <div>
                <span className="font-semibold block">Skor</span>
                <span>{data.score}</span>
              </div>
              <div>
                <span className="font-semibold block">Judul Tugas</span>
                <span>{data.assignment?.title || data.exam?.title || "Tidak ada judul"}</span>
              </div>
              <div>
                <span className="font-semibold block">Mata Pelajaran</span>
                <span>{data.assignment?.lesson.subject.name || data.exam?.lesson.subject.name || "Tidak ada mata pelajaran"}</span>
              </div>
              <div>
                <span className="font-semibold block">Kelas</span>
                <span>{data.student.class.name}</span>
              </div>
              <div>
                <span className="font-semibold block">Nama Siswa</span>
                <span>{data.student.first_name} {data.student.last_name}</span>
              </div>
              <div>
                <span className="font-semibold block">ID Siswa</span>
                <span>{data.student.id}</span>
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

const ButtonDeleteResult = ({ id }: { id: number }) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", id.toString());
    const result = await deleteResult(formData);
    if (result.success.status) {
      toast.success(result.success.message ?? "Berhasil menghapus hasil");
    } else {
      toast.error(result.error.message ?? "Gagal menghapus hasil");
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
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus hasil secara permanen
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
