"use server";

import { cookies } from "next/headers";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { z } from "zod";
import { baseUserSchema } from "../schemas/userSchema";

// Only validate email and password now
const loginSchema = baseUserSchema.pick({
  email: true,
  password: true,
});

export async function checkLogin(state: { errors?: Record<string, string[]>; message?: string } | null,formData: FormData) {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(rawData);

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data;
  const user = await prisma.users.findUnique({
    where: { Email: email },
    select: {
      UserID: true,
      UserName: true,
      Role: true,
      Password_Hash: true,
      IsActive: true,
    },
  });

  if (!user || !user.IsActive) {
    return { message: "Invalid credentials" };
  }

  const isValid = await bcrypt.compare(password, user.Password_Hash);
  if (!isValid) {
    return { message: "Invalid credentials" };
  }

  const JWT_SECRET = process.env.JWT_SECRET!;

  const token = jwt.sign(
    { userId: user.UserID, role: user.Role, name: user.UserName },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  const cookieStore = await cookies();
  cookieStore.set("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 3600,
  });

  redirect("/dashboard");
}
