import EventCalendar from "./EventCalendar";
import EventList from "./EventList";
import Link from "next/link";

const EventCalendarContainer = async ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  const { date } = searchParams;
  return (
    <div className="bg-white p-4 rounded-md">
      <EventCalendar />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Kegiatan</h1>
        <Link href="/list/events" className="text-xs text-gray-400 underline">Lihat semua kegiatan</Link>
      </div>
      <div className="flex flex-col gap-4">
        <EventList dateParam={date} />
      </div>
    </div>
  );
};

export default EventCalendarContainer;
