import { PrismaClient, Role, Sex, Type, Present, Day } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcryptjs";
import dayjs from "dayjs";

async function main() {
  console.log("Memulai proses seeding...");

  // 1. Hash password sekali saja untuk efisiensi
  const password = await bcrypt.hash("password123", 10);

  // 2. Seed data dasar yang tidak memiliki dependensi
  console.log("Seeding Grades and Subjects...");
  const [grades, subjects] = await Promise.all([seedGrades(), seedSubjects()]);

  // 3. Seed Users (Admin, Teacher, Parent)
  console.log("Seeding Users (Admins, Teachers, Parents)...");
  const [admin, teachers, parents] = await Promise.all([
    seedAdmins(password),
    seedTeachers(password, subjects),
    seedParents(password),
  ]);

  // 4. Seed struktur kelas (membutuhkan Grade dan Teacher)
  console.log("Seeding Classes...");
  const classes = await seedClasses(grades, teachers);

  // 5. Seed Students (membutuhkan Class, Grade, Parent)
  console.log("Seeding Students...");
  const students = await seedStudents(password, classes, parents);

  // 6. Seed jadwal pelajaran (Lesson)
  console.log("Seeding Lessons...");
  const lessons = await seedLessons(subjects, classes, teachers);

  // 7. Seed data terkait pembelajaran (Exams, Assignments, Attendance)
  console.log("Seeding Learning-related data...");
  await Promise.all([
    seedExamsAndAssignments(lessons, students),
    seedAttendance(lessons, students, teachers),
  ]);

  // 8. Seed data tambahan (Events, Announcements, Finance)
  console.log("Seeding additional data...");
  await Promise.all([seedEventsAndAnnouncements(classes), seedFinance()]);

  console.log("Seeding data berhasil. ✅");
}

// Fungsi untuk membuat data Grade (Tingkat/Kelas)
async function seedGrades() {
  const gradeLevels = [10, 11, 12];
  const grades = await Promise.all(
    gradeLevels.map((level) =>
      prisma.grade.upsert({
        where: { level },
        update: {},
        create: { level },
      })
    )
  );
  return grades;
}

// Fungsi untuk membuat data Subject (Mata Pelajaran)
async function seedSubjects() {
  const subjectNames = [
    "Matematika",
    "Bahasa Indonesia",
    "Biologi",
    "Fisika",
    "Sejarah",
  ];
  const subjects = await Promise.all(
    subjectNames.map((name) =>
      prisma.subject.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );
  return subjects;
}

// Fungsi untuk membuat data Admin
async function seedAdmins(password: string) {
  return prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@sekolah.com",
      password,
      birthday: dayjs("1980-01-01").toDate(),
      sex: Sex.MALE,
      role: Role.ADMIN,
    },
  });
}

// Fungsi untuk membuat data Teacher (Guru)
async function seedTeachers(password: string, subjects: any[]) {
  const teacherData = [
    {
      username: "budi.guru",
      email: "budi.guru@sekolah.com",
      first_name: "Budi",
      last_name: "Santoso",
      sex: Sex.MALE,
      subjects: [subjects[0].id, subjects[3].id], // Matematika & Fisika
    },
    {
      username: "citra.guru",
      email: "citra.guru@sekolah.com",
      first_name: "Citra",
      last_name: "Lestari",
      sex: Sex.FEMALE,
      subjects: [subjects[1].id, subjects[4].id], // Bahasa Indonesia & Sejarah
    },
  ];

  return Promise.all(
    teacherData.map((teacher) =>
      prisma.teacher.upsert({
        where: { username: teacher.username },
        update: {},
        create: {
          username: teacher.username,
          email: teacher.email,
          first_name: teacher.first_name,
          last_name: teacher.last_name,
          password,
          birthday: dayjs("1985-05-10").toDate(),
          sex: teacher.sex,
          role: Role.TEACHER,
          subjects: {
            connect: teacher.subjects.map((id) => ({ id })),
          },
        },
      })
    )
  );
}

// Fungsi untuk membuat data Parent (Orang Tua)
async function seedParents(password: string) {
  const parentData = [
    {
      username: "ayah.andi",
      email: "ayah.andi@email.com",
      first_name: "Darmawan",
      sex: Sex.MALE,
    },
    {
      username: "ibu.bela",
      email: "ibu.bela@email.com",
      first_name: "Eka",
      sex: Sex.FEMALE,
    },
  ];

  return Promise.all(
    parentData.map((parent) =>
      prisma.parent.upsert({
        where: { username: parent.username },
        update: {},
        create: {
          ...parent,
          password,
          birthday: dayjs("1982-03-15").toDate(),
          role: Role.PARENT,
        },
      })
    )
  );
}

