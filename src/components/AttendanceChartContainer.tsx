import Image from "next/image";
import AttendanceChart from "./AttendanceChart";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/actions/session";
import { redirect } from "next/navigation";

const AttendanceChartContainer = async () => {
  const session = await decrypt(cookies().get("session")?.value);

  if (!session) {
    redirect("/");
  }

  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - daysSinceMonday);

  let whereClause: any = {
    date: {
      gte: lastMonday,
    }
  };

  // Filter berdasarkan role
  if (session.role === "TEACHER") {
    whereClause.teacherId = Number(session.id);
  } else if (session.role === "STUDENT") {
    whereClause.studentId = Number(session.id);
  } else if (session.role === "PARENT") {
    const students = await prisma.student.findMany({
      where: {
        parentId: Number(session.id)
      }
    });
    whereClause.studentId = {
      in: students.map(s => s.id)
    };
  }

  const resData = await prisma.attendance.findMany({
    where: whereClause,
    select: {
      date: true,
      present: true,
    },
    orderBy: {
      date: 'asc'
    }
  });

  const daysOfWeek = ["Sen", "Sel", "Rab", "Kam", "Jum"];

  const attendanceMap: { [key: string]: { present: number; absent: number } } =
    {
      Sen: { present: 0, absent: 0 },
      Sel: { present: 0, absent: 0 },
      Rab: { present: 0, absent: 0 },
      Kam: { present: 0, absent: 0 },
      Jum: { present: 0, absent: 0 },
    };

  resData.forEach((item) => {
    const itemDate = new Date(item.date);
    const dayOfWeek = itemDate.getDay();
    
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      const dayName = daysOfWeek[dayOfWeek - 1];

      if (item.present) {
        attendanceMap[dayName].present += 1;
      } else {
        attendanceMap[dayName].absent += 1;
      }
    }
  });

  const data = daysOfWeek.map((day) => ({
    name: day,
    hadir: attendanceMap[day].present,
    absen: attendanceMap[day].absent,
  }));

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Kehadiran</h1>
        <Link href="/list/attendance">
          <Image src="/moreDark.png" alt="" width={20} height={20} />
        </Link>
      </div>
      <AttendanceChart data={data}/>
    </div>
  );
};

export default AttendanceChartContainer;
