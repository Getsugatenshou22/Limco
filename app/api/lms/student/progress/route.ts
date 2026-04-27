import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/lms-auth";
import { completeLessonForUser, updateLastOpenedLesson } from "@/lib/lms-backend";

export async function POST(request: Request) {
  const session = await getSessionFromCookies();

  if (!session || session.role !== "student") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    courseId?: string;
    lessonId?: string;
    action?: "complete" | "open";
  };

  if (!body.courseId || !body.lessonId || !body.action) {
    return NextResponse.json({ message: "courseId, lessonId, and action are required." }, { status: 400 });
  }

  if (body.action === "open") {
    await updateLastOpenedLesson(session.userId, body.courseId, body.lessonId);
    return NextResponse.json({ success: true });
  }

  const progress = await completeLessonForUser(session.userId, body.courseId, body.lessonId);
  return NextResponse.json({ progress });
}
