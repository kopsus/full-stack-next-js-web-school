import prisma from "@/lib/prisma";

import { decrypt } from "@/lib/actions/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const StudentListPage = async () => {

  const session = await decrypt(cookies().get("session")?.value);

  if (!session) {
    redirect("/");
  }

  const role = session.role;

  const parents = await prisma.parent.findMany({
    include: {
      students: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex md:flex-row flex-col justify-between gap-2 md:items-center">
        <h1 className="text-lg font-semibold">Data Orang Tua</h1>
        {(role === "ADMIN" || role === "TEACHER") && (
          <Button asChild className="mb-2">
            <Link href="/list/parents/create">
              <Plus />
              Tambah Orang Tua
            </Link>
          </Button>
        )}
      </div>
      {/* table */}
      <DataTable columns={columns} data={parents} />
    </div>
  );
};

export default StudentListPage;
