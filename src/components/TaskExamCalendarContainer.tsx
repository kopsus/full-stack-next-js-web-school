import prisma from "@/lib/prisma";
import { TaskExamCalendar } from "./TaskExamCalendar";

export const TaskExamCalendarContainer = async ({ studentId }: { studentId: number }) => {
    // Get student's class first
    const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: { classId: true }
    });

    if (!student) return null;

    // Fetch assignments and exams for the student's class
    const assignments = await prisma.assignment.findMany({
        where: {
            lesson: {
                classId: student.classId
            },
            dueDate: {
                gte: new Date() // Only get upcoming assignments
            }
        },
        include: {
            lesson: {
                include: {
                    subject: true
                }
            }
        },
        orderBy: {
            dueDate: 'asc'
        }
    });

    const exams = await prisma.exam.findMany({
        where: {
            lesson: {
                classId: student.classId
            },
            startTime: {
                gte: new Date() // Only get upcoming exams
            }
        },
        include: {
            lesson: {
                include: {
                    subject: true
                }
            }
        },
        orderBy: {
            startTime: 'asc'
        }
    });

    // Format data for calendar
    const calendarData = [
        ...assignments.map(assignment => ({
            title: `Tugas: ${assignment.title} (${assignment.lesson.subject.name})`,
            start: new Date(assignment.dueDate),
            end: new Date(assignment.dueDate),
            type: 'assignment'
        })),
        ...exams.map(exam => ({
            title: `Ujian: ${exam.title} (${exam.lesson.subject.name})`,
            start: new Date(exam.startTime),
            end: new Date(exam.endTime || exam.startTime),
            type: 'exam'
        }))
    ];

    return (
        <div className="p-2 bg-white">
            <TaskExamCalendar data={calendarData} />
        </div>
    );
};