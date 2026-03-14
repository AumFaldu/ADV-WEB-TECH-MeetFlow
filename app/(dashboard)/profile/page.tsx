import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import UserProfileCard from "./UserProfileCard";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-red-600 font-semibold">Not logged in</p>
      </div>
    );

  let user;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };

    const data = await prisma.users.findUnique({
      where: { UserID: decoded.userId },
      include: {
  staff: {
    include: {
      department: true
    }
  }
}

    });
    if (!data) throw new Error("User not found");

    user = JSON.parse(JSON.stringify(data));
  } catch {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-red-600 font-semibold">Invalid token</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 animate-fade-in">
        Your Profile
      </h1>
      <UserProfileCard user={user}  />
    </div>
  );
}