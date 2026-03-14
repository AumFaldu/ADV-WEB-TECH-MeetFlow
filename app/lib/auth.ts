import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { Role, Permission, hasPermission } from "./rbac";
import { prisma } from "./prisma";

export interface AuthUser {
  userId: number;
  role: Role;
  staffId?: number | null;
}

const JWT_SECRET = process.env.JWT_SECRET!;
export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {userId:number,role:Role};
    const dbUser = await prisma.users.findUnique({
      where: { UserID: decoded.userId },
      select: {
        StaffID: true,
      },
    });
    return {
      userId: decoded.userId,
      role: decoded.role,
      staffId: dbUser?.StaffID ?? null,
    };
  } catch {
    return null;
  }
}
export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

export async function requirePermission(
  permission: Permission
): Promise<AuthUser> {
  const user = await requireAuth();

  if (!hasPermission(user.role, permission)) {
    throw new Error("Forbidden");
  }
  return user;
}