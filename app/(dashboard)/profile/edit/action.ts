"use server";

import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { z } from "zod";
import { baseUserSchema } from "@/app/schemas/userSchema";

const JWT_SECRET = process.env.JWT_SECRET!;

const editProfileSchema = baseUserSchema
  .pick({
    name: true,
    email: true,
    mobile: true,
  })
  .extend({
    mobile: z
      .string()
      .regex(/^\d{10}$/, "Mobile must be 10 digits")
      .optional()
      .or(z.literal("")),
  });

export async function updateProfile(prevState: any, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());

  const parsed = editProfileSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, mobile } = parsed.data;

  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    return { message: "Unauthorized" };
  }

  const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

  const user = await prisma.users.update({
    where: { UserID: decoded.userId },
    data: {
      Email: email,
      UserName: name,
    },
  });

  if (user.StaffID) {
    await prisma.staff.update({
      where: { StaffID: user.StaffID },
      data: {
        StaffName: name,
        MobileNo: mobile,
      },
    });
  }

  redirect("/profile");
}
