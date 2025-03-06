import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

const UserCard = async ({
  type,
  dataStudents,
}: {
  type: "ADMIN" | "TEACHER" | "STUDENT" | "PARENT";
  dataStudents?: any;
}) => {
  const modelMap: Record<typeof type, any> = {
    ADMIN: prisma.admin,
    TEACHER: prisma.teacher,
    STUDENT: prisma.student,
    PARENT: prisma.parent,
  };

  const data = await modelMap[type].count();
  const year = new Date().getFullYear();

  return (
    <div className="rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          {year}/{String(year + 1).slice(2)}
        </span>
        {type !== "ADMIN" && (
          <Link href={`/list/${type.toLowerCase()}s`}>
            <Image src="/moreDark.png" alt="" width={20} height={20} />
          </Link>
        )}
      </div>
      <h1 className="text-2xl font-semibold my-4">{dataStudents ? dataStudents.length : data}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">
        {type === "ADMIN"
          ? "Admin"
          : type === "TEACHER"
          ? "Guru"
          : type === "STUDENT"
          ? "Siswa"
          : "Orang Tua"}
      </h2>
    </div>
  );
};

export default UserCard;
