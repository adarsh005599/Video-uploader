import { connDB } from "@/app/utils/db";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and Password are required!" },
        { status: 400 }
      );
    }

    await connDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Oops!! User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "User SignUp Successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("SignUp Failed!", error);
    return NextResponse.json(
      { error: "Failed to Signup" },
      { status: 400 }
    );
  }
}