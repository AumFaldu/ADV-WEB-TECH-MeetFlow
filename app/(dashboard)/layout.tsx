import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import DashboardLayoutClient from "./DashboardLayoutClient";
import {requireAuth} from "@/app/lib/auth"

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth()

  return (
    <DashboardLayoutClient role={user.role}>
      {children}
    </DashboardLayoutClient>
  );
}
