import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import DashboardLayoutClient from "./DashboardLayoutClient";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  let role: "ADMIN" | "CONVENER" | "STAFF" = "STAFF";

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as any;

      role = decoded.role;
    } catch {
      role = "STAFF";
    }
  }

  return (
    <DashboardLayoutClient role={role}>
      {children}
    </DashboardLayoutClient>
  );
}