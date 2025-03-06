import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/actions/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import ButtonCreateResult from "@/components/forms/result/ResultFormCreate";
import { Prisma, Role } from "@prisma/client";

const ResultListPage = async () => {
  const session = await decrypt(cookies().get("session")?.value);

  if (!session) {
    redirect("/");
  }

  const role: Role = session.role as Role;

  const queryTeacher = {
    where: {
      OR: [
        {
          assignment: {
            lesson: {
              teacherId: Number(session.id)
            }
          }
        },
        {
          exam: {
            lesson: {
              teacherId: Number(session.id)
            }
          }
        }
      ]
    },
    orderBy: {
      id: Prisma.SortOrder.desc,
    },
    include: {
      assignment: {
        include: {
          lesson: {
            include: {
              class: true,
              teacher: true,
              subject: true,
            },
          },
        },
      },
      exam: {
        include: {
          lesson: {
            include: {
              class: true,
              teacher: true,
              subject: true,
            },
          },
        },
      },
      student: {
        include: {
          class: true,
          grade: true,
        },
      },
    },
  };

  const queryAdmin = {
    orderBy: {
      id: Prisma.SortOrder.desc,
    },
    include: {
      assignment: {
        include: {
          lesson: {
            include: {
              class: true,
              teacher: true,
              subject: true,
            },
          },
        },
      },
      exam: {
        include: {
          lesson: {
            include: {
              class: true,
              teacher: true,
              subject: true,
            },
          },
        },
      },
      student: {
        include: {
          class: true,
          grade: true,
        },
      },
    },
  };

  const queryStudent = {
    where: {
      studentId: Number(session.id)
    },
    orderBy: {
      id: Prisma.SortOrder.desc,
    },
    include: {
      assignment: {
        include: {
          lesson: {
            include: {
              class: true,
              teacher: true,
              subject: true,
            },
          },
        },
      },
      exam: {
        include: {
          lesson: {
            include: {
              class: true,
              teacher: true,
              subject: true,
            },
          },
        },
      },
      student: {
        include: {
          class: true,
          grade: true,
        },
      },
    },
  };

  const queryParent = {
    where: {
      student: {
        parentId: Number(session.id)
      }
    },
    orderBy: {
      id: Prisma.SortOrder.desc,
    },
    include: {
      assignment: {
        include: {
          lesson: {
            include: {
              class: true,
              teacher: true,
              subject: true,
            },
          },
        },
      },
      exam: {
        include: {
          lesson: {
            include: {
              class: true,
              teacher: true,
              subject: true,
            },
          },
        },
      },
      student: {
        include: {
          class: true,
          grade: true,
        },
      },
    },
  };

  const results = await prisma.result.findMany(
    role === "ADMIN" 
      ? queryAdmin 
      : role === "TEACHER"
        ? queryTeacher
        : role === "PARENT"
          ? queryParent
          : queryStudent
  );

  const classes = await prisma.class.findMany();
  const grades = await prisma.grade.findMany();
  const students = await prisma.student.findMany();
  const subjects = await prisma.subject.findMany();
  const lessons = await prisma.lesson.findMany();
  const assignments = await prisma.assignment.findMany();
  const exams = await prisma.exam.findMany();

  const resultsWithDetails = results.map(result => ({
    ...result,
    Allclasses: classes,
    Allgrades: grades,
    Allstudents: students,
    Allsubjects: subjects,
    Alllessons: lessons,
    Allassignments: assignments,
    Allexams: exams,
    roleLogin: session.role as Role
  }));

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex flex-col md:flex-row gap-2 justify-between md:items-center mb-2">
        <h1 className="text-lg font-semibold">Data Nilai</h1>
        {(role === "ADMIN" || role === "TEACHER") && (
          <ButtonCreateResult classes={classes} grades={grades} students={students} subjects={subjects} lessons={lessons} assignments={assignments} exams={exams} />
        )}
      </div>
      {/* table */}
      <DataTable columns={columns} data={resultsWithDetails} />
    </div>
  );
};

export default ResultListPage;
