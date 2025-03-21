import { cookies } from "next/headers";
import Image from "next/image";
import { decrypt } from "@/lib/actions/session";
import { redirect } from "next/navigation";
import { getDataUser } from "@/lib/actions/data-user";
import ButtonEditProfile from "@/components/ButtonEditProfile";
import dayjs from "dayjs";

const ProfilePage = async () => {
  const session = await decrypt(cookies().get("session")?.value);

  if (!session) {
    redirect("/");
  }

  const role = session.role;

  const data = await getDataUser(String(session.id), String(session.role));

  if (!data) {
    redirect("/");
  }

  return (
    <div className="p-4 flex flex-col gap-4 w-full md:w-10/12 mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-8 flex flex-col md:flex-row gap-8 items-center relative">
        <div className="relative w-40 h-40 group">
          {data.img ? (
            <Image
              src={`/uploads/${data?.img}`}
              alt="Profile"
              className="rounded-full object-cover border-4 border-blue-100"
              width={0}
              height={0}
              sizes="100vw"
            />
          ) : null}
        </div>
        <div className="flex flex-col items-center md:items-start gap-3">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {data?.first_name && data?.last_name
                ? `${data?.first_name} ${data?.last_name}`
                : data?.username || "No name provided"}
            </h1>
          </div>
          <div className="flex flex-col md:flex-row gap-2 text-gray-600">
            <span className="bg-blue-100 w-max mx-auto text-sm md:text-base px-3 py-1 rounded-full text-blue-600 font-medium capitalize">
              {data?.role}
            </span>
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {data?.email || "No email provided"}
            </span>
          </div>
        </div>
        <ButtonEditProfile data={data} />
      </div>

      {/* Student Details */}
      {role === "STUDENT" && data && (
        <div className="bg-white rounded-lg shadow-md p-2 md:p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base ps-2 md:0 font-bold text-gray-800">
              Detail Siswa
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
            <div className="bg-gray-50 p-2 md:p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">
                Informasi Pribadi
              </h3>
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md">
                  <span className="text-gray-600 font-medium">
                    Golongan Darah
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {data.blood_type}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md">
                  <span className="text-gray-600 font-medium">
                    Jenis Kelamin
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {data.sex === "MALE" ? "Laki-laki" : "Perempuan"}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md">
                  <span className="text-gray-600 font-medium">
                    Tanggal Lahir
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {dayjs(data.birthday).format("DD MMMM YYYY")}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md">
                  <span className="text-gray-600 font-medium">
                    Nomor Telepon
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {data.phone || "Tidak ada"}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md">
                  <span className="text-gray-600 font-medium">Alamat</span>
                  <span className="text-gray-900 font-semibold">
                    {data.address || "Tidak ada"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-2 md:p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">
                Informasi Akademik
              </h3>
              <div className="space-y-3">
                {/* <div className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md">
                                    <span className="text-gray-600 font-medium">Kelas</span>
                                    <span className="text-gray-900 font-semibold">{data.grade?.level}</span>
                                </div> */}
                <div className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md">
                  <span className="text-gray-600 font-medium">Kelas</span>
                  <span className="text-gray-900 font-semibold">
                    {data.class?.name}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md">
                  <span className="text-gray-600 font-medium">
                    Pengawas Kelas
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {data.class?.supervisor
                      ? `${data.class.supervisor.first_name} ${data.class.supervisor.last_name}`
                      : "Tidak ada"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-2 md:p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">
                Informasi Orang Tua
              </h3>
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md">
                  <span className="text-gray-600 font-medium">Nama</span>
                  <span className="text-gray-900 font-semibold">
                    {data.parent
                      ? `${data.parent.first_name} ${data.parent.last_name}`
                      : "Tidak ada"}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md">
                  <span className="text-gray-600 font-medium">Email</span>
                  <span className="text-gray-900 font-semibold">
                    {data.parent?.email || "Tidak ada"}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md">
                  <span className="text-gray-600 font-medium">
                    Nomor Telepon
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {data.parent?.phone || "Tidak ada"}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md">
                  <span className="text-gray-600 font-medium">Alamat</span>
                  <span className="text-gray-900 font-semibold">
                    {data.parent?.address || "Tidak ada"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">
              Kehadiran & Nilai Terakhir
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
              <div className="bg-gray-50 p-2 md:p-4 rounded-lg shadow-sm">
                <h4 className="font-medium mb-2 text-gray-800">
                  Kehadiran Terakhir
                </h4>
                {data.attendances && data.attendances.length > 0 ? (
                  <div className="flex gap-2 flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md">
                    <span>
                      {dayjs(data.attendances[0].date).format("DD MMMM YYYY")}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full ${
                        data.attendances[0].present
                          ? "bg-green-100 w-max text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {data.attendances[0].present ? "Hadir" : "Tidak Hadir"}
                    </span>
                  </div>
                ) : (
                  <p className="text-gray-500">Belum ada kehadiran</p>
                )}
              </div>
              <div className="bg-gray-50 p-2 md:p-4 rounded-lg shadow-sm">
                <h4 className="font-medium mb-2 text-gray-800">
                  Nilai Terakhir
                </h4>
                {data.results && data.results.length > 0 ? (
                  <div className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md">
                    <span className="text-gray-600">Nilai</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {data.results[0].score}/100
                    </span>
                  </div>
                ) : (
                  <p className="text-gray-500">Belum ada nilai</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Details */}
      {role === "TEACHER" && data && (
        <div className="bg-white rounded-lg shadow-md p-2 md:p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base ps-2 md:0 font-bold text-gray-800">
              Detail Guru
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
            <div className="bg-gray-50 p-2 md:p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">
                Informasi Pribadi
              </h3>
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md">
                  <span className="text-gray-600 font-medium">
                    Golongan Darah
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {data.blood_type}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md">
                  <span className="text-gray-600 font-medium">
                    Jenis Kelamin
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {data.sex === "MALE" ? "Laki-laki" : "Perempuan"}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md">
                  <span className="text-gray-600 font-medium">
                    Tanggal Lahir
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {dayjs(data.birthday).format("DD MMMM YYYY")}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md">
                  <span className="text-gray-600 font-medium">
                    Nomor Telepon
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {data.phone || "Tidak ada"}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md">
                  <span className="text-gray-600 font-medium">Alamat</span>
                  <span className="text-gray-900 font-semibold">
                    {data.address || "Tidak ada"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-2 md:p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">
                Kelas
              </h3>
              <div className="space-y-3">
                {data.classes && data.classes.length > 0 ? (
                  data.classes.map((cls) => (
                    <div
                      key={cls.id}
                      className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md"
                    >
                      <span className="text-gray-900 font-semibold">
                        {cls.name} - Kelas {cls.grade.level}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-white rounded-md text-gray-500">
                    Tidak ada kelas yang ditugaskan
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-2 md:p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">
                Mata Pelajaran
              </h3>
              <div className="space-y-3">
                {data.subjects && data.subjects.length > 0 ? (
                  data.subjects.map((subject) => (
                    <div
                      key={subject.id}
                      className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md"
                    >
                      <span className="text-gray-900 font-semibold">
                        {subject.name}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-white rounded-md text-gray-500">
                    Belum ada mata pelajaran
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">
              Materi Terakhir & Kehadiran
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
              <div className="bg-gray-50 p-2 md:p-4 rounded-lg shadow-sm">
                <h4 className="font-medium mb-2 text-gray-800">
                  Materi Terakhir
                </h4>
                {data.lessons && data.lessons.length > 0 ? (
                  data.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {lesson.name}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {lesson.subject.name} - {lesson.class.name}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Belum ada materi</p>
                )}
              </div>
              <div className="bg-gray-50 p-2 md:p-4 rounded-lg shadow-sm">
                <h4 className="font-medium mb-2 text-gray-800">
                  Kehadiran Terakhir
                </h4>
                {data.attendances && data.attendances.length > 0 ? (
                  <div className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md gap-2">
                    <span>
                      {dayjs(data.attendances[0].date).format("DD MMMM YYYY")}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full ${
                        data.attendances[0].present
                          ? "bg-green-100 w-max text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {data.attendances[0].present ? "Hadir" : "Tidak Hadir"}
                    </span>
                  </div>
                ) : (
                  <p className="text-gray-500">Belum ada kehadiran</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Parent Details */}
      {role === "PARENT" && data && (
        <div className="bg-white rounded-lg shadow-md p-2 md:p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base ps-2 md:0 font-bold text-gray-800">
              Detail Orang Tua
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
            <div className="bg-gray-50 p-2 md:p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">
                Informasi Pribadi
              </h3>
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md">
                  <span className="text-gray-600 font-medium">
                    Golongan Darah
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {data.blood_type}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md">
                  <span className="text-gray-600 font-medium">
                    Jenis Kelamin
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {data.sex === "MALE" ? "Laki-laki" : "Perempuan"}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md">
                  <span className="text-gray-600 font-medium">
                    Tanggal Lahir
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {dayjs(data.birthday).format("DD MMMM YYYY")}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md">
                  <span className="text-gray-600 font-medium">
                    Nomor Telepon
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {data.phone || "Tidak ada"}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md">
                  <span className="text-gray-600 font-medium">Alamat</span>
                  <span className="text-gray-900 font-semibold">
                    {data.address || "Tidak ada"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-2 md:p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">
                Informasi Anak
              </h3>
              <div className="space-y-3">
                {data.students && data.students.length > 0 ? (
                  data.students.map((student) => (
                    <div
                      key={student.id}
                      className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {student.first_name} {student.last_name}
                        </h4>
                        <div className="space-y-2 mt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Kelas</span>
                            <span className="text-gray-900 font-semibold">
                              {student.grade.level}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Kelas</span>
                            <span className="text-gray-900 font-semibold">
                              {student.class.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-white rounded-md text-gray-500">
                    Belum ada anak terdaftar
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">
              Kehadiran & Nilai Terakhir Anak
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
              {data.students &&
                data.students.map((student) => (
                  <div key={student.id} className="space-y-4">
                    <div className="bg-gray-50 p-2 md:p-4 rounded-lg shadow-sm">
                      <h4 className="font-medium mb-2 text-gray-800">
                        Kehadiran Terakhir - {student.first_name}
                      </h4>
                      {student.attendances && student.attendances.length > 0 ? (
                        <div className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white gap-2 rounded-md">
                          <span>
                            {dayjs(student.attendances[0].date).format(
                              "DD MMMM YYYY"
                            )}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full ${
                              student.attendances[0].present
                                ? "bg-green-100 w-max text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {student.attendances[0].present
                              ? "Hadir"
                              : "Tidak Hadir"}
                          </span>
                        </div>
                      ) : (
                        <p className="text-gray-500">Belum ada kehadiran</p>
                      )}
                    </div>
                    <div className="bg-gray-50 p-2 md:p-4 rounded-lg shadow-sm">
                      <h4 className="font-medium mb-2 text-gray-800">
                        Nilai Terakhir - {student.first_name}
                      </h4>
                      {student.results && student.results.length > 0 ? (
                        <div className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md">
                          <span className="text-gray-600">Nilai</span>
                          <span className="text-2xl font-bold text-blue-600">
                            {student.results[0].score}/100
                          </span>
                        </div>
                      ) : (
                        <p className="text-gray-500">Belum ada nilai</p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Admin Details */}
      {role === "ADMIN" && data && (
        <div className="bg-white rounded-lg shadow-md p-2 md:p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base ps-2 md:0 font-bold text-gray-800">
              Detail Admin
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
            <div className="bg-gray-50 p-2 md:p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">
                Informasi Pribadi
              </h3>
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md">
                  <span className="text-gray-600 font-medium">
                    Golongan Darah
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {data.blood_type}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md">
                  <span className="text-gray-600 font-medium">
                    Jenis Kelamin
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {data.sex === "MALE" ? "Laki-laki" : "Perempuan"}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md">
                  <span className="text-gray-600 font-medium">
                    Tanggal Lahir
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {dayjs(data.birthday).format("DD MMMM YYYY")}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md">
                  <span className="text-gray-600 font-medium">
                    Nomor Telepon
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {data.phone || "Tidak ada"}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row justify-between md:items-center p-3 bg-white rounded-md">
                  <span className="text-gray-600 font-medium">Alamat</span>
                  <span className="text-gray-900 font-semibold">
                    {data.address || "Tidak ada"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Account Details */}
      <div className="bg-white rounded-lg shadow-md p-2 md:p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base ps-2 md:0 font-bold text-gray-800">
            Detail Akun
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          <div className="bg-gray-50 p-2 md:p-4 rounded-lg shadow-sm">
            <h3 className="font-medium mb-2 text-gray-800">ID Akun</h3>
            <div className="p-3 bg-white rounded-md text-gray-800">
              {data?.id}
            </div>
          </div>

          <div className="bg-gray-50 p-2 md:p-4 rounded-lg shadow-sm">
            <h3 className="font-medium mb-2 text-gray-800">Username</h3>
            <div className="p-3 bg-white rounded-md text-gray-800">
              {data?.username || "Tidak ada"}
            </div>
          </div>

          <div className="bg-gray-50 p-2 md:p-4 rounded-lg shadow-sm">
            <h3 className="font-medium mb-2 text-gray-800">Tanggal Dibuat</h3>
            <div className="p-3 bg-white rounded-md text-gray-800">
              {data?.created_at
                ? dayjs(data.created_at).format("DD MMMM YYYY")
                : "Tidak ada"}
            </div>
          </div>

          <div className="bg-gray-50 p-2 md:p-4 rounded-lg shadow-sm">
            <h3 className="font-medium mb-2 text-gray-800">
              Tanggal Diperbarui
            </h3>
            <div className="p-3 bg-white rounded-md text-gray-800">
              {data?.updated_at
                ? dayjs(data.updated_at).format("DD MMMM YYYY")
                : "Tidak ada"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
