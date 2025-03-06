import Announcements from "@/components/Announcements";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import CountChartContainer from "@/components/CountChartContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/actions/session";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import UserCard from "@/components/UserCard";
import dayjs from "dayjs";

const ParentPage = async ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  const session = await decrypt(cookies().get("session")?.value);

  if (!session) {
    redirect("/");
  }

  const students = await prisma.student.findMany({
    where: {
      parentId: Number(session.id),
    },
    include: {
      class: true
    }
  });

  // Get assignments and exams for each student
  const studentsData = await Promise.all(students.map(async (student) => {
    const assignments = await prisma.assignment.findMany({
      where: {
        lesson: {
          classId: student.classId
        },
        dueDate: {
          gte: new Date()
        }
      },
      include: {
        lesson: {
          include: {
            subject: true
          }
        }
      },
      orderBy: {
        dueDate: 'asc'
      }
    });

    const exams = await prisma.exam.findMany({
      where: {
        lesson: {
          classId: student.classId
        },
        startTime: {
          gte: new Date()
        }
      },
      include: {
        lesson: {
          include: {
            subject: true
          }
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    });

    return {
      student,
      assignments,
      exams
    };
  }));

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* Task & Exam List for each student */}
        {studentsData.map(({student, assignments, exams}) => (
          <div key={student.id} className="bg-white rounded-lg p-4 shadow">
            <h3 className="font-bold text-lg mb-4">
              Data {(student.first_name ?? '') + " " + (student.last_name ?? '')} - Kelas {student.class.name}
            </h3>
            
            <div className="space-y-6">
              {/* Assignments Section */}
              <div>
                <h4 className="font-semibold text-md mb-2">Tugas yang Akan Datang:</h4>
                <div className="space-y-2">
                  {assignments.length > 0 ? assignments.map(assignment => (
                    <div key={assignment.id} className="border p-3 rounded">
                      <p className="font-medium">{assignment.title}</p>
                      <p className="text-sm text-gray-600">Mata Pelajaran: {assignment.lesson.subject.name}</p>
                      <p className="text-sm text-gray-600">Tenggat: {dayjs(assignment.dueDate).format('DD MMMM YYYY HH:mm')}</p>
                    </div>
                  )) : (
                    <p className="text-gray-500">Tidak ada tugas yang akan datang</p>
                  )}
                </div>
              </div>

              {/* Exams Section */}
              <div>
                <h4 className="font-semibold text-md mb-2">Ujian yang Akan Datang:</h4>
                <div className="space-y-2">
                  {exams.length > 0 ? exams.map(exam => (
                    <div key={exam.id} className="border p-3 rounded">
                      <p className="font-medium">{exam.title}</p>
                      <p className="text-sm text-gray-600">Mata Pelajaran: {exam.lesson.subject.name}</p>
                      <p className="text-sm text-gray-600">Waktu: {dayjs(exam.startTime).format('DD MMMM YYYY HH:mm')} - {dayjs(exam.endTime).format('HH:mm')}</p>
                    </div>
                  )) : (
                    <p className="text-gray-500">Tidak ada ujian yang akan datang</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3">
            <UserCard type="STUDENT" dataStudents={students} />
          </div>
          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3">
            <AttendanceChartContainer />
          </div>
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendarContainer searchParams={searchParams} />
        <Announcements />
      </div>
    </div>
  );
};

export default ParentPage;
