import { NextResponse } from "next/server";
import { applyEnrollmentDecision } from "@/lib/lms-backend";
import { getSessionFromCookies } from "@/lib/lms-auth";

export async function POST(request: Request) {
  const session = await getSessionFromCookies();

  if (!session || session.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    userId?: string;
    courseId?: string;
    decision?: "approved" | "rejected";
  };

  if (!body.userId || !body.courseId || !body.decision) {
    return NextResponse.json({ message: "userId, courseId, and decision are required." }, { status: 400 });
  }

  await applyEnrollmentDecision(body.userId, body.courseId, body.decision);
  return NextResponse.json({ success: true });
}
