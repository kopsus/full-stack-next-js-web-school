import { decrypt } from "@/lib/actions/session";
import MenuLink from "./MenuLink";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Beranda",
        href: "/",
        visible: ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
      },
      {
        icon: "/teacher.png",
        label: "Guru",
        href: "/list/teachers",
        visible: ["ADMIN"],
      },
      {
        icon: "/student.png",
        label: "Siswa",
        href: "/list/students",
        visible: ["ADMIN", "TEACHER"],
      },
      {
        icon: "/parent.png",
        label: "Orang Tua",
        href: "/list/parents",
        visible: ["ADMIN", "TEACHER"],
      },
      {
        icon: "/class.png",
        label: "Kelas",
        href: "/list/classes",
        visible: ["ADMIN", "TEACHER"],
      },
      {
        icon: "/subject.png",
        label: "Mata Pelajaran",
        href: "/list/subjects",
        visible: ["ADMIN"],
      },
      {
        icon: "/lesson.png",
        label: "Pelajaran",
        href: "/list/lessons",
        visible: ["ADMIN", "TEACHER"],
      },
      {
        icon: "/exam.png",
        label: "Ujian",
        href: "/list/exams",
        visible: ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
      },
      {
        icon: "/assignment.png",
        label: "Tugas",
        href: "/list/assignments",
        visible: ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
      },
      {
        icon: "/result.png",
        label: "Nilai",
        href: "/list/results",
        visible: ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
      },
      {
        icon: "/attendance.png",
        label: "Kehadiran",
        href: "/list/attendance",
        visible: ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
      },
      {
        icon: "/calendar.png",
        label: "Acara",
        href: "/list/events",
        visible: ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
      },
      {
        icon: "/announcement.png",
        label: "Pengumuman",
        href: "/list/announcements",
        visible: ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profil",
        href: "/profile",
        visible: ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
      },
    ],
  },
];

const Menu = async () => {
  const cookie = cookies().get("session")?.value;
  const session = await decrypt(cookie);

  if (!session) {
    redirect("/");
  }

  const role = session.role as string;
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item, index) => {
            if (item.visible.includes(role)) {
              return <MenuLink role={role} item={item} key={index} />;
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
