"use server";

import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { z } from "zod";
import { baseUserSchema } from "../schemas/userSchema";
const registerSchema = baseUserSchema
  .extend({
    confirmPassword: z.string().min(6),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export async function registerUser(prevState: any, formData: FormData) {
  const rawData = {
    name: formData.get("name")?.toString(),
    email: formData.get("email")?.toString(),
    password: formData.get("password")?.toString(),
    confirmPassword: formData.get("confirmPassword")?.toString(),
    role: formData.get("role"),
  };

  const parsed = registerSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: "",
    };
  }

  const { name, email, password, role } = parsed.data;

  const existingUser = await prisma.users.findUnique({
    where: { Email: email },
  });

  if (existingUser) {
    return {
      errors: { email: ["Email already registered"] },
      message: "",
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  let staffId: number | null = null;
    const staff = await prisma.staff.create({
      data: {
        StaffName: name,
        EmailAddress: email,
      },
    });

    staffId = staff.StaffID;

  await prisma.users.create({
    data: {
      UserName: name,
      StaffID: staffId,
      Email: email,
      Password_Hash: passwordHash,
      Role: role,
    },
  });

  redirect("/dashboard");
}
