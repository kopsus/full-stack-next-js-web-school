import { decrypt } from "@/lib/actions/session";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import dayjs from "@/lib/dayjs";

const Announcements = async () => {
  const cookie = cookies().get("session")?.value;
  const session = await decrypt(cookie);

  if (!session) {
    redirect("/");
  }

  const data = await prisma.announcement.findMany({
    take: 3,
    orderBy: { date: "desc" },
  });

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Pengumuman</h1>
        <Link href="/list/announcements" className="text-xs text-gray-400 underline">
          Lihat Semua
        </Link>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {data[0] && (
          <div className="bg-lamaSkyLight rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[0].title}</h2>
            </div>
            <p className="text-sm text-gray-400 my-1">{data[0].description}</p>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1 mt-1">
              {dayjs(data[0].date).format("dddd, D MMMM YYYY")}
            </span>
          </div>
        )}
        {data[1] && (
          <div className="bg-lamaPurpleLight rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[1].title}</h2>
            </div>
            <p className="text-sm text-gray-400 my-1">{data[1].description}</p>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1 mt-1">
              {dayjs(data[1].date).format("dddd, D MMMM YYYY")}
            </span>
          </div>
        )}
        {data[2] && (
          <div className="bg-lamaYellowLight rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[2].title}</h2>
            </div>
            <p className="text-sm text-gray-400 my-1">{data[2].description}</p>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1 mt-1">
              {dayjs(data[2].date).format("dddd, D MMMM YYYY")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
