import prisma from "@/lib/prisma";

import { decrypt } from "@/lib/actions/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import ButtonCreateAssignment from "@/components/forms/assigment/AssignmentFormCreate";
import { Prisma, Role } from "@prisma/client";

const AssignmentListPage = async () => {
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

  const queryWithStudentsAndResults = {
    include: {
      lesson: {
        include: {
          class: {
            include: {
              students: true
            }
          },
          teacher: true,
          subject: true
        }
      },
      results: {
        include: {
          student: true,
          answer: true
        }
      }
    }
  };

  const assignments = await prisma.assignment.findMany(
    role === "ADMIN" 
      ? { ...queryAdmin, ...queryWithStudentsAndResults }
      : role === "TEACHER"
        ? { ...queryTeacher, ...queryWithStudentsAndResults }
        : role === "PARENT"
          ? { ...queryParent, ...queryWithStudentsAndResults }
          : { ...queryStudent, ...queryWithStudentsAndResults }
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
    assignments: assignments.map((assignmentItem) => ({
      ...assignmentItem,
      lesson: assignmentItem.lesson,
      allLessons: lessons,
      allSubjects: allSubjects,
      allClasses: allClasses,
      subjectId: assignmentItem.lesson.subjectId,
      roleLogin: session.role as Role
    }))
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-4">
        <h1 className="text-lg font-semibold">Data Tugas</h1>
        {(role === "ADMIN" || role === "TEACHER") && (
          <ButtonCreateAssignment allLessons={lessons} allClasses={allClasses} allSubjects={allSubjects} />
        )}
      </div>
      {/* table */}
      <DataTable columns={columns} data={data.assignments} />
    </div>
  );
};

export default AssignmentListPage;
