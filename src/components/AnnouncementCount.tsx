"use client";

import { Announcement } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";
import Image from "next/image";
import dayjs from "@/lib/dayjs";

interface AnnouncementCountProps {
    announcement: Announcement[];
}

export default function AnnouncementCount({ announcement }: AnnouncementCountProps) {

    // cari data 1 jam terakhir yang terbaru maksimal 3 data
    const recentAnnouncements = announcement.filter(announcement => dayjs(announcement.date).isAfter(dayjs().subtract(1, 'hour'))).slice(0, 3);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className="relative cursor-pointer">
                    <Image src="/announcement.png" alt="" width={20} height={20} />
                    <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
                        {recentAnnouncements.length}
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="space-y-2 mb-2">
                    {recentAnnouncements.length > 0 ? recentAnnouncements.map((announcement) => (
                        <div key={announcement.id} className="space-y-2 bg-gray-100 p-2 rounded-md">
                            <h4 className="font-medium text-sm">{announcement.title}</h4>
                            <p className="text-xs text-gray-500 line-clamp-2">
                                {announcement.description}
                            </p>
                            <p className="text-xs text-gray-400">
                                {dayjs(announcement.date).fromNow()}
                            </p>
                        </div>
                    )) : (
                        <div className="text-center text-sm text-gray-500">
                            Tidak ada pengumuman terbaru
                        </div>
                    )}
                </div>
                <div className="text-center bg-gray-100 p-2 rounded-md">
                    <Link href="/list/announcements" className="text-xs ">
                        Lihat Semua Pengumuman
                    </Link>
                </div>
            </PopoverContent>
        </Popover >
    );
}
