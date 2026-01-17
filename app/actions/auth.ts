"use server";

import { createSession, deleteSession } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.email().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character",
    ),
});

const loginSchema = z.object({
  email: z.email("Invalid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export type authState = { error?: string };

export async function signupAction(
  prevState: authState | null,
  formData: FormData,
): Promise<authState> {
  const validatedData = signupSchema.safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    password: formData.get("password") ?? "",
  });

  if (!validatedData.success) {
    const issue = validatedData.error.issues[0];
    const field = issue.path.length > 0 ? String(issue.path[0]) : "form";
    return { error: `${field}: ${issue.message}` };
  }

  const { name, email, password } = validatedData.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      if (existingUser.password_hash) {
        return { error: "User already exists" };
      } else {
        const password_hash = await bcrypt.hash(password, 10);

        const user = await prisma.user.update({
          where: {
            email,
          },
          data: {
            name,
            password_hash,
          },
          select: {
            id: true,
          },
        });
        await createSession(user.id);
      }
    } else {
      const password_hash = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          name,
          password_hash,
        },
        select: {
          id: true,
        },
      });
      await createSession(user.id);
    }
  } catch (err) {
    console.error("Signup error:", err);
    return { error: "Signup failed. Please try again." };
  }

  redirect("/dashboard");
}

export async function loginAction(
  prevState: authState | null,
  formData: FormData,
): Promise<authState> {
  const validatedData = loginSchema.safeParse({
    email: formData.get("email") ?? "",
    password: formData.get("password") ?? "",
  });

  if (!validatedData.success) {
    const issue = validatedData.error.issues[0];
    const field = issue.path.length > 0 ? String(issue.path[0]) : "form";
    return { error: `${field}: ${issue.message}` };
  }

  const { email, password } = validatedData.data;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        password_hash: true,
        oauth_accounts: {
          select: {
            provider: true,
          },
        },
      },
    });

    if (!user) {
      return { error: "Invalid credentials" };
    } else if (!user.password_hash) {
      const providers = user.oauth_accounts.map(
        (a) => a.provider[0].toUpperCase() + a.provider.slice(1),
      );
      return {
        error: `Account already exists. You can log in using ${providers.join(" or ")}.`,
      };
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return { error: "Invalid credentials" };
    }

    await createSession(user.id);
  } catch (err) {
    console.error("Login error:", err);
    return { error: "Login failed. Please try again." };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}
