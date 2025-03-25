import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import Performance from "@/components/Performance";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Edit } from "lucide-react";
import { decrypt } from "@/lib/actions/session";
import { cookies } from "next/headers";
import dayjs from "dayjs";
import { formatDate } from "@/lib/formatted";

const SingleStudentPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const session = await decrypt(cookies().get("session")?.value);

  if (!session) {
    redirect("/");
  }

  const role = session.role;

  const student = await prisma.student.findUnique({
    where: { id: Number(id) },
    include: {
      class: {
        include: {
          _count: {
            select: {
              lessons: true,
            },
          },
        },
      },
      parent: true,
      _count: {
        select: {
          attendances: true,
        },
      },
    },
  });

  if (!student) {
    return notFound();
  }

  const totalAttendance = await prisma.attendance.count({
    where: {
      studentId: student.id,
      present: "HADIR",
    },
  });

  const totalLessons = await prisma.attendance.count({
    where: {
      studentId: student.id,
    },
  });

  const attendancePercentage =
    totalLessons > 0 ? (totalAttendance / totalLessons) * 100 : 0;

  const calculatePerformance = (attendancePercentage: number) => {
    const value = (attendancePercentage / 100) * 10;
    return [
      { name: "Group A", value: value, fill: "#C3EBFA" },
      { name: "Group B", value: 10 - value, fill: "#FAE27C" },
    ];
  };

  const performanceData = calculatePerformance(attendancePercentage);

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <Image
              src={student.img ? `/uploads/${student.img}` : "/avatar.png"}
              alt=""
              width={144}
              height={144}
              className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover"
            />
            <div className="w-2/3 flex flex-col gap-1">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">
                  {student.first_name + " " + student.last_name}
                </h1>
                {role === "ADMIN" && (
                  <Link href={`/list/students/${student.id}/edit`}>
                    <Edit className="w-6 h-6 bg-blue-500 text-white rounded-full p-1" />
                  </Link>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>{student.blood_type}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span>{formatDate(student.birthday)}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span className="text-wrap">{student.email || "-"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>{student.phone || "-"}</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleAttendance.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">
                  {attendancePercentage.toFixed(0)}%
                </h1>
                <span className="text-sm text-gray-400">Kehadiran</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleBranch.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">{student.class.name}</h1>
                <span className="text-sm text-gray-400">Kelas</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleLesson.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">
                  {student.class._count.lessons}
                </h1>
                <span className="text-sm text-gray-400">Pelajaran</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleClass.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">
                  {student.parent?.first_name} {student.parent?.last_name}
                </h1>
                <span className="text-sm text-gray-400">Orang Tua</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4">
          <h1 className="text-xl font-semibold mb-4">Jadwal Siswa</h1>
          <div className="hidden md:block">
            <BigCalendarContainer type="classId" id={student.classId} />
          </div>
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link
              className="p-3 rounded-md bg-lamaSkyLight"
              href={`/list/lessons`}
            >
              Lessons
            </Link>
            <Link
              className="p-3 rounded-md bg-lamaPurpleLight"
              href={`/list/teachers`}
            >
              Teachers
            </Link>
            <Link className="p-3 rounded-md bg-pink-50" href={`/list/exams`}>
              Exams
            </Link>
            <Link
              className="p-3 rounded-md bg-lamaSkyLight"
              href={`/list/assignments`}
            >
              Assignments
            </Link>
            <Link
              className="p-3 rounded-md bg-lamaYellowLight"
              href={`/list/results`}
            >
              Results
            </Link>
          </div>
        </div>
        <Performance data={performanceData} />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleStudentPage;
