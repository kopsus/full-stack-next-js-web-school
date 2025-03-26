import { cookies } from "next/headers";
import { decrypt } from "@/lib/actions/session";
import { redirect } from "next/navigation";
import { getDataUser } from "@/lib/actions/data-user";
import ProfileClient from "./ProfileClient";

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

  return <ProfileClient data={data} role={role} />;
};

export default ProfilePage;
