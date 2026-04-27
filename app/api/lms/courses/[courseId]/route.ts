import { NextResponse } from "next/server";
import { getCourseByIdFromDb } from "@/lib/lms-backend";
import { getSessionFromCookies } from "@/lib/lms-auth";

type CourseRouteProps = {
  params: Promise<{ courseId: string }>;
};

export async function GET(_: Request, { params }: CourseRouteProps) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await params;
  const course = await getCourseByIdFromDb(courseId);

  if (!course) {
    return NextResponse.json({ message: "Course not found" }, { status: 404 });
  }

  return NextResponse.json({ course });
}
