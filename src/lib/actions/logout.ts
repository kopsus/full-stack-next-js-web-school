"use server";

import { cookies } from "next/headers";
import { responServerAction } from "./responServerActionType";

export default async function logout() {
  cookies().delete("session");
  return responServerAction({
    statusSuccess: true,
    messageSuccess: "Logout success",
    statusError: false,
  })
}