// Fungsi untuk membuat data Class (Kelas)
async function seedClasses(grades: any[], teachers: any[]) {
  const classData = [
    {
      name: "Kelas 10-A",
      capacity: 30,
      gradeId: grades[0].id,
      supervisorId: teachers[0].id,
    },
    {
      name: "Kelas 11-B",
      capacity: 30,
      gradeId: grades[1].id,
      supervisorId: teachers[1].id,
    },
  ];

  return Promise.all(
    classData.map((cls) =>
      prisma.class.upsert({
        where: { name: cls.name },
        update: {},
        create: cls,
      })
    )
  );
}

// Fungsi untuk membuat data Student (Siswa)
async function seedStudents(password: string, classes: any[], parents: any[]) {
  const studentData = [
    {
      username: "andi.siswa",
      email: "andi.siswa@sekolah.com",
      first_name: "Andi",
      sex: Sex.MALE,
      classId: classes[0].id,
      gradeId: classes[0].gradeId,
      parentId: parents[0].id,
    },
    {
      username: "bela.siswa",
      email: "bela.siswa@sekolah.com",
      first_name: "Bela",
      sex: Sex.FEMALE,
      classId: classes[1].id,
      gradeId: classes[1].gradeId,
      parentId: parents[1].id,
    },
  ];

  return Promise.all(
    studentData.map((student) =>
      prisma.student.upsert({
        where: { username: student.username },
        update: {},
        create: {
          ...student,
          password,
          birthday: dayjs("2008-08-20").toDate(),
          role: Role.STUDENT,
        },
      })
    )
  );
}

// Fungsi untuk membuat data Lesson (Jadwal Pelajaran)
async function seedLessons(subjects: any[], classes: any[], teachers: any[]) {
  const lessonData = [
    // Jadwal Kelas 10-A
    {
      name: "Matematika Sesi Pagi",
      day: Day.MONDAY,
      startTime: "08:00",
      endTime: "09:30",
      subjectId: subjects[0].id,
      classId: classes[0].id,
      teacherId: teachers[0].id,
    },
    // Jadwal Kelas 11-B
    {
      name: "Sejarah Sesi Siang",
      day: Day.TUESDAY,
      startTime: "10:00",
      endTime: "11:30",
      subjectId: subjects[4].id,
      classId: classes[1].id,
      teacherId: teachers[1].id,
    },
  ];

  return Promise.all(
    lessonData.map((lesson) =>
      prisma.lesson.upsert({
        where: { id: -1 }, // Gunakan ID palsu agar selalu create (atau buat constraint unik yg lebih baik di schema)
        update: {},
        create: {
          ...lesson,
          startTime: dayjs(`2024-01-01T${lesson.startTime}`).toDate(),
          endTime: dayjs(`2024-01-01T${lesson.endTime}`).toDate(),
        },
      })
    )
  );
}

// Fungsi untuk membuat data Ujian dan Tugas
async function seedExamsAndAssignments(lessons: any[], students: any[]) {
  // Buat satu ujian untuk pelajaran pertama
  const exam = await prisma.exam.create({
    data: {
      title: "Ujian Tengah Semester Matematika",
      startTime: dayjs().add(1, "week").toDate(),
      endTime: dayjs().add(1, "week").add(90, "minutes").toDate(),
      lessonId: lessons[0].id,
    },
  });

  // Buat nilai untuk siswa pada ujian tersebut
  await prisma.result.create({
    data: {
      score: 85,
      examId: exam.id,
      studentId: students[0].id,
    },
  });
}

// Fungsi untuk membuat data Absensi
async function seedAttendance(
  lessons: any[],
  students: any[],
  teachers: any[]
) {
  await prisma.attendance.create({
    data: {
      date: dayjs().subtract(1, "day").toDate(),
      present: Present.HADIR,
      lessonId: lessons[0].id,
      studentId: students[0].id,
      teacherId: teachers[0].id,
    },
  });
}

// Fungsi untuk membuat Acara dan Pengumuman
async function seedEventsAndAnnouncements(classes: any[]) {
  await prisma.event.create({
    data: {
      title: "Pentas Seni Tahunan",
      description: "Pentas seni untuk semua kelas akan diadakan di aula.",
      startTime: dayjs().add(2, "weeks").toDate(),
      endTime: dayjs().add(2, "weeks").add(3, "hours").toDate(),
      classId: classes[0].id, // Contoh untuk Kelas 10-A
    },
  });
  await prisma.announcement.create({
    data: {
      title: "Libur Nasional",
      description: "Sekolah akan diliburkan pada tanggal 17 Agustus.",
      date: dayjs().add(1, "month").toDate(),
      classId: classes[0].id,
    },
  });
}

// Fungsi untuk membuat data Keuangan
async function seedFinance() {
  await prisma.finance.createMany({
    data: [
      {
        title: "Pembayaran SPP Bulan Ini",
        description: "Pemasukan dari SPP siswa",
        date: dayjs().toDate(),
        amount: 5000000,
        type: Type.INCOME,
      },
      {
        title: "Pembelian ATK",
        description: "Pengeluaran untuk alat tulis kantor",
        date: dayjs().toDate(),
        amount: 500000,
        type: Type.EXPENSE,
      },
    ],
    skipDuplicates: true,
  });
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
