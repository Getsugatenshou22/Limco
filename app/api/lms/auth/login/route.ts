import { NextResponse } from "next/server";
import { authenticateLmsUser } from "@/lib/lms-backend";
import { setAuthCookie } from "@/lib/lms-auth";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
  };

  if (!body.email || !body.password) {
    return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
  }

  const session = await authenticateLmsUser(body.email, body.password);
  if (!session) {
    return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
  }

  await setAuthCookie(session);
  return NextResponse.json({ session });
}
