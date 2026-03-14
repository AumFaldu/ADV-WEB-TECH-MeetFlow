import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import EditProfileForm from "./EditProfileForm";

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function EditProfilePage() {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("authToken")?.value;
  if (!token) return <p>Unauthorized</p>;

  const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

  const user = await prisma.users.findUnique({
    where: { UserID: decoded.userId },
    include: { staff: true }
  });

  if (!user) return <p>User not found</p>;

  return <EditProfileForm user={JSON.parse(JSON.stringify(user))} />;
}
