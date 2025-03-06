import prisma from "@/lib/prisma";

import { decrypt } from "@/lib/actions/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import ButtonCreateEvent from "@/components/forms/event/EventFormCreate";
import { Prisma, Role } from "@prisma/client";

const EventListPage = async () => {
  const session = await decrypt(cookies().get("session")?.value);

  if (!session) {
    redirect("/");
  }

  const role = session.role as Role;

  const queryParent = {
    where: {
      class: {
        students: {
          some: {
            parentId: Number(session.id)
          }
        }
      }
    },
    orderBy: {
      id: Prisma.SortOrder.desc,
    },
    include: {
      class: true,
    }
  };

  const queryDefault = {
    orderBy: {
      id: Prisma.SortOrder.desc,
    },
    include: {
      class: true,
    }
  };

  const events = await prisma.event.findMany(
    role === "PARENT" ? queryParent : queryDefault
  );

  const allClasses = await prisma.class.findMany();

  const eventsWithDetails = events.map(event => ({
    ...event,
    allClasses: allClasses,
    roleLogin: session.role as Role
  }));

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex flex-col md:flex-row gap-2 mb-2 justify-between md:items-center">
        <h1 className="text-lg font-semibold">Data Acara</h1>
        {(role === "ADMIN" || role === "TEACHER") && (
          <ButtonCreateEvent allClasses={allClasses} />
        )}
      </div>
      {/* table */}
      <DataTable columns={columns} data={eventsWithDetails} />
    </div>
  );
};

export default EventListPage;
