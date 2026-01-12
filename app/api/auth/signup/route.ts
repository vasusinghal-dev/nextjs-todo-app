import { createSession } from "@/lib/auth/auth";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    ),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = signupSchema.parse(body);

    const existingUser = await query(
      `
    SELECT id FROM users
    WHERE email = $1
    `,
      [email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await query(
      `
    INSERT INTO users (name, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id
    `,
      [name, email, password_hash]
    );
    const userId = result.rows[0].id;

    await createSession(userId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      const errorMessage = `${String(firstError.path[0])}: ${
        firstError.message
      }`;

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    if (error.code === "23505") {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    console.error("Signup error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
