import prisma from "@/lib/prisma";

import { decrypt } from "@/lib/actions/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ButtonCreateExam from "@/components/forms/exam/ExamFormCreate";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Prisma, Role } from "@prisma/client";

const ExamListPage = async () => {
  const session = await decrypt(cookies().get("session")?.value);

  if (!session) {
    redirect("/");
  }

  const role: Role = session.role as Role;

  const queryTeacher = {
    where: {
      lesson: {
        teacherId: Number(session.id)
      }
    },
    orderBy: {
      id: Prisma.SortOrder.desc,
    },
    include: {
      lesson: {
        include: {
          class: true,
          teacher: true,
          subject: true
        }
      }
    }
  };

  const queryAdmin = {
    orderBy: {
      id: Prisma.SortOrder.desc,
    },
    include: {
      lesson: {
        include: {
          class: true,
          teacher: true,
          subject: true
        }
      }
    }
  };

  const queryStudent = {
    where: {
      lesson: {
        class: {
          students: {
            some: {
              id: Number(session.id)
            }
          }
        }
      }
    },
    orderBy: {
      id: Prisma.SortOrder.desc,
    },
    include: {
      lesson: {
        include: {
          class: true,
          teacher: true,
          subject: true
        }
      }
    }
  };

  const queryParent = {
    where: {
      lesson: {
        class: {
          students: {
            some: {
              parentId: Number(session.id)
            }
          }
        }
      }
    },
    orderBy: {
      id: Prisma.SortOrder.desc,
    },
    include: {
      lesson: {
        include: {
          class: true,
          teacher: true,
          subject: true
        }
      }
    }
  };

  const exams = await prisma.exam.findMany(
    role === "ADMIN" 
      ? queryAdmin 
      : role === "TEACHER"
        ? queryTeacher
        : role === "PARENT"
          ? queryParent
          : queryStudent
  );

  const lessons = await prisma.lesson.findMany({
    include: {
      class: true,
      teacher: true,
      subject: true
    }
  });

  const allSubjects = await prisma.subject.findMany();
  const allClasses = await prisma.class.findMany();
  const data = {
    exams: exams.map((examItem) => ({
      ...examItem,
      lesson: examItem.lesson,
      allLessons: lessons,
      allSubjects: allSubjects,
      allClasses: allClasses,
      subjectId: examItem.lesson.subjectId,
      roleLogin: session.role as Role
    }))
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-4">
        <h1 className="text-lg font-semibold">Data Ujian</h1>
        {(session.role === "ADMIN" || session.role === "TEACHER") && (
          <ButtonCreateExam allSubjects={allSubjects} allLessons={lessons} />
        )}
      </div>
      {/* table */}
      <DataTable columns={columns} data={data.exams} />
    </div>
  );
};

export default ExamListPage;
