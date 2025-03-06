import Announcements from "@/components/Announcements";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import CountChartContainer from "@/components/CountChartContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";
import prisma from "@/lib/prisma";

const TeacherPage = async ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {

  const finances = await prisma.finance.findMany({
    orderBy: {
      id: "desc",
    },
  });

  const formattedDataFinance = finances.reduce((acc, finance) => {
    const month = new Date(finance.date).toLocaleString('id-ID', { month: 'long' });
    const existingMonth = acc.find(item => item.name === month);

    if (existingMonth) {
      if (finance.type === 'INCOME') {
        existingMonth.pendapatan += finance.amount;
      } else {
        existingMonth.pengeluaran += finance.amount;
      }
    } else {
      acc.push({
        name: month,
        pendapatan: finance.type === 'INCOME' ? finance.amount : 0,
        pengeluaran: finance.type === 'EXPENSE' ? finance.amount : 0
      });
    }

    return acc;
  }, [] as { name: string; pendapatan: number; pengeluaran: number }[]);

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="ADMIN" />
          <UserCard type="TEACHER" />
          <UserCard type="STUDENT" />
          <UserCard type="PARENT" />
        </div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChartContainer />
          </div>
          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChartContainer />
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">
          <FinanceChart data={formattedDataFinance} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendarContainer searchParams={searchParams}/>
        <Announcements />
      </div>
    </div>
  );
};

export default TeacherPage;
