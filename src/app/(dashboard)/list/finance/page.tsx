import prisma from "@/lib/prisma";

import { decrypt } from "@/lib/actions/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import ButtonCreateFinance from "@/components/forms/finance/FinanceFormCreate";

const FinanceListPage = async () => {

  const session = await decrypt(cookies().get("session")?.value);

  if (!session) {
    redirect("/");
  }

  const role = session.role;

  const finances = await prisma.finance.findMany({
    orderBy: {
      id: "desc",
    },
  });

  const financesWithDetails = finances.map(finance => ({
    ...finance,
  }));

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex flex-col md:flex-row gap-2 mb-2 justify-between md:items-center">
        <h1 className="text-lg font-semibold">Data Keuangan</h1>
        {role === "ADMIN" && (
          <ButtonCreateFinance />
        )}
      </div>
      {/* table */}
      <DataTable columns={columns} data={financesWithDetails} />
    </div>
  );
};

export default FinanceListPage;
