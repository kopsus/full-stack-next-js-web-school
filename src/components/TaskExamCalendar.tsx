"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

const EventModal = ({ event, onClose }: { event: any; onClose: () => void }) => {
    if (!event) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">
                        {event.type === 'assignment' ? '📝 Detail Tugas' : '📚 Detail Ujian'}
                    </h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>
                <div className="space-y-3">
                    <p className="font-medium">{event.title}</p>
                    <div className="text-sm text-gray-600">
                        <p>Mulai: {moment(event.start).format('DD MMM YYYY HH:mm')}</p>
                        <p>Selesai: {moment(event.end).format('DD MMM YYYY HH:mm')}</p>
                    </div>
                    <div className="flex items-center mt-4">
                        <span 
                            className={`px-3 py-1 rounded-full text-sm ${
                                event.type === 'assignment' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-red-100 text-red-800'
                            }`}
                        >
                            {event.type === 'assignment' ? 'Tugas' : 'Ujian'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const TaskExamCalendar = ({
    data
}: {
    data: { title: string; start: Date; end: Date; type: string }[];
}) => {
    const localizer = momentLocalizer(moment);
    const [view, setView] = useState<View>(Views.MONTH);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    const handleViewChange = (newView: View) => {
        setView(newView);
    };

    const handleSelectEvent = (event: any) => {
        setSelectedEvent(event);
    };

    return (
        <div>
            <Calendar
                localizer={localizer}
                events={data}
                startAccessor="start"
                endAccessor="end"
                views={["month", "week", "day"]}
                view={view}
                onView={handleViewChange}
                onSelectEvent={handleSelectEvent}
                style={{ height: "450px" }}
                messages={{
                    week: 'Minggu',
                    work_week: 'Minggu Kerja',
                    day: 'Hari',
                    month: 'Bulan',
                    previous: 'Sebelumnya',
                    next: 'Selanjutnya',
                    today: 'Hari Ini',
                    agenda: 'Agenda',
                    showMore: (total) => `+${total} lainnya`
                }}
            />
            {selectedEvent && (
                <EventModal 
                    event={selectedEvent} 
                    onClose={() => setSelectedEvent(null)} 
                />
            )}
        </div>
    );
};