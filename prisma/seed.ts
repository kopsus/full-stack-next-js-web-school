import { PrismaClient, Blood, Day, Role, Sex, Present } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcryptjs";
import dayjs from "dayjs";

async function main() {
  // Buat grade terlebih dahulu
  const grades = await Promise.all(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((level) =>
      prisma.grade.create({ data: { level } })
    )
  );

  // Buat mata pelajaran
  const subjects = await Promise.all(
    ["Matematika", "Bahasa Indonesia", "Bahasa Inggris"].map((name) =>
      prisma.subject.create({ data: { name } })
    )
  );

  // Buat 3 admin
  const admins = await Promise.all(
    [
      {
        username: "admin1",
        first_name: "Budi",
        last_name: "Santoso",
        email: "budi@sekolah.com",
      },
      {
        username: "admin2",
        first_name: "Siti",
        last_name: "Rahayu",
        email: "siti@sekolah.com",
      },
      {
        username: "admin3",
        first_name: "Agus",
        last_name: "Wijaya",
        email: "agus@sekolah.com",
      },
    ].map(async (admin) => {
      const password = await bcrypt.hash("admin123", 10);
      return prisma.admin.create({
        data: {
          ...admin,
          password,
          phone: "08123456789",
          address: "Jalan Admin No. 1, Jakarta",
          img: "",
          blood_type: "A" as Blood,
          birthday: dayjs("1980-01-01").toDate(),
          sex: "MALE" as Sex,
          role: "ADMIN" as Role,
        },
      });
    })
  );

  // Buat 3 guru
  const teachers = await Promise.all(
    [
      {
        username: "guru1",
        first_name: "Ahmad",
        last_name: "Hidayat",
        email: "ahmad@sekolah.com",
      },
      {
        username: "guru2",
        first_name: "Dewi",
        last_name: "Lestari",
        email: "dewi@sekolah.com",
      },
      {
        username: "guru3",
        first_name: "Bambang",
        last_name: "Kusuma",
        email: "bambang@sekolah.com",
      },
    ].map(async (teacher) => {
      const password = await bcrypt.hash("guru123", 10);
      return prisma.teacher.create({
        data: {
          ...teacher,
          password,
          phone: "08123456789",
          address: "Jalan Guru No. 1, Jakarta",
          img: "",
          blood_type: "B" as Blood,
          birthday: dayjs("1975-01-01").toDate(),
          sex: "MALE" as Sex,
          role: "TEACHER" as Role,
        },
      });
    })
  );

  // Buat 3 orang tua
  const parents = await Promise.all(
    [
      {
        username: "ortu1",
        first_name: "Joko",
        last_name: "Susilo",
        email: "joko@sekolah.com",
      },
      {
        username: "ortu2",
        first_name: "Ani",
        last_name: "Kusmawati",
        email: "ani@sekolah.com",
      },
      {
        username: "ortu3",
        first_name: "Darmawan",
        last_name: "Putra",
        email: "darmawan@sekolah.com",
      },
    ].map(async (parent) => {
      const password = await bcrypt.hash("ortu123", 10);
      return prisma.parent.create({
        data: {
          ...parent,
          password,
          phone: "08123456789",
          address: "Jalan Orang Tua No. 1, Jakarta",
          img: "",
          blood_type: "O" as Blood,
          birthday: dayjs("1970-01-01").toDate(),
          sex: "MALE" as Sex,
          role: "PARENT" as Role,
        },
      });
    })
  );

  // Buat 3 kelas
  const classes = await Promise.all(
    [
      {
        name: "1A",
        capacity: 30,
        gradeId: grades[0].id,
        supervisorId: teachers[0].id,
      },
      {
        name: "1B",
        capacity: 30,
        gradeId: grades[0].id,
        supervisorId: teachers[1].id,
      },
      {
        name: "2A",
        capacity: 30,
        gradeId: grades[1].id,
        supervisorId: teachers[2].id,
      },
    ].map(async (classData) => {
      return prisma.class.create({
        data: {
          ...classData,
          events: {
            create: [],
          },
          announcements: {
            create: [],
          },
        },
      });
    })
  );

  // Buat 3 siswa
  const students = await Promise.all(
    [
      {
        username: "siswa1",
        first_name: "Dimas",
        last_name: "Pratama",
        email: "dimas@sekolah.com",
        classId: classes[0].id,
        parentId: parents[0].id,
        gradeId: grades[0].id,
      },
      {
        username: "siswa2",
        first_name: "Putri",
        last_name: "Indah",
        email: "putri@sekolah.com",
        classId: classes[0].id,
        parentId: parents[1].id,
        gradeId: grades[0].id,
      },
      {
        username: "siswa3",
        first_name: "Rizki",
        last_name: "Ramadhan",
        email: "rizki@sekolah.com",
        classId: classes[1].id,
        parentId: parents[2].id,
        gradeId: grades[1].id,
      },
    ].map(async (student) => {
      const password = await bcrypt.hash("siswa123", 10);
      return prisma.student.create({
        data: {
          ...student,
          password,
          phone: "08123456789",
          address: "Jalan Siswa No. 1, Jakarta",
          img: "",
          blood_type: "A" as Blood,
          birthday: dayjs("2010-01-01").toDate(),
          sex: "MALE" as Sex,
          role: "STUDENT" as Role,
          attendances: {
            create: [],
          },
          results: {
            create: [],
          },
        },
      });
    })
  );

  // Buat 3 pelajaran
  const lessons = await Promise.all(
    [
      {
        name: subjects[0].name,
        day: Day.MONDAY,
        startTime: dayjs().set("hour", 8).set("minute", 0).toDate(),
        endTime: dayjs().set("hour", 9).set("minute", 0).toDate(),
        subjectId: subjects[0].id,
        classId: classes[0].id,
        teacherId: teachers[0].id,
      },
      {
        name: subjects[1].name,
        day: Day.TUESDAY,
        startTime: dayjs().set("hour", 9).set("minute", 0).toDate(),
        endTime: dayjs().set("hour", 10).set("minute", 0).toDate(),
        subjectId: subjects[1].id,
        classId: classes[0].id,
        teacherId: teachers[1].id,
      },
      {
        name: subjects[2].name,
        day: Day.WEDNESDAY,
        startTime: dayjs().set("hour", 10).set("minute", 0).toDate(),
        endTime: dayjs().set("hour", 11).set("minute", 0).toDate(),
        subjectId: subjects[2].id,
        classId: classes[1].id,
        teacherId: teachers[2].id,
      },
    ].map(async (lesson) => {
      return prisma.lesson.create({
        data: lesson,
      });
    })
  );

  // Buat 3 tugas
  const assignments = await Promise.all(
    [
      {
        title: `Tugas ${lessons[0].name}`,
        startDate: new Date(),
        dueDate: dayjs().add(7, "days").toDate(),
        lessonId: lessons[0].id,
      },
      {
        title: `Tugas ${lessons[1].name}`,
        startDate: new Date(),
        dueDate: dayjs().add(7, "days").toDate(),
        lessonId: lessons[1].id,
      },
      {
        title: `Tugas ${lessons[2].name}`,
        startDate: new Date(),
        dueDate: dayjs().add(7, "days").toDate(),
        lessonId: lessons[2].id,
      },
    ].map(async (assignment) => {
      return prisma.assignment.create({
        data: assignment,
      });
    })
  );

  // Buat 3 ujian
  const exams = await Promise.all(
    [
      {
        title: `Ujian ${lessons[0].name}`,
        startTime: dayjs().add(1, "month").toDate(),
        endTime: dayjs().add(1, "month").add(1, "hour").toDate(),
        lessonId: lessons[0].id,
      },
      {
        title: `Ujian ${lessons[1].name}`,
        startTime: dayjs().add(1, "month").toDate(),
        endTime: dayjs().add(1, "month").add(1, "hour").toDate(),
        lessonId: lessons[1].id,
      },
      {
        title: `Ujian ${lessons[2].name}`,
        startTime: dayjs().add(1, "month").toDate(),
        endTime: dayjs().add(1, "month").add(1, "hour").toDate(),
        lessonId: lessons[2].id,
      },
    ].map(async (exam) => {
      return prisma.exam.create({
        data: exam,
      });
    })
  );

  // Buat 3 hasil
  const results = await Promise.all(
    [
      { score: 85, studentId: students[0].id, assignmentId: assignments[0].id },
      { score: 90, studentId: students[1].id, assignmentId: assignments[1].id },
      { score: 78, studentId: students[2].id, assignmentId: assignments[2].id },
    ].map(async (result) => {
      return prisma.result.create({
        data: result,
      });
    })
  );

  const attendanceStudents = [
    {
      studentId: students[0].id,
      date: dayjs().toDate(),
      present: Present.HADIR, // Pastikan sesuai ENUM (huruf besar)
      lessonId: lessons[0].id,
    },
    {
      studentId: students[1].id,
      date: dayjs().toDate(),
      present: Present.ALFA,
      lessonId: lessons[0].id,
    },
    {
      studentId: students[2].id,
      date: dayjs().toDate(),
      present: Present.PERMISSION,
      lessonId: lessons[0].id,
    },
  ];

  const attendanceTeachers = [
    {
      teacherId: teachers[0].id,
      date: dayjs().toDate(),
      present: Present.SICK,
      lessonId: lessons[0].id,
    },
    {
      teacherId: teachers[1].id,
      date: dayjs().toDate(),
      present: Present.HADIR,
      lessonId: lessons[0].id,
    },
    {
      teacherId: teachers[2].id,
      date: dayjs().toDate(),
      present: Present.HADIR,
      lessonId: lessons[0].id,
    },
  ];

  // Buat 3 kehadiran untuk masing-masing siswa dan guru
  const attendancesStudent = await Promise.all(
    attendanceStudents.map(async (attendance) => {
      return prisma.attendance.create({
        data: attendance,
      });
    })
  );

  const attendancesTeacher = await Promise.all(
    attendanceTeachers.map(async (attendance) => {
      return prisma.attendance.create({
        data: attendance,
      });
    })
  );

  console.log("Seeding data berhasil.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
