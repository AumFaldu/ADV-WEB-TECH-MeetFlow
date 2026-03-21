import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { Role, Permission, hasPermission } from "./rbac";
import { prisma } from "./prisma";
import { redirect } from "next/navigation";

export interface AuthUser {
  userId: number;
  role: Role;
  staffId?: number | null;
}

const JWT_SECRET = process.env.JWT_SECRET!;

function unauthorized(): never {
  redirect("/unauthorized");
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    const dbUser = await prisma.users.findUnique({
      where: { UserID: decoded.userId },
      select: {
        Role: true,
        StaffID: true,
        IsActive: true, // optional but recommended
      },
    });

    if (!dbUser || dbUser.IsActive === false) {
      return null;
    }

    return {
      userId: decoded.userId,
      role: dbUser.Role as Role,
      staffId: dbUser.StaffID ?? null,
    };
  } catch (err) {
    console.error("JWT Error:", err);
    return null;
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser();

  if (!user) unauthorized();

  return user!;
}

export async function requirePermission(
  permission: Permission
): Promise<AuthUser> {
  const user = await requireAuth();

  if (!hasPermission(user.role, permission)) {
    unauthorized();
  }

  return user;
}
