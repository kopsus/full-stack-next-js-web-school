import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Pencil } from "lucide-react";
import Link from "next/link";
import dayjs from "@/lib/dayjs";

interface Props {
  params: {
    id: string;
  };
}

export default async function ParentDetailPage({ params }: Props) {
  const parent = await prisma.parent.findUnique({
    where: {
      id: parseInt(params.id),
    },
    include: {
      students: true,
    },
  });

  if (!parent) {
    notFound();
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-8">
        <h1 className="text-xl font-bold">Detail Orang Tua</h1>
        <div className="flex gap-4">
          <Link href="/list/parents">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <Link href={`/list/parents/${parent.id}/edit`}>
            <Button variant="outline">
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Informasi Pribadi</h2>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={
                    parent.img ? `../../uploads/${parent.img}` : "/avatar.png"
                  }
                />
                <AvatarFallback>
                  {parent.first_name?.slice(0, 1)}
                  {parent.last_name?.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold">
                  {parent.first_name} {parent.last_name}
                </h2>
                <p className="text-gray-500 text-center">@{parent.username}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
              <div>
                <p className="text-gray-500 text-sm mb-1">Email</p>
                <p className="font-medium">{parent.email}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">No. Telepon</p>
                <p className="font-medium">{parent.phone || "-"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Tanggal Lahir</p>
                <p className="font-medium">
                  {dayjs(parent.birthday).format("DD MMMM YYYY")}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Jenis Kelamin</p>
                <p className="font-medium">
                  {parent.sex === "MALE" ? "Laki-laki" : "Perempuan"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Golongan Darah</p>
                <p className="font-medium">{parent.blood_type || "-"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Alamat</p>
                <p className="font-medium">{parent.address || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Daftar Anak</h2>
          {parent.students && parent.students.length > 0 ? (
            <div className="space-y-4">
              {parent.students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={
                          student.img
                            ? `../../uploads/${student.img}`
                            : "/avatar.png"
                        }
                      />
                      <AvatarFallback>
                        {student.first_name?.slice(0, 1)}
                        {student.last_name?.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {student.first_name} {student.last_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        @{student.username}
                      </p>
                    </div>
                  </div>
                  <Link href={`/list/students/${student.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Lihat
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Tidak ada data anak</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
