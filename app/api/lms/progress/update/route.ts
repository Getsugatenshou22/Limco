import { NextResponse } from "next/server";
import { completeLessonForUser } from "@/lib/lms-backend";
import { getSessionFromCookies } from "@/lib/lms-auth";

export async function POST(request: Request) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "student") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    courseId?: string;
    completedLessonId?: string;
  };

  if (!body.courseId || !body.completedLessonId) {
    return NextResponse.json(
      { message: "courseId and completedLessonId are required" },
      { status: 400 },
    );
  }

  const updated = await completeLessonForUser(session.userId, body.courseId, body.completedLessonId);

  return NextResponse.json({ progress: updated });
}
