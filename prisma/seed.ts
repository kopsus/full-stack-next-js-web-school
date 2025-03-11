import { PrismaClient, Blood, Day, Role, Sex, Present } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcryptjs";
import dayjs from "dayjs";

async function main() {
  await Promise.all(
    [
      {
        username: "admin1",
        email: "admin1@sekolah.com",
      },
      {
        username: "admin2",
        email: "admin2@sekolah.com",
      },
      {
        username: "admin3",
        email: "admin3@sekolah.com",
      },
      {
        username: "admin4",
        email: "admin4@sekolah.com",
      },
      {
        username: "admin5",
        email: "admin5@sekolah.com",
      },
      {
        username: "admin6",
        email: "admin6@sekolah.com",
      },
      {
        username: "admin7",
        email: "admin7@sekolah.com",
      },
      {
        username: "admin8",
        email: "admin8@sekolah.com",
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
