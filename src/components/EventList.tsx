import prisma from "@/lib/prisma";
import dayjs from "@/lib/dayjs";

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {
  const date = dateParam ? dayjs(dateParam) : dayjs();

  const data = await prisma.event.findMany({
    where: {
      startTime: {
        gte: date.startOf('day').toDate(),
        lte: date.endOf('day').toDate(),
      },
    },
  });

  if(data.length === 0) {
    return <p className="text-gray-400">Tidak ada kegiatan even pada tanggal ini.</p>;
  }

  return data.map((event) => (
    <div
      className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
      key={event.id}
    >
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-gray-600">{event.title}</h1>
        <span className="text-gray-300 text-xs">
          {dayjs(event.startTime).format("HH:mm")}
        </span>
      </div>
      <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
    </div>
  ));
};

export default EventList;
