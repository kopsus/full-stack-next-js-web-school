import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/actions/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import ButtonCreateAttendance from "@/components/forms/attandance/AttandanceFormCreate";
import { Prisma, Role } from "@prisma/client";

const AttendanceListPage = async () => {
  const session = await decrypt(cookies().get("session")?.value);

  if (!session) {
    redirect("/");
  }

  const role: Role = session.role as Role;

  const queryTeacher = {
    where: {
      studentId: {
        not: null,
      },
      OR: [
        {
          teacherId: Number(session.id),
        },
        {
          lesson: {
            teacherId: Number(session.id),
          },
        },
      ],
    },
    include: {
      student: {
        include: {
          class: true,
        },
      },
      teacher: true,
      lesson: {
        include: {
          class: true,
          subject: true,
        },
      },
    },
    orderBy: {
      id: Prisma.SortOrder.desc,
    },
  };

  const queryAdmin = {
    include: {
      student: {
        include: {
          class: true,
        },
      },
      teacher: true,
      lesson: {
        include: {
          class: true,
          subject: true,
        },
      },
    },
    orderBy: {
      id: Prisma.SortOrder.desc,
    },
  };

  const queryStudent = {
    where: {
      studentId: Number(session.id),
    },
    include: {
      student: {
        include: {
          class: true,
        },
      },
      teacher: true,
      lesson: {
        include: {
          class: true,
          subject: true,
        },
      },
    },
    orderBy: {
      id: Prisma.SortOrder.desc,
    },
  };

  const queryParent = {
    where: {
      student: {
        parentId: Number(session.id),
      },
    },
    include: {
      student: {
        include: {
          class: true,
        },
      },
      teacher: true,
      lesson: {
        include: {
          class: true,
          subject: true,
        },
      },
    },
    orderBy: {
      id: Prisma.SortOrder.desc,
    },
  };

  const attendance = await prisma.attendance.findMany(
    role === "ADMIN"
      ? queryAdmin
      : role === "TEACHER"
      ? queryTeacher
      : role === "PARENT"
      ? queryParent
      : queryStudent
  );

  const allStudents = await prisma.student.findMany({
    include: {
      class: true,
      attendances: true,
    },
  });
  const allTeachers = await prisma.teacher.findMany();
  const allLessons = await prisma.lesson.findMany();

  const formattedAttendance = attendance.map((item) => ({
    attendance: item,
    allStudents,
    allTeachers,
    allLessons,
    roleLogin: session.role as Role,
  }));

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex flex-col md:flex-row justify-between gap-2 md:items-center mb-2">
        <h1 className="text-sm md:text-lg font-semibold">Data Kehadiran</h1>
        {(role === "ADMIN" || role === "TEACHER") && (
          <ButtonCreateAttendance
            allStudents={allStudents}
            allTeachers={allTeachers}
            allLessons={allLessons}
            roleLogin={role}
          />
        )}
      </div>
      {/* table */}
      <DataTable columns={columns} data={formattedAttendance} />
    </div>
  );
};

export default AttendanceListPage;
