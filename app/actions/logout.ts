"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.set("authToken", "", {
    httpOnly: true,
    secure: true,
    path: "/",
    expires: new Date(0),
  });

  redirect("/login");
}